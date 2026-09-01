# AI-Driven Road Damage Detection and Severity Assessment Using YOLO-Based Deep Object Detection

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![YOLOv11](https://img.shields.io/badge/AI%20Model-Ultralytics%20YOLOv11-00FFFF?style=for-the-badge&logo=yolo&logoColor=black)](https://github.com/ultralytics/ultralytics)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Language-Python%203.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

An end-to-end, production-grade Artificial Intelligence capstone web application designed for automated road pavement distress localization, multi-class classification, geometric extent estimation, and calibrated severity assessment using **YOLOv11** computer vision.

---

## 1. Project Overview

Road transportation networks form the critical backbone of global trade, daily commuting, and economic resilience. Pavement deterioration—manifesting as longitudinal cracks, transverse fractures, structural alligator fatigue, and hazardous potholes—leads to vehicular damage, increased travel time, traffic accidents, and exponential reconstruction costs if left unaddressed.

This project delivers a **full-stack, real-time AI solution** that automates the pavement inspection lifecycle:
1. **Intelligent Deep Object Detection**: Uses state-of-the-art **YOLOv11** architecture to locate and classify surface anomalies.
2. **Mathematical Severity Estimation**: Calculates bounding-box geometric ratios relative to overall pavement field of view.
3. **Pavement Condition Index (PCI Proxy)**: Aggregates spatial distress patterns to determine actionable road maintenance tiers.
4. **Interactive Web Portal**: Delivers real-time image previews, side-by-side detection overlays, analysis reports, and inspection history.

---

## 2. Problem Statement

Traditional road inspection relies heavily on manual human surveys and specialized, expensive sensor vans (laser profilers / LiDAR). Manual surveys are:
- **Hazardous & Slow**: Surveyors operate in active traffic environments.
- **Subjective**: Distress severity assessments vary significantly across human inspectors.
- **Cost-Prohibitive**: Small municipalities lack capital for continuous laser profilometry surveys.
- **Infrequent**: Delays in identifying localized distress lead to structural sub-base failure.

---

## 3. Objectives

- **Automated Distress Identification**: Detect and localize 4 critical pavement anomalies (**Longitudinal Cracks**, **Transverse Cracks**, **Alligator Cracks**, **Potholes**) in real-time.
- **Accurate Spatial Localization**: Generate bounding coordinates and high-confidence predictions via YOLOv11.
- **Calibrated Severity Rating**: Formulate a transparent mathematical engine to estimate distress severity without false claims of direct neural severity classification.
- **Production-Grade Microservice Architecture**: Decouple the Next.js presentation frontend from the Python inference engine, enabling independent scaling and seamless Vercel deployment.
- **Auditability & Reporting**: Provide downloadable annotated images, structured JSON responses, and formal inspection reports.

---

## 4. Existing System vs. Proposed System

| Dimension | Existing Manual / Sensor Systems | Proposed YOLOv11 AI System |
| :--- | :--- | :--- |
| **Inspection Speed** | Days to weeks per road corridor | Sub-second real-time inference (30-100ms) |
| **Operational Cost** | High (specialized crews / LiDAR equipment) | Minimal (smartphone / dashcam / drone images) |
| **Human Risk** | High (crews walking active roadways) | Zero (remote computer vision processing) |
| **Repeatability** | Subjective human scoring variance | Deterministic algorithmic scoring |
| **Reporting** | Manual data entry and delayed synthesis | Instant downloadable inspection certificates |

---

## 5. System Architecture

```
                                  GITHUB REPOSITORY
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
          FRONTEND CLIENT                                  INFERENCE SERVER
        (Next.js App Router)                             (FastAPI + Python 3.11)
                  │                                               │
           Deploy: Vercel                                  Deploy: Python Cloud
                  │                                               │
        ┌─────────┴─────────┐                           ┌─────────┴─────────┐
        │  UI Components    │                           │  Uvicorn Engine   │
        │  Tailwind System  │                           │  FastAPI Router   │
        │  Analysis Studio  │                           │  Input Validator  │
        │  Report Generator │                           │  Lifespan Manager │
        │  LocalStorage DB  │                           └─────────┬─────────┘
        └─────────┬─────────┘                                     │
                  │                                     ┌─────────┴─────────┐
                  │                                     │  RoadDamageDetector
                  │                                     │     (YOLOv11)     │
                  │                                     └─────────┬─────────┘
                  │                                               │
                  │   POST /predict (multipart/form-data)         ▼
                  ├────────────────────────────────────►  Model Inference
                  │                                       (best.pt / yolo11n)
                  │                                               │
                  │                                               ▼
                  │                                       Bounding Box Extract
                  │                                               │
                  │                                               ▼
                  │                                       SeverityEstimator
                  │                                               │
                  │                                               ▼
                  │                                       RoadConditionAnalyzer
                  │                                               │
                  │                                               ▼
                  │   Structured JSON + Annotated Base64 Image    │
                  ◄───────────────────────────────────────────────┘
```

---

## 6. Academic Modules

### MODULE 1: Dataset Preparation and Preprocessing
Standardization of pavement imagery from the Road Damage Dataset (RDD2020 / RDD2022). Normalization to 640x640 resolution with Mosaic and MixUp augmentations.

### MODULE 2: YOLOv11 Road Damage Detection
Deep neural network architecture utilizing C3k2 feature extraction, C2PSA spatial self-attention, and anchor-free decoupled regression heads for high-speed multi-scale feature learning.

### MODULE 3: Damage Localization and Classification
Extraction of bounding coordinates $[x_1, y_1, x_2, y_2]$, confidence scores, and standardized damage class mappings.

### MODULE 4: Severity Assessment
Mathematical geometric ratio computation:
$$\text{Extent} = \frac{\text{Box Width} \times \text{Box Height}}{\text{Image Area}} \times 100$$
Tiers: **No Damage** (0%), **Low** (<10%), **Moderate** (10%-30%), **High** (>30%).

### MODULE 5: Road Condition Analysis
Multi-factor aggregate condition scoring calculating Pavement Condition Index (PCI proxy) and prescribing specific engineering interventions (e.g. crack sealing, asphalt patching, complete resurfacing).

### MODULE 6: Web-Based Visualization and Reporting
Responsive Next.js application delivering side-by-side inspection views, interactive history, telemetry indicators, and downloadable PDF/text inspection reports.

---

## 7. Supported Road Distress Classes

| Class ID | Code | Class Name | Structural Significance |
| :--- | :--- | :--- | :--- |
| **0** | `D00` | **Longitudinal Crack** | Surface tensile fatigue parallel to centerline; early warning |
| **1** | `D10` | **Transverse Crack** | Temperature contraction distress perpendicular to lane |
| **2** | `D20` | **Alligator Crack** | Interconnected polygon cracking signifying base/subgrade failure |
| **3** | `D40` | **Pothole** | Deep localized depression causing severe vehicle damage & hazards |

---

## 8. Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+ (Python 3.11 recommended)

### Backend Setup
```bash
# 1. Navigate to backend directory
cd backend

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. (Optional) Configure environment variables
cp .env.example .env

# 4. Start the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
API Documentation will be live at: `http://localhost:8000/docs`

### Frontend Setup
```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install Node dependencies
npm install

# 3. Configure environment
cp .env.example .env.local

# 4. Start the development server
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 9. Model Training & Custom Weights

To fine-tune YOLOv11 on your custom road damage dataset:
```bash
python model/training/train.py --data /path/to/data.yaml --epochs 100 --batch 16 --model yolo11n.pt --device 0
```
Copy resulting weights to `backend/models/best.pt`. The backend automatically loads custom weights upon restart.

---

## 10. Evaluation & Performance Metrics

Run benchmark evaluation:
```bash
python model/evaluation/evaluate.py --weights backend/models/best.pt --data /path/to/data.yaml
```
Metrics generated include:
- **Precision ($P$)**: Accuracy of positive distress predictions.
- **Recall ($R$)**: Ratio of actual distress instances correctly localized.
- **mAP@50**: Mean Average Precision at IoU = 0.50.
- **mAP@50-95**: Mean Average Precision over IoU range [0.50 : 0.95].

---

## 11. Limitations & Future Scope

### Limitations
- Performance depends on image clarity, lighting conditions, and camera angle.
- Severity is an extent-based 2D projection approximation rather than volumetric 3D depth measurement.

### Future Scope
- **YOLO Segmentation (YOLOv11-seg)**: Exact pixel-level polygon boundary segmentation.
- **Multi-Modal LiDAR / Depth Integration**: 3D pothole depth and volume profiling.
- **GPS-Tagged GIS Mapping**: Automated fleet route heatmaps with automated maintenance prioritization.
- **Real-Time Video Stream Pipeline**: Live dashcam video stream processing.

---

## 12. License

This project is licensed under the [MIT License](LICENSE).
