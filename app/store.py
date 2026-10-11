"""Community reports: DynamoDB on AWS, a local JSON file in development.

Only anonymous data is stored: location rounded to ~100 m, source types, AQI and time. No photos.
"""
import json
import os
import time
import uuid
from decimal import Decimal
from pathlib import Path

TABLE = os.environ.get("SAANS_TABLE")
LOCAL = Path(__file__).resolve().parent.parent / "data" / "reports.json"
_table = None


def _ddb():
    global _table
    if _table is None:
        import boto3
        _table = boto3.resource("dynamodb", region_name=os.environ.get("AWS_REGION", "ap-south-1")).Table(TABLE)
    return _table


def save_report(lat: float, lon: float, sources: list, aqi) -> dict:
    item = {
        "id": uuid.uuid4().hex, "ts": int(time.time()),
        "lat": round(lat, 3), "lon": round(lon, 3),
        "sources": sorted(set(sources)), "aqi": aqi,
    }
    if TABLE:
        _ddb().put_item(Item=json.loads(json.dumps(item), parse_float=Decimal))
    else:
        LOCAL.parent.mkdir(exist_ok=True)
        items = json.loads(LOCAL.read_text()) if LOCAL.exists() else []
        items.append(item)
        LOCAL.write_text(json.dumps(items))
    return item


def list_reports(days: int = 30) -> list:
    since = int(time.time()) - days * 86400
    if TABLE:
        items, kw = [], {}
        while True:
            r = _ddb().scan(**kw)
            items += r["Items"]
            if "LastEvaluatedKey" not in r:
                break
            kw["ExclusiveStartKey"] = r["LastEvaluatedKey"]
        items = json.loads(json.dumps(items, default=float))
    else:
        items = json.loads(LOCAL.read_text()) if LOCAL.exists() else []
    return [i for i in items if i["ts"] >= since]
