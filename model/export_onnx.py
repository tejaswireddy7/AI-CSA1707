"""
Run this script ONCE locally to export your trained best.pt to ONNX format.
The resulting best.onnx file should be committed to backend/models/.

Usage:
    python model/export_onnx.py
"""
from ultralytics import YOLO
from pathlib import Path

MODEL_PT   = Path("backend/models/best.pt")
MODEL_ONNX = Path("backend/models/best.onnx")

if not MODEL_PT.exists():
    raise FileNotFoundError(f"Model not found at {MODEL_PT}. Run from the project root.")

print(f"Loading {MODEL_PT} ...")
model = YOLO(str(MODEL_PT))

print("Exporting to ONNX (opset 12, dynamic axes) ...")
model.export(
    format="onnx",
    opset=12,
    dynamic=False,      # fixed input size — simpler & faster on CPU
    simplify=True,      # graph simplification reduces model size
    imgsz=640,
)

# Ultralytics exports next to the .pt file by default
exported = MODEL_PT.with_suffix(".onnx")
if exported.exists():
    print(f"\n✅ Exported: {exported}  ({exported.stat().st_size / 1024:.1f} KB)")
    print("Commit backend/models/best.onnx to Git and redeploy.")
else:
    print("Export may have saved elsewhere. Check the current directory.")
