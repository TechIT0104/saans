"""Unpack the D-Fire dataset (Hugging Face parquet mirror: badsaarow/d-fire) into YOLO folders.

D-Fire: 21,527 images, YOLO boxes, class 0 = smoke, 1 = fire. Its own train/test split is kept;
the test split is our validation set.

Usage: python prep_dfire.py --src <dir with data/*.parquet> --out <yolo dataset dir>
"""
import argparse
from pathlib import Path

import pyarrow.parquet as pq


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", required=True)
    ap.add_argument("--out", required=True)
    args = ap.parse_args()
    src, out = Path(args.src), Path(args.out)

    for split, name in (("train", "train"), ("test", "val")):
        img_dir, lbl_dir = out / "images" / name, out / "labels" / name
        img_dir.mkdir(parents=True, exist_ok=True)
        lbl_dir.mkdir(parents=True, exist_ok=True)
        n = boxes = 0
        for shard in sorted((src / "data").glob(f"{split}-*.parquet")):
            pf = pq.ParquetFile(shard)
            for batch in pf.iter_batches(batch_size=256):
                for row in batch.to_pylist():
                    stem = Path(row["filename"]).stem
                    (img_dir / f"{stem}.jpg").write_bytes(row["image"]["bytes"])
                    label = (row["label"] or "").strip()
                    (lbl_dir / f"{stem}.txt").write_text(label + ("\n" if label else ""))
                    boxes += len(label.splitlines()) if label else 0
                    n += 1
        print(f"{name}: {n} images, {boxes} boxes")

    (out / "dfire.yaml").write_text(
        f"path: {out.resolve()}\ntrain: images/train\nval: images/val\nnames:\n  0: smoke\n  1: fire\n"
    )


if __name__ == "__main__":
    main()
