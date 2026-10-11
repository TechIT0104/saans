"""Amazon Bedrock (Converse API): look at the 360° photos and name the pollution sources,
then write the family's summary and the complaint letter.

Model is configurable (SAANS_VISION_MODEL / SAANS_TEXT_MODEL); default is Amazon Nova.
Structured output is enforced with a forced tool call whose input schema is the result we want.
"""
import json
import os

import boto3
from botocore.config import Config

from .knowledge import SOURCES

REGION = os.environ.get("AWS_REGION", "ap-south-1")
VISION_MODEL = os.environ.get("SAANS_VISION_MODEL", "apac.amazon.nova-pro-v1:0")
TEXT_MODEL = os.environ.get("SAANS_TEXT_MODEL", "apac.amazon.nova-lite-v1:0")

_client = None


def client():
    global _client
    if _client is None:
        _client = boto3.client("bedrock-runtime", region_name=REGION,
                               config=Config(read_timeout=90, retries={"max_attempts": 2}))
    return _client


SCAN_TOOL = {
    "toolSpec": {
        "name": "report_scan",
        "description": "Report the air-pollution sources visible in the user's photos.",
        "inputSchema": {"json": {
            "type": "object",
            "properties": {
                "photos": {"type": "array", "items": {
                    "type": "object",
                    "properties": {
                        "index": {"type": "integer"},
                        "setting": {"type": "string", "enum": ["indoor", "outdoor"]},
                        "scene": {"type": "string", "description": "One short sentence describing the photo."},
                        "visible_haze": {"type": "string", "enum": ["none", "light", "heavy"]},
                    },
                    "required": ["index", "setting", "scene", "visible_haze"],
                }},
                "sources": {"type": "array", "items": {
                    "type": "object",
                    "properties": {
                        "type": {"type": "string", "enum": list(SOURCES.keys())},
                        "photo_index": {"type": "integer"},
                        "evidence": {"type": "string", "description": "Exactly what in the photo shows this source."},
                        "distance": {"type": "string", "enum": ["inside", "near", "street", "far"]},
                        "active": {"type": "boolean", "description": "True if it is emitting right now (smoke, dust visible, coil lit)."},
                        "confidence": {"type": "number"},
                    },
                    "required": ["type", "photo_index", "evidence", "distance", "active", "confidence"],
                }},
                "ventilation": {"type": "string", "enum": ["open", "closed", "unknown"]},
                "air_purifier_visible": {"type": "boolean"},
                "notes": {"type": "string"},
            },
            "required": ["photos", "sources", "ventilation", "air_purifier_visible"],
        }},
    }
}

SCAN_PROMPT = """You are an air-pollution field inspector in India. The user took {n} photos turning around where they live (outdoors and/or inside their home).
Find every visible source of air pollution, or clear evidence of one. Only report what you can actually see: no guessing from the type of place.
Indian context: kachra being burnt in a lane or plot, uncovered sand/debris at construction sites, broken or kachcha roads, idling autos/buses, DG sets, chimneys, brick kilns, garbage heaps; indoors: mosquito coils, agarbatti/dhoop, wood/dung chulhas, gas stoves with no exhaust, cigarettes/bidis, kerosene lamps, damp walls with mould.
Our smoke detector model already found these boxes (photo index -> label, confidence): {hints}. Use them as hints, but confirm them visually.
Also judge whether windows/doors look open or closed, and whether an air purifier is visible.
Call report_scan with your findings. If nothing is found, return an empty sources list."""


def _image_block(jpeg: bytes):
    return {"image": {"format": "jpeg", "source": {"bytes": jpeg}}}


def _tool_input(resp, name):
    for block in resp["output"]["message"]["content"]:
        if "toolUse" in block and block["toolUse"]["name"] == name:
            return block["toolUse"]["input"]
    # Fall back to JSON in plain text
    for block in resp["output"]["message"]["content"]:
        if "text" in block:
            t = block["text"]
            s, e = t.find("{"), t.rfind("}")
            if s >= 0 and e > s:
                return json.loads(t[s:e + 1])
    raise ValueError("model returned no structured result")


def analyse_photos(jpegs: list[bytes], smoke_hints: dict) -> dict:
    parts = []
    for i, boxes in smoke_hints.items():
        if boxes:
            parts.append("photo %s: %s" % (i, ", ".join("%s %.2f" % (b["label"], b["confidence"]) for b in boxes)))
    hints = "; ".join(parts) or "none"
    content = []
    for i, j in enumerate(jpegs):
        content += [{"text": f"Photo {i}:"}, _image_block(j)]
    content.append({"text": SCAN_PROMPT.format(n=len(jpegs), hints=hints)})
    resp = client().converse(
        modelId=VISION_MODEL,
        messages=[{"role": "user", "content": content}],
        toolConfig={"tools": [SCAN_TOOL], "toolChoice": {"tool": {"name": "report_scan"}}},
        inferenceConfig={"maxTokens": 2000, "temperature": 0.1},
    )
    out = _tool_input(resp, "report_scan")
    out["sources"] = [s for s in out.get("sources", []) if s.get("type") in SOURCES and s.get("confidence", 0) >= 0.4]
    return out


PLAN_TOOL = {
    "toolSpec": {
        "name": "write_plan",
        "description": "Write the family's summary and, if needed, the complaint.",
        "inputSchema": {"json": {
            "type": "object",
            "properties": {
                "headline": {"type": "string", "description": "One sentence: the single biggest reason the air is bad for this family right now."},
                "summary": {"type": "string", "description": "3-4 short sentences in plain words. No jargon."},
                "complaint_subject": {"type": "string"},
                "complaint_body": {"type": "string", "description": "Formal complaint letter, or empty string if there is no outdoor violation."},
            },
            "required": ["headline", "summary", "complaint_subject", "complaint_body"],
        }},
    }
}


def write_plan(context: dict, lang: str) -> dict:
    language = "Hindi (Devanagari script, simple everyday words)" if lang == "hi" else "simple English"
    prompt = f"""You help an Indian family understand why the air around them is bad and what to do.
Write in {language}. Be specific to what was found; never invent sources that are not in the data.
Data (JSON): {json.dumps(context, ensure_ascii=False)}
- headline: the single biggest cause of bad air for this family right now (indoor sources often matter more than outdoor ones).
- summary: what is happening and the 2 most important things to do today.
- complaint_body: only if an outdoor violation was found. Address it to "The Municipal Commissioner / State Pollution Control Board". Include the location (lat/lon and map link), date and time, what was seen, the rule it violates (use the 'law' text given), and ask for inspection and action. Sign as "A resident (via Saans)". Otherwise empty string.
Call write_plan."""
    resp = client().converse(
        modelId=TEXT_MODEL,
        messages=[{"role": "user", "content": [{"text": prompt}]}],
        toolConfig={"tools": [PLAN_TOOL], "toolChoice": {"tool": {"name": "write_plan"}}},
        inferenceConfig={"maxTokens": 1500, "temperature": 0.3},
    )
    return _tool_input(resp, "write_plan")


def speak(text: str, lang: str) -> bytes:
    polly = boto3.client("polly", region_name=REGION)
    voice = "Kajal"
    try:
        r = polly.synthesize_speech(Text=text[:2900], OutputFormat="mp3", VoiceId=voice, Engine="neural",
                                    LanguageCode="hi-IN" if lang == "hi" else "en-IN")
    except Exception:
        r = polly.synthesize_speech(Text=text[:2900], OutputFormat="mp3", VoiceId="Aditi", Engine="standard",
                                    LanguageCode="hi-IN" if lang == "hi" else "en-IN")
    return r["AudioStream"].read()
