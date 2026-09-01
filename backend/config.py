import os
from typing import Dict, List, Tuple
from dataclasses import dataclass, field

@dataclass
class Settings:
    PROJECT_NAME: str = "AI-Driven Road Damage Detection & Severity Assessment"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Model Configuration
    # Custom trained model path; fall back to yolo11n.pt if best.pt is not available
    MODEL_PATH: str = os.getenv("MODEL_PATH", "models/best.pt")
    FALLBACK_MODEL_PATH: str = "yolo11n.pt"
    CONFIDENCE_THRESHOLD: float = float(os.getenv("CONFIDENCE_THRESHOLD", "0.25"))
    IOU_THRESHOLD: float = float(os.getenv("IOU_THRESHOLD", "0.45"))
    DEVICE: str = os.getenv("DEVICE", "cpu") # 'cpu', 'cuda', 'mps', or '0'
    
    # Server & Security
    ALLOWED_ORIGINS: List[str] = field(default_factory=lambda: [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "https://road-damage-ai.vercel.app",
        "*"
    ])
    MAX_FILE_SIZE_MB: int = int(os.getenv("MAX_FILE_SIZE_MB", "20"))
    MAX_FILE_SIZE_BYTES: int = int(os.getenv("MAX_FILE_SIZE_MB", "20")) * 1024 * 1024
    ALLOWED_MIME_TYPES: List[str] = field(default_factory=lambda: [
        "image/jpeg", "image/png", "image/jpg", "image/webp"
    ])
    
    # Standard Road Damage Classes
    # Class ID mapping according to Road Damage Detection benchmarks (RDD2020 / RDD2022)
    ROAD_DAMAGE_CLASSES: Dict[int, str] = field(default_factory=lambda: {
        0: "Longitudinal Crack",
        1: "Transverse Crack",
        2: "Alligator Crack",
        3: "Pothole"
    })

    # Visual bounding box colors per class in RGB format
    CLASS_COLORS_RGB: Dict[str, Tuple[int, int, int]] = field(default_factory=lambda: {
        "Longitudinal Crack": (59, 130, 246),   # Electric Blue
        "Transverse Crack": (168, 85, 247),     # Vibrant Purple
        "Alligator Crack": (249, 115, 22),      # Amber / Orange
        "Pothole": (239, 68, 68),               # Crimson Red
        "Default": (16, 185, 129)               # Emerald Green
    })
    
    # Severity Thresholds (Based on Bounding Box Area % relative to Image Area)
    SEVERITY_LOW_MAX_PCT: float = 10.0
    SEVERITY_MODERATE_MAX_PCT: float = 30.0
    
    # Road Condition Scoring Thresholds
    CONDITION_GOOD_MAX_PCT: float = 2.0
    CONDITION_MINOR_MAX_PCT: float = 10.0
    CONDITION_MODERATE_MAX_PCT: float = 25.0

settings = Settings()
