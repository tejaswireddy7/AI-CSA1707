# YOLOv11 Road Damage Detection Model Pipeline

This directory contains the machine learning training and evaluation workflows for the capstone project: **AI-Driven Road Damage Detection and Severity Assessment Using YOLO-Based Deep Object Detection**.

---

## 1. Supported Road Damage Classes

According to standard Road Damage Detection (RDD) benchmarks, the model identifies 4 primary pavement distress types:

| Class ID | Code | Class Name | Description |
| :--- | :--- | :--- | :--- |
| **0** | `D00` | **Longitudinal Crack** | Linear cracks running parallel to traffic direction along lane joints |
| **1** | `D10` | **Transverse Crack** | Linear cracks running perpendicular to the roadway centerline |
| **2** | `D20` | **Alligator Crack** | Interconnected polygon fatigue cracking indicating sub-base distress |
| **3** | `D40` | **Pothole** | Bowl-shaped localized depression and cavity in asphalt pavement |

---

## 2. Dataset Preparation

Prepare your dataset in standard YOLO format:

```
dataset/
├── data.yaml
├── train/
│   ├── images/
│   └── labels/
├── valid/
│   ├── images/
│   └── labels/
└── test/
    ├── images/
    └── labels/
```

### Sample `data.yaml`

```yaml
path: /path/to/dataset
train: train/images
val: valid/images
test: test/images

nc: 4
names:
  0: Longitudinal Crack
  1: Transverse Crack
  2: Alligator Crack
  3: Pothole
```

---

## 3. Training the Model

Execute transfer learning with YOLOv11:

```bash
python model/training/train.py --data /path/to/data.yaml --epochs 100 --batch 16 --model yolo11n.pt --device 0
```

Trained weights will be saved to: `runs/road_damage/yolo11_road_distress/weights/best.pt`.

---

## 4. Model Evaluation & Benchmarks

Run objective evaluation on the test split:

```bash
python model/evaluation/evaluate.py --weights backend/models/best.pt --data /path/to/data.yaml
```

Metrics extracted:
- **Precision ($P$)**: Ratio of true positive detections over total positive predictions.
- **Recall ($R$)**: Ratio of true positive detections over ground truth distress instances.
- **mAP@50**: Mean Average Precision at IoU threshold of 0.50.
- **mAP@50-95**: Mean Average Precision averaged across IoU thresholds from 0.50 to 0.95.

---

## 5. Integrating Weights into Backend

Copy `best.pt` into `backend/models/`:
```bash
cp runs/road_damage/yolo11_road_distress/weights/best.pt backend/models/best.pt
```
Restart the FastAPI server to immediately activate custom inference.
