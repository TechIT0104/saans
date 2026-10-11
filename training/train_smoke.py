"""Fine-tune YOLO11s on D-Fire to box visible smoke and fire (garbage burning, chimneys, kilns).

Usage: python train_smoke.py --data <dfire.yaml> --out <runs dir> --device 1,2,3 --hours 0.8
"""
import argparse
import json
import shutil
from pathlib import Path

from ultralytics import YOLO


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--device", default="0")
    ap.add_argument("--hours", type=float, default=0.8)
    ap.add_argument("--model", default="yolo11s.pt")
    args = ap.parse_args()

    model = YOLO(args.model)
    model.train(
        data=args.data, epochs=40, time=args.hours, imgsz=640, batch=48,
        device=args.device, workers=12, project=args.out, name="smoke", exist_ok=True,
        cos_lr=True, close_mosaic=3, patience=50, plots=True,
    )

    run = Path(args.out) / "smoke"
    best = YOLO(run / "weights" / "best.pt")
    m = best.val(data=args.data, imgsz=640, device=args.device.split(",")[0], plots=False)
    metrics = {
        "map50": float(m.box.map50), "map50_95": float(m.box.map),
        "per_class_map50": {n: float(v) for n, v in zip(["smoke", "fire"], m.box.ap50)},
    }
    print("VAL", json.dumps(metrics))
    json.dump(metrics, open(run / "smoke_metrics.json", "w"), indent=2)
    onnx = best.export(format="onnx", imgsz=640, opset=17, simplify=False)
    shutil.copy(onnx, run / "smoke.onnx")


if __name__ == "__main__":
    main()
