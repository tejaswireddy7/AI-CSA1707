import io
from PIL import Image, ImageDraw
import numpy as np
from detector import detector
from severity import SeverityEstimator
from road_condition import RoadConditionAnalyzer

def create_sample_road_image() -> bytes:
    """Create a sample synthetic road image with simulated crack/pothole texture."""
    img = Image.new("RGB", (640, 480), color=(60, 64, 72))
    draw = ImageDraw.Draw(img)
    
    # Draw road lane markings
    draw.line([(320, 0), (320, 480)], fill=(240, 240, 240), width=6)
    draw.line([(100, 0), (100, 480)], fill=(255, 200, 0), width=4)
    draw.line([(540, 0), (540, 480)], fill=(255, 200, 0), width=4)
    
    # Draw simulated pothole & cracks
    draw.ellipse([(200, 220), (360, 340)], fill=(25, 25, 28), outline=(15, 15, 18), width=3)
    draw.line([(340, 280), (450, 310), (480, 360)], fill=(20, 20, 22), width=3)
    
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()

def run_tests():
    print("=== Testing YOLOv11 Road Damage Detector Startup ===")
    detector.load_model()
    assert detector.is_loaded is True, "Detector failed to load"
    print(f"Model successfully loaded: {detector.model_name}")
    print(f"Model path: {detector.model_path}")

    print("\n=== Testing Severity Estimator ===")
    sev_test = SeverityEstimator.estimate_detection_severity(
        bbox=[100, 100, 300, 250],
        image_width=640,
        image_height=480,
        class_name="Pothole"
    )
    print("Severity Result:", sev_test)
    assert "severity" in sev_test
    assert "area_percentage" in sev_test

    print("\n=== Testing Road Condition Analyzer ===")
    mock_detections = [
        {
            "class_id": 3,
            "class_name": "Pothole",
            "confidence": 0.92,
            "bbox": [100, 100, 300, 250],
            "severity": "Moderate"
        }
    ]
    cond_test = RoadConditionAnalyzer.evaluate_road_condition(mock_detections, 640, 480)
    print("Condition Result:", cond_test)
    assert "overall_condition" in cond_test

    print("\n=== Testing Real YOLO Inference Pipeline ===")
    sample_bytes = create_sample_road_image()
    pred_result = detector.predict(sample_bytes)
    print(f"Prediction Success: {pred_result['success']}")
    print(f"Detections Count: {pred_result['detections_count']}")
    print(f"Overall Condition: {pred_result['overall_condition']}")
    print(f"Overall Severity: {pred_result['overall_severity']}")
    print(f"Annotated image data URI length: {len(pred_result['annotated_image'])}")
    print("\nALL BACKEND UNIT TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
