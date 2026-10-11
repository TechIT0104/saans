"""Saans API: know your air, see its sources, act on them."""
import asyncio
import io
import logging
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import List, Optional

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse, Response
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from . import air as airmod
from . import fires, llm, store, vision
from .knowledge import ACTIONS, COMPLAINT_CHANNELS, GENERAL, MEMBER_ADVICE, SOURCES, VIOLATIONS, indoor_estimate

log = logging.getLogger("saans")
STATIC = Path(__file__).resolve().parent / "static"
IST = timezone(timedelta(hours=5, minutes=30))

app = FastAPI(title="Saans")


@app.get("/api/air")
async def api_air(lat: float, lon: float):
    try:
        return await airmod.get_air(lat, lon)
    except Exception as e:
        log.exception("air")
        raise HTTPException(502, f"Air data unavailable: {e}")


def _jpeg(img) -> bytes:
    buf = io.BytesIO()
    img.save(buf, "JPEG", quality=85)
    return buf.getvalue()


def _rank_sources(found: list) -> list:
    """Merge duplicates and rank by how much each source is likely hurting this household."""
    dist_w = {"inside": 1.6, "near": 1.4, "street": 1.15, "far": 0.8}
    merged = {}
    for s in found:
        meta = SOURCES[s["type"]]
        score = meta["severity"] * dist_w.get(s.get("distance"), 1) * (1.4 if s.get("active") else 1) * (0.5 + s.get("confidence", 0.5))
        if meta.get("add"):
            score += meta["add"] / 60
        cur = merged.get(s["type"])
        if cur is None or score > cur["score"]:
            merged[s["type"]] = {**s, "score": round(score, 2), "name_en": meta["en"], "name_hi": meta["hi"],
                                 "where": meta["where"], "violation": meta.get("violation"),
                                 "photos": sorted({x["photo_index"] for x in found if x["type"] == s["type"]})}
    return sorted(merged.values(), key=lambda x: -x["score"])


def _actions(ranked: list, aqi, has_indoor: bool, members: list, purifier: bool) -> list:
    out = []
    for s in ranked:
        for a in ACTIONS.get(s["type"], []):
            out.append({**a, "for": s["type"], "for_en": s["name_en"], "for_hi": s["name_hi"]})
    if aqi and aqi > 100:
        out.append({**GENERAL["mask"], "for": "general"})
    if (has_indoor or (aqi and aqi > 200)) and not purifier:
        out.append({**GENERAL["purifier"], "for": "general"})
    if any(s["type"] in ("unpaved_road_dust", "construction_dust") for s in ranked):
        out.append({**GENERAL["wet_mop"], "for": "general"})
    # Free and high-impact first.
    out.sort(key=lambda a: (-a["impact"], a["cost"]))
    for m in members:
        if m in MEMBER_ADVICE:
            out.append({**MEMBER_ADVICE[m], "for": "member", "member": m, "cost": 0, "impact": 2})
    out.append({**GENERAL["plants_myth"], "for": "myth"})
    return out


def _complaint(ranked, violations, lat, lon, now) -> dict:
    seen = [s for s in ranked if s.get("violation")]
    what = "; ".join(f"{s['name_en']} ({s['evidence']})" for s in seen)
    law = "\n".join(f"- {VIOLATIONS[v]}" for v in violations)
    body = (
        "To\nThe Municipal Commissioner / State Pollution Control Board\n\n"
        f"Subject: Complaint about {', '.join(s['name_en'].lower() for s in seen)}\n\n"
        "Respected Sir/Madam,\n\n"
        f"On {now}, I observed the following at latitude {lat:.5f}, longitude {lon:.5f} "
        f"(map: https://maps.google.com/?q={lat:.5f},{lon:.5f}): {what}. A photograph is attached as evidence.\n\n"
        f"This is in violation of:\n{law}\n\n"
        "Children and people with asthma live nearby and are directly exposed. I request an inspection of the site "
        "and appropriate action under the applicable rules.\n\nYours faithfully,\nA resident (via Saans)"
    )
    return {"complaint_subject": f"Complaint: {seen[0]['name_en'].lower()} at {lat:.4f}, {lon:.4f}", "complaint_body": body}


def _hindi_plan(ranked, air, indoor, actions) -> dict:
    cat = airmod.CATEGORIES_HI.get(air["now"]["category"], "") if air else ""
    aqi = air["now"]["aqi"] if air else None
    head = f"{ranked[0]['name_hi']} आपकी हवा को सबसे ज़्यादा खराब कर रहा है।" if ranked else f"आज आपके इलाके की हवा {cat} है।"
    parts = [f"बाहर की हवा अभी {cat} है (AQI {aqi})।"] if aqi else []
    if indoor:
        parts.append(f"आपके कमरे का अनुमानित AQI {indoor['aqi_low']}–{indoor['aqi_high']} है।")
    todo = [a for a in actions if a.get("for") not in ("myth",)]
    if todo:
        parts.append("सबसे पहले: " + todo[0]["hi"])
    if len(todo) > 1:
        parts.append("फिर: " + todo[1]["hi"])
    return {"headline": head, "summary": " ".join(parts)}


@app.post("/api/scan")
async def api_scan(
    files: List[UploadFile] = File(...),
    lat: float = Form(...), lon: float = Form(...),
    lang: str = Form("en"), members: str = Form(""), settings: str = Form(""),
):
    if not 1 <= len(files) <= 6:
        raise HTTPException(400, "Send 1 to 6 photos.")
    imgs = [vision.open_image(await f.read()) for f in files]
    jpegs = [_jpeg(i) for i in imgs]
    member_list = [m for m in members.split(",") if m]

    air_task = asyncio.create_task(airmod.get_air(lat, lon))
    smoke = await asyncio.to_thread(lambda: {i: vision.smoke(im) for i, im in enumerate(imgs)})
    haze = await asyncio.to_thread(lambda: {i: vision.haze(im) for i, im in enumerate(imgs)})

    ai_ok = True
    try:
        scene = await asyncio.to_thread(llm.analyse_photos, jpegs, smoke, [x for x in settings.split(",") if x] or None)
    except Exception as e:
        log.exception("vision llm")
        ai_ok = False
        slot_settings = [x for x in settings.split(",") if x]
        scene = {"photos": [{"index": i, "setting": slot_settings[i] if i < len(slot_settings) else "outdoor", "scene": "", "visible_haze": "none"} for i in range(len(imgs))],
                 "sources": [], "ventilation": "unknown", "air_purifier_visible": False, "notes": f"AI scene analysis unavailable: {e}"}
    # Smoke our detector is confident about counts even if the scene model missed it.
    seen_types = {s["type"] for s in scene["sources"]}
    for i, boxes in smoke.items():
        if any(b["confidence"] >= 0.5 for b in boxes) and not seen_types & {"garbage_burning", "open_fire_smoke", "crop_residue_burning", "industrial_chimney", "brick_kiln", "biomass_chulha", "mosquito_coil", "incense_dhoop"}:
            scene["sources"].append({"type": "open_fire_smoke", "photo_index": i, "evidence": "Smoke detected by the Saans smoke model",
                                     "distance": "street", "active": True, "confidence": max(b["confidence"] for b in boxes)})

    try:
        air = await air_task
    except Exception:
        log.exception("air")
        air = None
    aqi = air["now"]["aqi"] if air else None
    pm25 = (air["now"]["pm25"] if air else None) or 60

    photos = []
    for p in scene["photos"]:
        i = p["index"]
        if 0 <= i < len(imgs):
            sboxes = [{"type": x["type"], "name_en": SOURCES[x["type"]]["en"], "name_hi": SOURCES[x["type"]]["hi"], "box": x["box"]}
                      for x in scene["sources"] if x.get("photo_index") == i and x.get("box")]
            photos.append({**p, "smoke_boxes": smoke.get(i, []), "source_boxes": sboxes, "haze_model": haze.get(i) if p["setting"] == "outdoor" else None})
    outdoor_haze = [h["haze_model"]["level"] for h in photos if h.get("haze_model")]
    haze_flag = None
    if outdoor_haze and "heavy" in outdoor_haze and aqi is not None and aqi <= 200:
        haze_flag = "Your photos look hazier than the regional forecast. Local sources may be making your area worse than the number shows."

    ranked = _rank_sources(scene["sources"])
    indoor_photos = [p for p in photos if p["setting"] == "indoor"]
    indoor = None
    if indoor_photos:
        indoor = indoor_estimate(pm25, scene.get("ventilation", "unknown"),
                                 [s["type"] for s in ranked if s["where"] == "indoor"], scene.get("air_purifier_visible", False))
        indoor["aqi_mid"] = airmod.naqi(indoor["pm25_mid"], None)
        indoor["aqi_low"] = airmod.naqi(indoor["pm25_low"], None)
        indoor["aqi_high"] = airmod.naqi(indoor["pm25_high"], None)
        indoor["category"] = airmod.category(indoor["aqi_mid"])

    actions = _actions(ranked, aqi, bool(indoor_photos), member_list, scene.get("air_purifier_visible", False))
    violations = sorted({s["violation"] for s in ranked if s.get("violation")})
    now = datetime.now(IST).strftime("%d %b %Y, %I:%M %p IST")

    plan = None
    if ai_ok:
        ctx = {
            "time": now, "location": {"lat": round(lat, 5), "lon": round(lon, 5), "map": f"https://maps.google.com/?q={lat:.5f},{lon:.5f}"},
            "outdoor_aqi_now": aqi, "category": air["now"]["category"] if air else None,
            "best_hours_today": air["best_window"] if air else None,
            "sources_ranked": [{"type": s["type"], "name": s["name_en"], "where": s["where"], "evidence": s["evidence"], "active": s.get("active")} for s in ranked],
            "indoor_estimate_pm25": indoor and {k: indoor[k] for k in ("pm25_low", "pm25_mid", "pm25_high", "from_outside", "from_inside")},
            "family": member_list, "top_actions": [a["en"] for a in actions[:4]],
            "law": [VIOLATIONS[v] for v in violations],
        }
        try:
            # The complaint is always written in formal English; Hindi headline/summary come from templates
            # because the 7B model's Hindi is not reliable enough.
            plan = await asyncio.to_thread(llm.write_plan, ctx, "en" if lang == "hi" else lang)
        except Exception:
            log.exception("plan llm")
    if lang == "hi":
        plan = {**(plan or {"complaint_subject": "", "complaint_body": ""}), **_hindi_plan(ranked, air, indoor, actions)}
    if plan is None:
        top = ranked[0]["name_en"] if ranked else None
        todo = [a["en"] for a in actions if a.get("for") != "myth"][:2]
        plan = {"headline": f"{top} is the biggest problem for your air right now." if top else
                f"Your area's air is {air['now']['category'] if air else 'unknown'} today.",
                "summary": " ".join(["First: " + todo[0]] + (["Then: " + todo[1]] if len(todo) > 1 else [])) if todo else "",
                "complaint_subject": "", "complaint_body": ""}
    if violations and not (plan.get("complaint_body") or "").strip():
        plan.update(_complaint(ranked, violations, lat, lon, now))

    report = None
    if ranked:
        try:
            report = store.save_report(lat, lon, [s["type"] for s in ranked], aqi)
        except Exception:
            log.exception("store")

    return {
        "time": now, "air": air, "photos": photos, "sources": ranked, "ventilation": scene.get("ventilation"),
        "purifier": scene.get("air_purifier_visible", False), "indoor": indoor, "haze_flag": haze_flag,
        "actions": actions, "plan": plan, "violations": [{"type": v, "law": VIOLATIONS[v]} for v in violations],
        "channels": COMPLAINT_CHANNELS if violations else [], "ai_ok": ai_ok, "notes": scene.get("notes"),
        "report_id": report and report["id"],
    }


@app.get("/api/smoke")
async def api_smoke(lat: float, lon: float):
    try:
        return await fires.smoke_watch(lat, lon)
    except Exception as e:
        log.exception("smoke")
        raise HTTPException(502, f"Smoke watch unavailable: {e}")


@app.get("/api/aqi-grid")
async def api_aqi_grid(lat: float, lon: float, n: int = 7, step: float = 0.4):
    """Forecast AQI on an n x n grid around a point, so the map shows how air varies across the region."""
    half = n // 2
    pts = [(round(lat + (r - half) * step, 4), round(lon + (c - half) * step, 4)) for r in range(n) for c in range(n)]
    import httpx
    async with httpx.AsyncClient(timeout=25) as client:
        res = (await client.get(airmod.AQ_URL, params={
            "latitude": ",".join(str(p[0]) for p in pts), "longitude": ",".join(str(p[1]) for p in pts),
            "current": "pm2_5,pm10", "timezone": "Asia/Kolkata"})).json()
    res = res if isinstance(res, list) else [res]
    cells = []
    for (la, lo), r in zip(pts, res):
        cur = r.get("current", {})
        a = airmod.naqi(cur.get("pm2_5"), cur.get("pm10"))
        cells.append({"lat": la, "lon": lo, "aqi": a, "category": airmod.category(a)})
    return {"step": step, "cells": cells}


@app.get("/api/reports")
async def api_reports(days: int = 30):
    return await asyncio.to_thread(store.list_reports, days)


class SpeakIn(BaseModel):
    text: str
    lang: str = "hi"


@app.post("/api/speak")
async def api_speak(body: SpeakIn):
    try:
        audio = await asyncio.to_thread(llm.speak, body.text, body.lang)
    except Exception as e:
        raise HTTPException(502, f"Voice unavailable: {e}")
    return Response(audio, media_type="audio/mpeg")


@app.get("/api/sources")
async def api_sources():
    return SOURCES


@app.get("/")
async def index():
    return FileResponse(STATIC / "index.html")


app.mount("/static", StaticFiles(directory=STATIC), name="static")
