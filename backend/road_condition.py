from typing import List, Dict, Any
from config import settings

class RoadConditionAnalyzer:
    """
    Evaluates aggregate road pavement serviceability and overall road condition.
    Combines total damage extent percentage, maximum individual severity, and damage frequency.
    """

    SEVERITY_ORDER = {
        "No Damage": 0,
        "Low": 1,
        "Moderate": 2,
        "High": 3
    }

    @classmethod
    def calculate_combined_damage_area(
        cls, 
        detections: List[Dict[str, Any]], 
        image_width: int, 
        image_height: int
    ) -> float:
        """
        Calculates total damage percentage across all detections.
        For non-overlapping approximations, sums areas capped at 100%.
        """
        if not detections or image_width <= 0 or image_height <= 0:
            return 0.0
        
        total_image_area = float(image_width * image_height)
        total_box_area = 0.0
        
        for det in detections:
            bbox = det.get("bbox")
            if isinstance(bbox, dict):
                x1, y1, x2, y2 = bbox["x1"], bbox["y1"], bbox["x2"], bbox["y2"]
            elif isinstance(bbox, (list, tuple)) and len(bbox) == 4:
                x1, y1, x2, y2 = bbox
            else:
                continue
            
            w = max(0.0, float(x2 - x1))
            h = max(0.0, float(y2 - y1))
            total_box_area += (w * h)

        area_pct = (total_box_area / total_image_area) * 100.0
        return round(min(area_pct, 100.0), 2)

    @classmethod
    def evaluate_road_condition(
        cls, 
        detections: List[Dict[str, Any]], 
        image_width: int, 
        image_height: int
    ) -> Dict[str, Any]:
        """
        Computes overall condition rating, risk tier, index score (PCI proxy), and maintenance recommendation.
        """
        num_detections = len(detections)
        
        if num_detections == 0:
            return {
                "overall_condition": "No Damage",
                "overall_severity": "No Damage",
                "total_damage_area_percentage": 0.0,
                "pavement_condition_score": 100.0, # 0 (failed) to 100 (perfect)
                "risk_level": "Minimal",
                "recommendation": "Pavement is in optimal condition. Continue routine visual inspections.",
                "summary": "No road distress or structural anomalies were detected by the YOLOv11 model."
            }

        total_area_pct = cls.calculate_combined_damage_area(detections, image_width, image_height)
        
        # Determine highest severity amongst all detections
        highest_severity = "Low"
        highest_rank = 1
        for det in detections:
            sev = det.get("severity", "Low")
            rank = cls.SEVERITY_ORDER.get(sev, 1)
            if rank > highest_rank:
                highest_rank = rank
                highest_severity = sev

        # Calculate Pavement Condition Index (PCI) proxy score (100 is best, 0 is worst)
        deduct_points = min(total_area_pct * 1.5 + (num_detections * 5.0) + (highest_rank * 10.0), 100.0)
        pci_proxy = round(max(0.0, 100.0 - deduct_points), 1)

        # Condition logic based on total area and highest severity
        if highest_severity == "High" or total_area_pct > settings.CONDITION_MODERATE_MAX_PCT or num_detections >= 4:
            overall_condition = "Severe Damage"
            overall_severity = "High"
            risk_level = "Critical"
            recommendation = "Immediate intervention required. Schedule deep mill-and-fill or asphalt resurfacing."
        elif highest_severity == "Moderate" or total_area_pct > settings.CONDITION_MINOR_MAX_PCT or num_detections >= 2:
            overall_condition = "Moderate Damage"
            overall_severity = "Moderate"
            risk_level = "Elevated"
            recommendation = "Localized pothole patching and crack sealing recommended within 30 days."
        elif total_area_pct > settings.CONDITION_GOOD_MAX_PCT or num_detections == 1:
            overall_condition = "Minor Damage"
            overall_severity = "Low"
            risk_level = "Low"
            recommendation = "Preventative maintenance: Apply bitumen crack sealant to prevent moisture infiltration."
        else:
            overall_condition = "Good"
            overall_severity = "Low"
            risk_level = "Minimal"
            recommendation = "Pavement surface remains sound. Schedule standard periodic monitoring."

        summary = f"Detected {num_detections} damage instance(s) covering approximately {total_area_pct}% of the road view with highest severity '{highest_severity}'."

        return {
            "overall_condition": overall_condition,
            "overall_severity": overall_severity,
            "total_damage_area_percentage": total_area_pct,
            "pavement_condition_score": pci_proxy,
            "risk_level": risk_level,
            "recommendation": recommendation,
            "summary": summary
        }
