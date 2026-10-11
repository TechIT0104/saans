"""Train the Saans haze model: photo of the outdoors -> AQI class + AQI value.

Data: Air Pollution Image Dataset from India and Nepal (12,240 photos, 6 AQI classes,
each photo tagged with the CPCB/station AQI at capture time).

Photos come in bursts (several shots of the same place at the same hour), so we split by
location + day. A random split would put near-identical frames in train and test and
report inflated accuracy.

Usage: python train_haze.py --data <dataset root> --out <output dir>
"""
import argparse
import json
import math
import os
import random
from pathlib import Path

import numpy as np
import pandas as pd
import timm
import torch
import torch.nn as nn
from PIL import Image
from sklearn.metrics import f1_score
from sklearn.model_selection import GroupShuffleSplit
from torch.utils.data import DataLoader, Dataset
from torchvision import transforms as T

COARSE = ["clear", "hazy", "heavy"]  # AQI <=100, 101-200, >200
CLASSES = [
    "a_Good",
    "b_Moderate",
    "c_Unhealthy_for_Sensitive_Groups",
    "d_Unhealthy",
    "e_Very_Unhealthy",
    "f_Severe",
]


def load_table(root: Path) -> pd.DataFrame:
    combined = root / "Air Pollution Image Dataset" / "Air Pollution Image Dataset" / "Combined_Dataset"
    df = pd.read_csv(combined / "IND_and_Nep_AQI_Dataset.csv")
    img_dir = combined / "All_img"
    df["path"] = df["Filename"].map(lambda f: str(img_dir / f))
    df = df[df["path"].map(os.path.exists)].copy()
    df = df[df["AQI_Class"].isin(CLASSES)].copy()
    df["y"] = df["AQI_Class"].map(CLASSES.index)
    df["y3"] = df["y"] // 2
    df["group"] = df["Location"].astype(str) + "|" + df[["Year", "Month", "Day"]].astype(str).agg("-".join, axis=1)
    return df.reset_index(drop=True)


def split(df: pd.DataFrame, seed: int):
    gss = GroupShuffleSplit(n_splits=1, test_size=0.2, random_state=seed)
    train_idx, hold_idx = next(gss.split(df, groups=df["group"]))
    hold = df.iloc[hold_idx]
    gss2 = GroupShuffleSplit(n_splits=1, test_size=0.5, random_state=seed)
    val_idx, test_idx = next(gss2.split(hold, groups=hold["group"]))
    return df.iloc[train_idx], hold.iloc[val_idx], hold.iloc[test_idx]


class AQIImages(Dataset):
    def __init__(self, df, tf, col="y"):
        self.paths = df["path"].tolist()
        self.y = df[col].tolist()
        self.aqi = df["AQI"].astype(float).tolist()
        self.tf = tf

    def __len__(self):
        return len(self.paths)

    def __getitem__(self, i):
        img = Image.open(self.paths[i]).convert("RGB")
        return self.tf(img), self.y[i], math.log1p(self.aqi[i])


class HazeNet(nn.Module):
    """Backbone + two heads: AQI class logits and log(1+AQI) regression."""

    def __init__(self, backbone: str, n_classes: int, pretrained: bool = True):
        super().__init__()
        self.backbone = timm.create_model(backbone, pretrained=pretrained, num_classes=0)
        d = self.backbone.num_features
        self.cls = nn.Linear(d, n_classes)
        self.reg = nn.Linear(d, 1)

    def forward(self, x):
        f = self.backbone(x)
        return self.cls(f), self.reg(f).squeeze(-1)


def evaluate(model, loader, device):
    model.eval()
    ys, ps, aqi_true, aqi_pred = [], [], [], []
    with torch.no_grad(), torch.autocast("cuda", dtype=torch.bfloat16):
        for x, y, la in loader:
            logits, reg = model(x.to(device, non_blocking=True))
            ys += y.tolist()
            ps += logits.float().argmax(1).cpu().tolist()
            aqi_true += torch.expm1(la).tolist()
            aqi_pred += torch.expm1(reg.float().cpu()).tolist()
    ys, ps = np.array(ys), np.array(ps)
    return {
        "acc": float((ys == ps).mean()),
        "within_one_class": float((np.abs(ys - ps) <= 1).mean()),
        "macro_f1": float(f1_score(ys, ps, average="macro")),
        "aqi_mae": float(np.mean(np.abs(np.array(aqi_true) - np.array(aqi_pred)))),
        "n": int(len(ys)),
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--backbone", default="convnext_tiny.fb_in22k_ft_in1k")
    ap.add_argument("--epochs", type=int, default=12)
    ap.add_argument("--bs", type=int, default=64)
    ap.add_argument("--lr", type=float, default=2e-4)
    ap.add_argument("--seed", type=int, default=0)
    ap.add_argument("--coarse", action="store_true", help="3 levels (clear/hazy/heavy) instead of 6 AQI classes")
    args = ap.parse_args()

    random.seed(args.seed); np.random.seed(args.seed); torch.manual_seed(args.seed)
    out = Path(args.out); out.mkdir(parents=True, exist_ok=True)
    device = "cuda"

    df = load_table(Path(args.data))
    tr, va, te = split(df, args.seed)
    print(f"images={len(df)} groups={df['group'].nunique()} train={len(tr)} val={len(va)} test={len(te)}")
    col = "y3" if args.coarse else "y"
    labels = COARSE if args.coarse else CLASSES
    print("train class counts:", tr[col].value_counts().sort_index().tolist())

    norm = T.Normalize((0.485, 0.456, 0.406), (0.229, 0.224, 0.225))
    # No colour jitter: colour and contrast are the haze signal we want the model to read.
    train_tf = T.Compose([T.RandomResizedCrop(224, scale=(0.6, 1.0)), T.RandomHorizontalFlip(), T.ToTensor(), norm])
    eval_tf = T.Compose([T.Resize(224), T.CenterCrop(224), T.ToTensor(), norm])

    dl = lambda d, tf, sh: DataLoader(AQIImages(d, tf, col), batch_size=args.bs, shuffle=sh, num_workers=12, pin_memory=True, drop_last=sh)
    train_dl, val_dl, test_dl = dl(tr, train_tf, True), dl(va, eval_tf, False), dl(te, eval_tf, False)

    model = HazeNet(args.backbone, len(labels)).to(device)
    counts = np.bincount(tr[col], minlength=len(labels))
    weights = torch.tensor(counts.sum() / (len(labels) * counts), dtype=torch.float32, device=device)
    ce = nn.CrossEntropyLoss(weight=weights, label_smoothing=0.1)
    opt = torch.optim.AdamW(model.parameters(), lr=args.lr, weight_decay=0.05)
    steps = args.epochs * len(train_dl)
    sched = torch.optim.lr_scheduler.OneCycleLR(opt, max_lr=args.lr, total_steps=steps, pct_start=0.1)

    best, history = -1.0, []
    for ep in range(args.epochs):
        model.train()
        tot = 0.0
        for x, y, la in train_dl:
            x, y, la = x.to(device, non_blocking=True), y.to(device), la.to(device, dtype=torch.float32)
            with torch.autocast("cuda", dtype=torch.bfloat16):
                logits, reg = model(x)
                loss = ce(logits.float(), y) + 0.5 * nn.functional.smooth_l1_loss(reg.float(), la)
            opt.zero_grad(set_to_none=True)
            loss.backward()
            opt.step(); sched.step()
            tot += loss.item()
        m = evaluate(model, val_dl, device)
        m.update(epoch=ep + 1, train_loss=tot / len(train_dl))
        history.append(m)
        print(json.dumps(m), flush=True)
        if m["macro_f1"] > best:
            best = m["macro_f1"]
            torch.save(model.state_dict(), out / "haze_best.pt")

    model.load_state_dict(torch.load(out / "haze_best.pt"))
    test = evaluate(model, test_dl, device)
    print("TEST", json.dumps(test))

    model = model.float().cpu().eval()
    torch.onnx.export(
        model, torch.randn(1, 3, 224, 224), out / "haze.onnx",
        input_names=["image"], output_names=["logits", "log_aqi"],
        dynamic_axes={"image": {0: "batch"}}, opset_version=17,
    )
    json.dump(
        {"backbone": args.backbone, "classes": labels, "test": test, "history": history,
         "split": "grouped by location+day (no burst leakage)",
         "n_train": len(tr), "n_val": len(va), "n_test": len(te)},
        open(out / "haze_metrics.json", "w"), indent=2,
    )
    print("saved", out)


if __name__ == "__main__":
    main()
