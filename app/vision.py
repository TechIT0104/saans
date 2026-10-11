"""Our two GPU-trained models, served on CPU with ONNX Runtime.

- haze.onnx: ConvNeXt-Tiny fine-tuned on 12,240 India/Nepal photos -> clear / hazy / heavy.
- smoke.onnx: YOLO11s fine-tuned on D-Fire (21,527 images) -> smoke / fire boxes.
"""
import io
import json
from pathlib import Path

import numpy as np
import onnxruntime as ort
from PIL import Image, ImageOps

MODELS = Path(__file__).resolve().parent.parent / "models"
MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
STD = np.array([0.229, 0.224, 0.225], dtype=np.float32)
SMOKE_NAMES = ["smoke", "fire"]

_haze = _smoke = None
_haze_classes = ["clear", "hazy", "heavy"]


def _load():
    global _haze, _smoke, _haze_classes
    opts = ort.SessionOptions()
    opts.intra_op_num_threads = 2
    if _haze is None and (MODELS / "haze.onnx").exists():
        _haze = ort.InferenceSession(str(MODELS / "haze.onnx"), opts, providers=["CPUExecutionProvider"])
        meta = MODELS / "haze_metrics.json"
        if meta.exists():
            _haze_classes = json.loads(meta.read_text())["classes"]
    if _smoke is None and (MODELS / "smoke.onnx").exists():
        _smoke = ort.InferenceSession(str(MODELS / "smoke.onnx"), opts, providers=["CPUExecutionProvider"])


def open_image(data: bytes) -> Image.Image:
    img = ImageOps.exif_transpose(Image.open(io.BytesIO(data))).convert("RGB")
    img.thumbnail((1280, 1280))
    return img


def haze(img: Image.Image):
    _load()
    if _haze is None:
        return None
    w, h = img.size
    s = 224 / min(w, h)
    im = img.resize((max(224, round(w * s)), max(224, round(h * s))), Image.BILINEAR)
    l, t = (im.width - 224) // 2, (im.height - 224) // 2
    x = (np.asarray(im.crop((l, t, l + 224, t + 224)), dtype=np.float32) / 255 - MEAN) / STD
    logits, _ = _haze.run(None, {"image": x.transpose(2, 0, 1)[None].astype(np.float32)})
    p = np.exp(logits[0] - logits[0].max()); p /= p.sum()
    k = int(p.argmax())
    return {"level": _haze_classes[k], "confidence": round(float(p[k]), 2),
            "probs": {c: round(float(v), 2) for c, v in zip(_haze_classes, p)}}


def smoke(img: Image.Image, conf=0.30, iou=0.5):
    """Letterbox to 640, run YOLO, NMS. Returns boxes in 0-1 image coordinates."""
    _load()
    if _smoke is None:
        return []
    w, h = img.size
    r = 640 / max(w, h)
    nw, nh = round(w * r), round(h * r)
    canvas = Image.new("RGB", (640, 640), (114, 114, 114))
    px, py = (640 - nw) // 2, (640 - nh) // 2
    canvas.paste(img.resize((nw, nh), Image.BILINEAR), (px, py))
    x = np.asarray(canvas, dtype=np.float32).transpose(2, 0, 1)[None] / 255
    out = _smoke.run(None, {_smoke.get_inputs()[0].name: x})[0][0]  # (4+nc, 8400)
    out = out.T
    scores = out[:, 4:]
    cls = scores.argmax(1)
    sc = scores.max(1)
    keep = sc > conf
    boxes, cls, sc = out[keep, :4], cls[keep], sc[keep]
    if not len(sc):
        return []
    xyxy = np.stack([boxes[:, 0] - boxes[:, 2] / 2, boxes[:, 1] - boxes[:, 3] / 2,
                     boxes[:, 0] + boxes[:, 2] / 2, boxes[:, 1] + boxes[:, 3] / 2], 1)
    order = sc.argsort()[::-1]
    picked = []
    while len(order):
        i = order[0]
        picked.append(i)
        rest = order[1:]
        xx1 = np.maximum(xyxy[i, 0], xyxy[rest, 0]); yy1 = np.maximum(xyxy[i, 1], xyxy[rest, 1])
        xx2 = np.minimum(xyxy[i, 2], xyxy[rest, 2]); yy2 = np.minimum(xyxy[i, 3], xyxy[rest, 3])
        inter = np.clip(xx2 - xx1, 0, None) * np.clip(yy2 - yy1, 0, None)
        area = lambda b: (b[..., 2] - b[..., 0]) * (b[..., 3] - b[..., 1])
        iou_v = inter / (area(xyxy[i]) + area(xyxy[rest]) - inter + 1e-6)
        order = rest[(iou_v < iou) | (cls[rest] != cls[i])]
    res = []
    for i in picked[:10]:
        x1, y1, x2, y2 = xyxy[i]
        res.append({
            "label": SMOKE_NAMES[int(cls[i])], "confidence": round(float(sc[i]), 2),
            "box": [float(max(0.0, (x1 - px) / nw)), float(max(0.0, (y1 - py) / nh)), float(min(1.0, (x2 - px) / nw)), float(min(1.0, (y2 - py) / nh))],
        })
    return res
