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
from . import llm, store, vision
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
            photos.append({**p, "smoke_boxes": smoke.get(i, []), "haze_model": haze.get(i) if p["setting"] == "outdoor" else None})
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
            plan = await asyncio.to_thread(llm.write_plan, ctx, lang)
        except Exception:
            log.exception("plan llm")

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
