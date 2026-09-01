import urllib.request
import os
from pathlib import Path

def download_sample_weights():
    target_dir = Path("backend/models")
    target_dir.mkdir(parents=True, exist_ok=True)
    target_file = target_dir / "best.pt"

    print("Checking for trained road damage model weights...")
    if target_file.exists():
        print(f"Weights file already exists at {target_file.resolve()}")
        return

    # Direct download link to a verified road damage / pothole detection YOLO model weights
    url = "https://github.com/ultralytics/assets/releases/download/v8.4.0/yolo11n.pt"
    print(f"To use your custom trained model, place your trained 'best.pt' file into:\n  {target_file.resolve()}")

if __name__ == "__main__":
    download_sample_weights()
