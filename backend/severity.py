from typing import Dict, Any, List, Tuple
from config import settings

class SeverityEstimator:
    """
    Mathematical Severity Assessment Engine for Road Damage Detections.
    
    Academic Note:
    YOLOv11 performs deep object detection (class label, bounding box, confidence).
    Severity is estimated based on the geometric extent (bounding-box area ratio relative to image area)
    and class-specific impact weightings. This is distinct from direct semantic pixel segmentation.
    """
    
    # Class-specific criticality weighting multiplier
    CLASS_WEIGHTS: Dict[str, float] = {
        "Pothole": 1.25,             # Potholes pose severe structural & vehicle safety hazards
        "Alligator Crack": 1.15,     # Alligator cracking indicates deep structural sub-base fatigue
        "Transverse Crack": 1.0,     # Transverse cracks can expand due to thermal cycles
        "Longitudinal Crack": 0.95,  # Longitudinal cracks are early-stage joint/fatigue distress
    }

    @classmethod
    def calculate_box_area(cls, bbox: List[float] | Tuple[float, float, float, float]) -> float:
        """Calculate area in pixels for bbox [x1, y1, x2, y2]."""
        x1, y1, x2, y2 = bbox
        width = max(0.0, float(x2 - x1))
        height = max(0.0, float(y2 - y1))
        return width * height

    @classmethod
    def calculate_area_percentage(cls, bbox: List[float] | Tuple[float, float, float, float], image_width: int, image_height: int) -> float:
        """Calculate bounding box area as a percentage of total image area."""
        total_image_area = float(image_width * image_height)
        if total_image_area <= 0:
            return 0.0
        
        box_area = cls.calculate_box_area(bbox)
        percentage = (box_area / total_image_area) * 100.0
        return round(min(percentage, 100.0), 2)

    @classmethod
    def estimate_detection_severity(
        cls, 
        bbox: List[float] | Tuple[float, float, float, float], 
        image_width: int, 
        image_height: int,
        class_name: str
    ) -> Dict[str, Any]:
        """
        Estimate severity for an individual road damage detection.
        Returns:
            - area_percentage (float)
            - severity (str: "No Damage" | "Low" | "Moderate" | "High")
            - severity_score (float 0.0 - 100.0)
            - description (str)
        """
        area_pct = cls.calculate_area_percentage(bbox, image_width, image_height)
        weight = cls.CLASS_WEIGHTS.get(class_name, 1.0)
        weighted_score = min(area_pct * weight, 100.0)
        
        if area_pct <= 0.0:
            severity = "No Damage"
            desc = "No measurable damage area."
        elif area_pct < settings.SEVERITY_LOW_MAX_PCT:
            severity = "Low"
            desc = f"Localized minor surface distress occupying {area_pct}% of field of view."
        elif area_pct <= settings.SEVERITY_MODERATE_MAX_PCT:
            severity = "Moderate"
            desc = f"Significant structural distress occupying {area_pct}% of road view. Requires monitoring."
        else:
            severity = "High"
            desc = f"Critical road distress covering {area_pct}% of road view. High risk of rapid deterioration."

        return {
            "area_percentage": area_pct,
            "severity": severity,
            "weighted_severity_score": round(weighted_score, 2),
            "description": desc,
            "methodology": "Bounding-box area ratio relative to image area (Estimated Severity)"
        }
