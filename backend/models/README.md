# Model Weights Directory

This directory holds the YOLOv11 deep learning weights for Road Damage Detection.

## Recommended Model Structure

```
backend/models/
├── README.md
└── best.pt          <- Trained YOLOv11 Road Damage weights
```

## How to Deploy Your Trained Weights (`best.pt`)

1. Train your YOLOv11 model using the script provided in `model/training/train.py` on the Road Damage Dataset (e.g. RDD2020 / RDD2022 / Roboflow dataset).
2. After training completes, copy the resulting `runs/detect/train/weights/best.pt` file to this directory:
   ```bash
   cp path/to/runs/detect/train/weights/best.pt backend/models/best.pt
   ```
3. Set the environment variable in `backend/.env`:
   ```env
   MODEL_PATH=models/best.pt
   ```
4. Restart the FastAPI server. The backend will automatically recognize and load the custom trained weights.

## Development Fallback (`yolo11n.pt`)

If `models/best.pt` is not present, the backend will automatically load the baseline `yolo11n.pt` model for development and local testing. The UI and API endpoints will clearly display that the system is operating in development fallback mode.

## Large Files & Git LFS

Because model weight files (`.pt`) are binary and typically between 5MB - 100MB, avoid committing them directly to standard Git history.
If you wish to version models on GitHub, use Git LFS:
```bash
git lfs install
git lfs track "*.pt"
git add .gitattributes
git add backend/models/best.pt
git commit -m "Add trained YOLOv11 road damage model weights"
```
