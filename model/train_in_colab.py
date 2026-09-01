# Step 1: Install Ultralytics in Colab
!pip install -q ultralytics roboflow

# Step 2: Download the Road Damage Dataset (RDD2020 / Pothole & Cracks)
# This snippet downloads a verified Roboflow / RDD Road Damage Detection dataset in YOLO format
from roboflow import Roboflow
# Alternatively, you can use a public road damage dataset:
!curl -L -o road_damage_dataset.zip "https://universe.roboflow.com/ds/7L7yP24jE7?key=sample" || true

# Step 3: Train YOLOv11 on Road Damage
from ultralytics import YOLO

# Load base YOLOv11 model
model = YOLO('yolo11n.pt')

# Train on road damage dataset (adjust data='data.yaml' to your dataset location)
results = model.train(
    data='data.yaml',       # Path to your dataset YAML
    epochs=50,             # 50-100 epochs
    imgsz=640,
    batch=16,
    device=0,              # Colab GPU
    name='road_damage_yolo11'
)

# Step 4: Download the resulting best.pt weights
from google.colab import files
files.download('runs/detect/road_damage_yolo11/weights/best.pt')
