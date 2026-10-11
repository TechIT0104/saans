"""Saans scene-analysis service: Qwen2.5-VL-7B-Instruct on our own GPU.

The AWS app sends the 360° photos here (through an SSH tunnel to the EC2 instance) and gets back
the pollution sources it can see, as JSON in the same shape the app uses.

Run: CUDA_VISIBLE_DEVICES=1 uvicorn vl_server:app --host 127.0.0.1 --port 9000
"""
import base64
import io
import json
import os
import re
import threading
import time

import torch
from fastapi import FastAPI, HTTPException
from PIL import Image
from pydantic import BaseModel
from transformers import AutoProcessor, Qwen2_5_VLForConditionalGeneration

MODEL = os.environ.get("VL_MODEL", "Qwen/Qwen2.5-VL-7B-Instruct")
model = Qwen2_5_VLForConditionalGeneration.from_pretrained(MODEL, torch_dtype=torch.bfloat16, device_map="cuda:0", attn_implementation="sdpa")
processor = AutoProcessor.from_pretrained(MODEL, min_pixels=128 * 28 * 28, max_pixels=448 * 28 * 28)
lock = threading.Lock()
app = FastAPI()


class Req(BaseModel):
    prompt: str
    images: list[str] = []  # base64 JPEG
    max_new_tokens: int = 900


def _json(text: str):
    text = re.sub(r"^```(?:json)?|```$", "", text.strip(), flags=re.M).strip()
    s, e = text.find("{"), text.rfind("}")
    if s < 0 or e <= s:
        raise ValueError("no JSON in model output: " + text[:200])
    return json.loads(text[s:e + 1])


@app.post("/generate")
def generate(req: Req):
    imgs = [Image.open(io.BytesIO(base64.b64decode(b))).convert("RGB") for b in req.images]
    content = []
    for i, im in enumerate(imgs):
        content += [{"type": "text", "text": f"Photo {i}:"}, {"type": "image"}]
    content.append({"type": "text", "text": req.prompt})
    messages = [{"role": "user", "content": content}]
    text = processor.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    inputs = processor(text=[text], images=imgs or None, return_tensors="pt").to(model.device)
    t0 = time.time()
    with lock, torch.inference_mode():
        out = model.generate(**inputs, max_new_tokens=req.max_new_tokens, do_sample=False)
    raw = processor.batch_decode(out[:, inputs["input_ids"].shape[1]:], skip_special_tokens=True)[0]
    try:
        data = _json(raw)
    except Exception as e:
        raise HTTPException(502, f"{e}")
    grid = inputs.get("image_grid_thw")
    sizes = [[int(g[2]) * 14, int(g[1]) * 14] for g in grid.tolist()] if grid is not None else []
    return {"result": data, "seconds": round(time.time() - t0, 1), "model": MODEL, "image_sizes": sizes}


@app.get("/health")
def health():
    return {"ok": True, "model": MODEL, "gpu": torch.cuda.get_device_name(0)}
