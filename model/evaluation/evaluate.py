"""
YOLOv11 Road Damage Model Evaluation and Benchmark Metrics Script
Calculates authentic Precision, Recall, mAP@50, and mAP@50-95 metrics.
"""

import argparse
import os
import json
from ultralytics import YOLO

def evaluate_model(
    weights_path: str = "backend/models/best.pt",
    data_yaml: str = "data.yaml",
    imgsz: int = 640,
    device: str = "cpu"
):
    print("=" * 70)
    print("AI Capstone: YOLOv11 Road Damage Model Evaluation")
    print("=" * 70)
    print(f"Weights Path : {weights_path}")
    print(f"Dataset YAML : {data_yaml}")
    print("=" * 70)

    if not os.path.exists(weights_path):
        print(f"[Warning] Weights file '{weights_path}' not found. Cannot perform benchmark evaluation.")
        return

    if not os.path.exists(data_yaml):
        print(f"[Warning] Dataset configuration '{data_yaml}' not found. Cannot evaluate.")
        return

    model = YOLO(weights_path)
    metrics = model.val(
        data=data_yaml,
        imgsz=imgsz,
        device=device,
        split="test",
        verbose=True
    )

    results_summary = {
        "mAP50": round(float(metrics.box.map50), 4),
        "mAP50_95": round(float(metrics.box.map), 4),
        "precision": round(float(metrics.box.mp), 4),
        "recall": round(float(metrics.box.mr), 4),
        "classes": list(metrics.names.values()) if hasattr(metrics, "names") else []
    }

    print("\n" + "=" * 70)
    print("BENCHMARK EVALUATION RESULTS:")
    print(f"mAP @ 0.50       : {results_summary['mAP50'] * 100:.2f}%")
    print(f"mAP @ 0.50:0.95  : {results_summary['mAP50_95'] * 100:.2f}%")
    print(f"Mean Precision   : {results_summary['precision'] * 100:.2f}%")
    print(f"Mean Recall      : {results_summary['recall'] * 100:.2f}%")
    print("=" * 70)

    # Save to metrics.json
    out_file = "model/evaluation/metrics.json"
    os.makedirs(os.path.dirname(out_file), exist_ok=True)
    with open(out_file, "w") as f:
        json.dump(results_summary, f, indent=2)
    print(f"Saved evaluation metrics to {out_file}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate YOLOv11 Road Damage Model")
    parser.add_argument("--weights", type=str, default="backend/models/best.pt")
    parser.add_argument("--data", type=str, default="data.yaml")
    parser.add_argument("--imgsz", type=int, default=640)
    parser.add_argument("--device", type=str, default="cpu")
    args = parser.parse_args()

    evaluate_model(args.weights, args.data, args.imgsz, args.device)
