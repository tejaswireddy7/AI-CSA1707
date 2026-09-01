# System Architecture Documentation

**Project Title**: AI-Driven Road Damage Detection and Severity Assessment Using YOLO-Based Deep Object Detection

---

## 1. High-Level Architecture Overview

The system employs a decoupled, production-grade microservice architecture comprising an interactive Next.js frontend deployed to Vercel and a high-performance Python FastAPI backend hosting the YOLOv11 deep neural network.

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

## 2. Component Breakdown

### A. Frontend Layer (Next.js 14/15, TypeScript, Tailwind CSS)
- **Client Presentation**: Built with React Server & Client Components for instant rendering.
- **Analysis Studio (`/analyze`)**: Drag-and-drop file uploader with client-side image dimension & format validation.
- **Visual Annotation Viewer**: Side-by-side comparative inspection between the raw road capture and the YOLO-annotated overlay.
- **Reporting Engine**: Dynamic client-side synthesis of PDF/JSON/Text inspection certificates.
- **Offline History (`/history`)**: Local persistence using browser `localStorage` to audit past inspections without requiring centralized database credentials.

### B. Backend Engine (FastAPI, Ultralytics, OpenCV, NumPy)
- **Lifespan Startup Handler**: Loads deep learning weights into GPU/CPU memory once on boot, preventing multi-second reloading delays per request.
- **Validation Middleware**: Enforces MIME constraints (`image/jpeg`, `image/png`, `image/webp`) and restricts payloads to maximum 20MB.
- **`RoadDamageDetector` (`detector.py`)**: Executes non-maximum suppression (NMS), confidence filtering, and generates annotated imagery with class-coded bounding boxes.
- **`SeverityEstimator` (`severity.py`)**: Computes bounding box area relative to image pixel area and applies class hazard weights.
- **`RoadConditionAnalyzer` (`road_condition.py`)**: Synthesizes aggregate pavement serviceability, calculates Pavement Condition Index (PCI) proxy, and issues maintenance directives.

---

## 3. Communication Protocol

- **Endpoint**: `POST /predict`
- **Payload**: `multipart/form-data` with binary field `image` and optional query param `confidence` (0.05 - 0.99).
- **Format**: REST JSON payload containing detection coordinates, class tags, confidence scores, extent percentages, severity tiers, and base64-encoded annotated JPEG.
