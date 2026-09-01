import time
import os
from contextlib import asynccontextmanager
from typing import Optional, Dict, Any

from fastapi import FastAPI, File, UploadFile, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config import settings
from detector import detector

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application startup and shutdown event handler.
    Initializes the YOLOv11 model once at startup.
    """
    print(f"[{settings.PROJECT_NAME}] Initializing AI detection pipeline...")
    try:
        detector.load_model()
    except Exception as e:
        print(f"[CRITICAL] Error initializing model during startup: {e}")
    yield
    print(f"[{settings.PROJECT_NAME}] Shutting down API service.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Real-time YOLOv11 AI Road Damage Detection and Mathematical Severity Assessment API",
    version=settings.VERSION,
    lifespan=lifespan
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "model_loaded": detector.is_loaded,
        "model_name": detector.model_name,
        "endpoints": {
            "predict": "/predict (POST)",
            "health": "/health (GET)",
            "model_info": "/model-info (GET)",
            "classes": "/classes (GET)"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy" if detector.is_loaded else "degraded",
        "model_loaded": detector.is_loaded,
        "model_name": detector.model_name,
        "is_custom_model": detector.is_custom_model,
        "weights_path": detector.model_path,
        "device": detector.device,
        "version": settings.VERSION
    }

@app.get("/classes")
async def get_damage_classes():
    return {
        "classes": settings.ROAD_DAMAGE_CLASSES,
        "color_palette": settings.CLASS_COLORS_RGB,
        "total_classes": len(settings.ROAD_DAMAGE_CLASSES)
    }

@app.get("/model-info")
async def get_model_info():
    """
    Returns authentic YOLOv11 model metadata and evaluation benchmarks.
    Academic rule: Only measured metrics are presented; otherwise labeled as awaiting evaluation.
    """
    return {
        "architecture": "YOLOv11 (You Only Look Once v11)",
        "variant": "YOLOv11n (Nano) / YOLOv11s",
        "task": "Object Detection (Localization + Classification)",
        "active_weights": detector.model_path,
        "is_custom_model": detector.is_custom_model,
        "framework": "Ultralytics PyTorch Engine",
        "classes_supported": settings.ROAD_DAMAGE_CLASSES,
        "confidence_threshold": settings.CONFIDENCE_THRESHOLD,
        "iou_threshold": settings.IOU_THRESHOLD,
        "metrics_status": "Custom evaluation metrics available upon full benchmark dataset run" if not detector.is_custom_model else "Model weights active",
        "benchmark_dataset_reference": "RDD2022 / RDD2020 Multi-National Road Damage Dataset",
        "extent_estimation": "Bounding-box area ratio relative to image dimensions",
        "severity_engine": "Calibrated 4-tier structural impact rule set"
    }

@app.post("/predict")
async def predict_road_damage(
    image: UploadFile = File(..., description="Road pavement image file (JPG, PNG, JPEG, WEBP)"),
    confidence: Optional[float] = Query(None, ge=0.05, le=0.99, description="Optional custom confidence threshold")
):
    """
    Primary Road Damage Detection Endpoint.
    Accepts road image, performs genuine YOLOv11 inference, calculates damage extent,
    estimates severity, analyzes overall pavement condition, and returns annotated image.
    """
    start_time = time.time()

    # Verify model is ready
    if not detector.is_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="YOLO detection model is currently initializing or unavailable. Check server logs."
        )

    # Validate Content-Type
    content_type = image.content_type or ""
    if content_type.lower() not in settings.ALLOWED_MIME_TYPES and not any(
        image.filename.lower().endswith(ext) for ext in [".jpg", ".jpeg", ".png", ".webp"]
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{content_type}'. Please upload a valid JPG, JPEG, or PNG image."
        )

    # Read image bytes & validate size
    try:
        image_bytes = await image.read()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to read uploaded image stream: {e}"
        )

    if len(image_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded image file is empty."
        )

    if len(image_bytes) > settings.MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Image size ({round(len(image_bytes)/(1024*1024), 2)}MB) exceeds maximum limit of {settings.MAX_FILE_SIZE_MB}MB."
        )

    # Run real YOLOv11 inference & Severity Analysis
    try:
        result = detector.predict(
            image_bytes=image_bytes,
            conf_threshold=confidence
        )
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(val_err)
        )
    except Exception as inf_err:
        print(f"[Predict Error] {inf_err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during AI object detection inference. Please check image validity."
        )

    elapsed_ms = round((time.time() - start_time) * 1000, 1)
    result["inference_time_ms"] = elapsed_ms
    result["filename"] = image.filename

    return JSONResponse(content=result)
