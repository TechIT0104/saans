"""Air quality for any point in India: CAMS forecast via Open-Meteo, converted to India's NAQI."""
from datetime import datetime

import httpx

AQ_URL = "https://air-quality-api.open-meteo.com/v1/air-quality"
WX_URL = "https://api.open-meteo.com/v1/forecast"

# CPCB National AQI breakpoints: (conc_lo, conc_hi, aqi_lo, aqi_hi)
PM25_BP = [(0, 30, 0, 50), (31, 60, 51, 100), (61, 90, 101, 200), (91, 120, 201, 300), (121, 250, 301, 400), (251, 500, 401, 500)]
PM10_BP = [(0, 50, 0, 50), (51, 100, 51, 100), (101, 250, 101, 200), (251, 350, 201, 300), (351, 430, 301, 400), (431, 600, 401, 500)]
CATEGORIES = [(50, "Good"), (100, "Satisfactory"), (200, "Moderate"), (300, "Poor"), (400, "Very Poor"), (500, "Severe")]
CATEGORIES_HI = {"Good": "अच्छी", "Satisfactory": "संतोषजनक", "Moderate": "मध्यम", "Poor": "खराब", "Very Poor": "बहुत खराब", "Severe": "गंभीर"}


def sub_index(c, bps):
    if c is None:
        return None
    for lo, hi, alo, ahi in bps:
        if c <= hi:
            c = max(c, lo)
            return round(alo + (ahi - alo) * (c - lo) / (hi - lo))
    return 500


def naqi(pm25, pm10):
    vals = [v for v in (sub_index(pm25, PM25_BP), sub_index(pm10, PM10_BP)) if v is not None]
    return max(vals) if vals else None


def category(aqi):
    if aqi is None:
        return None
    for top, name in CATEGORIES:
        if aqi <= top:
            return name
    return "Severe"


def pm25_from_naqi(aqi):
    """Inverse of the PM2.5 sub-index, used to turn an AQI back into a concentration."""
    for lo, hi, alo, ahi in PM25_BP:
        if aqi <= ahi:
            return lo + (hi - lo) * (aqi - alo) / (ahi - alo)
    return 500


async def get_air(lat: float, lon: float) -> dict:
    async with httpx.AsyncClient(timeout=20) as client:
        aq = (await client.get(AQ_URL, params={
            "latitude": lat, "longitude": lon, "timezone": "Asia/Kolkata", "forecast_days": 5,
            "hourly": "pm2_5,pm10,nitrogen_dioxide,carbon_monoxide,dust",
            "current": "pm2_5,pm10",
        })).json()
        wx = (await client.get(WX_URL, params={
            "latitude": lat, "longitude": lon, "timezone": "Asia/Kolkata", "forecast_days": 5,
            "hourly": "temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m",
            "current": "temperature_2m,wind_speed_10m,wind_direction_10m",
        })).json()

    h = aq["hourly"]
    hours = []
    for i, t in enumerate(h["time"]):
        a = naqi(h["pm2_5"][i], h["pm10"][i])
        hours.append({
            "time": t, "aqi": a, "category": category(a),
            "pm25": h["pm2_5"][i], "pm10": h["pm10"][i], "no2": h["nitrogen_dioxide"][i],
            "wind": wx["hourly"]["wind_speed_10m"][i] if i < len(wx["hourly"]["time"]) else None,
        })

    cur = aq.get("current", {})
    now_aqi = naqi(cur.get("pm2_5"), cur.get("pm10"))
    now = datetime.fromisoformat(cur["time"]) if "time" in cur else datetime.now()
    upcoming = [x for x in hours if datetime.fromisoformat(x["time"]) >= now.replace(minute=0)]
    next24 = upcoming[:24]

    # Cleanest daylight window today/tomorrow for going outside (2 consecutive hours, 6:00-20:00).
    best = None
    for i in range(len(next24) - 1):
        a, b = next24[i], next24[i + 1]
        hr = datetime.fromisoformat(a["time"]).hour
        if 6 <= hr <= 19 and a["aqi"] is not None and b["aqi"] is not None:
            score = (a["aqi"] + b["aqi"]) / 2
            if best is None or score < best["aqi"]:
                best = {"start": a["time"], "end": b["time"], "aqi": round(score)}
    worst = max((x for x in next24 if x["aqi"] is not None), key=lambda x: x["aqi"], default=None)

    days = {}
    for x in hours:
        d = x["time"][:10]
        if x["aqi"] is not None:
            days.setdefault(d, []).append(x["aqi"])
    daily = [{"date": d, "max": max(v), "avg": round(sum(v) / len(v)), "category": category(max(v))} for d, v in days.items()]

    return {
        "lat": lat, "lon": lon, "source": "CAMS global forecast via Open-Meteo (~45 km grid)",
        "now": {"aqi": now_aqi, "category": category(now_aqi), "category_hi": CATEGORIES_HI.get(category(now_aqi)),
                "pm25": cur.get("pm2_5"), "pm10": cur.get("pm10"), "time": cur.get("time"),
                "temp": wx.get("current", {}).get("temperature_2m"),
                "wind_speed": wx.get("current", {}).get("wind_speed_10m"),
                "wind_dir": wx.get("current", {}).get("wind_direction_10m")},
        "next24": next24, "best_window": best, "worst_hour": worst, "daily": daily,
    }
