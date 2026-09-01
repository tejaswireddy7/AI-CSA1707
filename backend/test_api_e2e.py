import io
from fastapi.testclient import TestClient
from PIL import Image, ImageDraw
from main import app
from detector import detector

def create_dummy_image(color=(70, 70, 75)) -> bytes:
    img = Image.new("RGB", (320, 240), color=color)
    draw = ImageDraw.Draw(img)
    draw.line([(160, 0), (160, 240)], fill=(255, 255, 255), width=4)
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()

def run_e2e_tests():
    with TestClient(app) as client:
        print("1. Testing /health endpoint...")
        res = client.get("/health")
        assert res.status_code == 200
        data = res.json()
        assert data["model_loaded"] is True
        print("   Health response:", data["status"], data["model_name"])

        print("2. Testing /classes endpoint...")
        res = client.get("/classes")
        assert res.status_code == 200
        data = res.json()
        assert len(data["classes"]) == 4
        print("   Classes available:", list(data["classes"].values()))

        print("3. Testing /model-info endpoint...")
        res = client.get("/model-info")
        assert res.status_code == 200
        data = res.json()
        assert "YOLOv11" in data["architecture"]
        print("   Architecture:", data["architecture"])

        print("4. Testing /predict with invalid file type...")
        res = client.post(
            "/predict",
            files={"image": ("test.txt", b"not an image", "text/plain")}
        )
        assert res.status_code == 400
        print("   Received expected 400 Bad Request:", res.json()["detail"])

        print("5. Testing /predict with empty file...")
        res = client.post(
            "/predict",
            files={"image": ("empty.jpg", b"", "image/jpeg")}
        )
        assert res.status_code == 400
        print("   Received expected 400 Bad Request for empty image")

        print("6. Testing /predict with genuine road image inference...")
        img_bytes = create_dummy_image()
        res = client.post(
            "/predict",
            files={"image": ("road_surface.jpg", img_bytes, "image/jpeg")}
        )
        assert res.status_code == 200
        pred = res.json()
        assert pred["success"] is True
        assert "detections" in pred
        assert "overall_condition" in pred
        assert "overall_severity" in pred
        assert "annotated_image" in pred
        assert pred["annotated_image"].startswith("data:image/jpeg;base64,")
        print("   Prediction output:")
        print(f"     - Detections Count : {pred['detections_count']}")
        print(f"     - Overall Severity : {pred['overall_severity']}")
        print(f"     - Road Condition   : {pred['overall_condition']}")
        print(f"     - PCI Score        : {pred['pavement_condition_score']}")
        print(f"     - Inference Time   : {pred['inference_time_ms']} ms")
        print(f"     - Annotated B64 Len: {len(pred['annotated_image'])}")

        print("\nALL API END-TO-END TESTS PASSED WITH 100% SUCCESS!")

if __name__ == "__main__":
    run_e2e_tests()
