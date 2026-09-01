"""
YOLOv11 Road Damage Detection Transfer Learning & Training Script
Capstone Module: AI-Driven Road Damage Detection and Severity Assessment

Supports datasets in standard YOLO format:
- RDD2020 / RDD2022 (Road Damage Dataset)
- Roboflow Road Damage Datasets
- Custom labeled datasets (Longitudinal Crack, Transverse Crack, Alligator Crack, Pothole)
"""

import argparse
import os
from pathlib import Path
from ultralytics import YOLO

def train_road_damage_detector(
    data_yaml: str,
    epochs: int = 100,
    imgsz: int = 640,
    batch_size: int = 16,
    base_model: str = "yolo11n.pt",
    device: str = "0", # '0' for GPU or 'cpu'
    project_name: str = "runs/road_damage",
    experiment_name: str = "yolo11_road_distress"
):
    print("=" * 70)
    print("AI Capstone: Fine-Tuning YOLOv11 for Road Damage Detection")
    print("=" * 70)
    print(f"Base Pretrained Model : {base_model}")
    print(f"Dataset Configuration : {data_yaml}")
    print(f"Target Epochs         : {epochs}")
    print(f"Input Image Size      : {imgsz}x{imgsz}")
    print(f"Batch Size            : {batch_size}")
    print(f"Target Device         : {device}")
    print("=" * 70)

    if not os.path.exists(data_yaml):
        raise FileNotFoundError(f"Dataset YAML configuration not found at: {data_yaml}")

    # Load baseline YOLOv11 model
    model = YOLO(base_model)

    # Train model with transfer learning hyper-parameters
    results = model.train(
        data=data_yaml,
        epochs=epochs,
        imgsz=imgsz,
        batch=batch_size,
        device=device,
        project=project_name,
        name=experiment_name,
        save=True,
        save_period=10,
        patience=20, # Early stopping patience
        pretrained=True,
        optimizer="auto",
        lr0=0.01,
        lrf=0.01,
        augment=True,
        flipud=0.0,
        fliplr=0.5,
        mosaic=1.0,
        mixup=0.1
    )

    best_weights = Path(project_name) / experiment_name / "weights" / "best.pt"
    print("\n" + "=" * 70)
    print("TRAINING COMPLETE!")
    print(f"Best model weights saved to: {best_weights.resolve()}")
    print("To use these weights in the backend, copy them to backend/models/best.pt")
    print("=" * 70)
    return results

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fine-tune YOLOv11 on Road Damage Dataset")
    parser.add_argument("--data", type=str, default="data.yaml", help="Path to dataset data.yaml")
    parser.add_argument("--epochs", type=int, default=100, help="Number of training epochs")
    parser.add_argument("--imgsz", type=int, default=640, help="Image resolution")
    parser.add_argument("--batch", type=int, default=16, help="Batch size")
    parser.add_argument("--model", type=str, default="yolo11n.pt", help="Pretrained YOLOv11 model (n/s/m/l/x)")
    parser.add_argument("--device", type=str, default="cpu", help="Device (cpu or 0)")
    args = parser.parse_args()

    train_road_damage_detector(
        data_yaml=args.data,
        epochs=args.epochs,
        imgsz=args.imgsz,
        batch_size=args.batch,
        base_model=args.model,
        device=args.device
    )
