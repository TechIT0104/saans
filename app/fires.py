"""Smoke Watch: which satellite-detected fires are upwind of you, and when their smoke can arrive.

Fires: NASA FIRMS VIIRS active-fire detections (S-NPP + NOAA-20), South Asia, last 24 hours.
Wind: Open-Meteo forecast. We use the 850 hPa wind (about 1.5 km up, where smoke is carried over
long distances) averaged over the next 12 hours, falling back to the 10 m wind.
"""
import csv
import io
import math
import time

import httpx

FIRMS = [
    "https://firms.modaps.eosdis.nasa.gov/data/active_fire/suomi-npp-viirs-c2/csv/SUOMI_VIIRS_C2_South_Asia_24h.csv",
    "https://firms.modaps.eosdis.nasa.gov/data/active_fire/noaa-20-viirs-c2/csv/J1_VIIRS_C2_South_Asia_24h.csv",
]
WX_URL = "https://api.open-meteo.com/v1/forecast"
RADIUS_KM = 600
UPWIND_HALF_ANGLE = 30
_cache = {"t": 0, "fires": []}
COMPASS = ["north", "north-east", "east", "south-east", "south", "south-west", "west", "north-west"]
COMPASS_HI = ["उत्तर", "उत्तर-पूर्व", "पूर्व", "दक्षिण-पूर्व", "दक्षिण", "दक्षिण-पश्चिम", "पश्चिम", "उत्तर-पश्चिम"]


async def _load_fires():
    if time.time() - _cache["t"] < 1800 and _cache["fires"]:
        return _cache["fires"]
    seen, fires = set(), []
    async with httpx.AsyncClient(timeout=40, follow_redirects=True) as client:
        for url in FIRMS:
            try:
                text = (await client.get(url)).text
            except Exception:
                continue
            for row in csv.DictReader(io.StringIO(text)):
                if row.get("confidence", "").lower() in ("l", "low"):
                    continue
                lat, lon = float(row["latitude"]), float(row["longitude"])
                key = (round(lat, 2), round(lon, 2))  # merge the two satellites' detections of one fire
                if key in seen:
                    continue
                seen.add(key)
                fires.append({"lat": lat, "lon": lon, "frp": float(row.get("frp") or 0),
                              "time": f"{row['acq_date']} {row['acq_time'][:2]}:{row['acq_time'][2:]} UTC"})
    if fires:
        _cache.update(t=time.time(), fires=fires)
    return fires


def _dist_bearing(lat1, lon1, lat2, lon2):
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dl = math.radians(lon2 - lon1)
    a = math.sin((p2 - p1) / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    d = 6371 * 2 * math.asin(math.sqrt(a))
    y = math.sin(dl) * math.cos(p2)
    x = math.cos(p1) * math.sin(p2) - math.sin(p1) * math.cos(p2) * math.cos(dl)
    return d, (math.degrees(math.atan2(y, x)) + 360) % 360


async def _wind(lat, lon):
    async with httpx.AsyncClient(timeout=20) as client:
        h = (await client.get(WX_URL, params={
            "latitude": lat, "longitude": lon, "forecast_hours": 12, "timezone": "Asia/Kolkata",
            "hourly": "wind_speed_10m,wind_direction_10m,wind_speed_850hPa,wind_direction_850hPa",
        })).json()["hourly"]
    for lvl in ("850hPa", "10m"):
        sp, dr = h.get(f"wind_speed_{lvl}") or [], h.get(f"wind_direction_{lvl}") or []
        pairs = [(s, d) for s, d in zip(sp, dr) if s is not None and d is not None]
        if pairs:
            # Vector mean, so 350° and 10° average to 0°, not 180°.
            u = sum(s * math.sin(math.radians(d)) for s, d in pairs) / len(pairs)
            v = sum(s * math.cos(math.radians(d)) for s, d in pairs) / len(pairs)
            return {"from_deg": (math.degrees(math.atan2(u, v)) + 360) % 360,
                    "speed_kmh": sum(s for s, _ in pairs) / len(pairs), "level": lvl}
    return {"from_deg": 0, "speed_kmh": 0, "level": "none"}


async def smoke_watch(lat: float, lon: float) -> dict:
    fires, wind = await _load_fires(), await _wind(lat, lon)
    near, upwind = [], []
    for f in fires:
        d, b = _dist_bearing(lat, lon, f["lat"], f["lon"])
        if d > RADIUS_KM:
            continue
        diff = abs((b - wind["from_deg"] + 180) % 360 - 180)
        up = diff <= UPWIND_HALF_ANGLE and wind["speed_kmh"] >= 2
        item = {**f, "dist_km": round(d), "upwind": up}
        near.append(item)
        if up:
            upwind.append(item)
    spd = max(wind["speed_kmh"], 0.1)
    dists = sorted(f["dist_km"] for f in upwind)
    median = dists[len(dists) // 2] if dists else None
    n_up = len(upwind)
    risk = "high" if n_up >= 100 else "medium" if n_up >= 20 else "low"
    if wind["speed_kmh"] < 5 and len([f for f in near if f["dist_km"] < 100]) >= 10:
        risk = "medium" if risk == "low" else risk  # calm air lets nearby smoke settle
    k = int(((wind["from_deg"] + 22.5) % 360) // 45)
    near.sort(key=lambda f: (not f["upwind"], f["dist_km"]))
    return {
        "source": "NASA FIRMS VIIRS (S-NPP, NOAA-20), last 24 h; wind from Open-Meteo",
        "radius_km": RADIUS_KM, "fires_near": len(near), "fires_upwind": n_up,
        "frp_upwind": round(sum(f["frp"] for f in upwind)),
        "wind": {**wind, "from_deg": round(wind["from_deg"]), "speed_kmh": round(wind["speed_kmh"], 1),
                 "from_name": COMPASS[k], "from_name_hi": COMPASS_HI[k]},
        "nearest_upwind_km": dists[0] if dists else None, "median_upwind_km": median,
        "eta_hours": round(median / spd) if median else None,
        "risk": risk, "half_angle": UPWIND_HALF_ANGLE,
        "fires": near[:1500],
    }
