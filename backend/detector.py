import io
import base64
import os
from pathlib import Path
from typing import Dict, List, Any, Tuple, Optional
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import cv2
from ultralytics import YOLO

from config import settings
from severity import SeverityEstimator
from road_condition import RoadConditionAnalyzer

class RoadDamageDetector:
    """
    Core YOLOv11 Road Damage Object Detection Engine.
    Loads model once at server startup and performs structured inference.
    """

    def __init__(self):
        self.model: Optional[YOLO] = None
        self.model_path: str = ""
        self.is_custom_model: bool = False
        self.model_name: str = ""
        self.classes: Dict[int, str] = {}
        self.device: str = settings.DEVICE
        self.is_loaded: bool = False

    def load_model(self) -> None:
        """
        Loads the YOLOv11 model into memory.
        Attempts custom trained weights first (best.pt), then falls back to yolo11n.pt for dev.
        """
        custom_path = Path(settings.MODEL_PATH)
        fallback_path = Path(settings.FALLBACK_MODEL_PATH)
        
        target_path = None
        if custom_path.exists() and custom_path.is_file():
            target_path = str(custom_path)
            self.is_custom_model = True
            self.model_name = f"Custom YOLOv11 ({custom_path.name})"
        else:
            # Fallback to standard YOLOv11 development model
            target_path = str(fallback_path)
            self.is_custom_model = False
            self.model_name = "YOLOv11 Nano (Development Fallback - Generic Pretrained)"
            print(f"[RoadDamageDetector] Custom model '{custom_path}' not found. Initializing fallback '{fallback_path}'.")

        try:
            self.model = YOLO(target_path)
            self.model_path = target_path
            
            # Setup class names
            if self.is_custom_model and hasattr(self.model, "names") and self.model.names:
                self.classes = {int(k): str(v) for k, v in self.model.names.items()}
            else:
                # Use standard road damage benchmark dictionary
                self.classes = settings.ROAD_DAMAGE_CLASSES.copy()
            
            self.is_loaded = True
            print(f"[RoadDamageDetector] Successfully loaded {self.model_name} on {self.device}.")
        except Exception as e:
            self.is_loaded = False
            print(f"[RoadDamageDetector] Error loading model: {e}")
            raise RuntimeError(f"Failed to load YOLO model from '{target_path}': {e}")

    def get_class_name(self, class_id: int) -> str:
        """Resolve class name for a given class ID."""
        if class_id in self.classes:
            return self.classes[class_id]
        if self.model and hasattr(self.model, "names") and class_id in self.model.names:
            return str(self.model.names[class_id])
        return f"Distress_Class_{class_id}"

    def predict(
        self, 
        image_bytes: bytes, 
        conf_threshold: Optional[float] = None,
        iou_threshold: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Performs genuine YOLO inference on an uploaded image.
        Returns complete structured response with detections, severity, and condition.
        """
        if not self.is_loaded or self.model is None:
            raise RuntimeError("YOLO model is not loaded. Call load_model() first.")

        conf = conf_threshold if conf_threshold is not None else settings.CONFIDENCE_THRESHOLD
        iou = iou_threshold if iou_threshold is not None else settings.IOU_THRESHOLD

        # Preprocess / Decode image using PIL & NumPy
        try:
            pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        except Exception as e:
            raise ValueError(f"Invalid or corrupt image format: {e}")

        img_width, img_height = pil_image.size
        img_np = np.array(pil_image)

        # Run real YOLOv11 inference
        results = self.model.predict(
            source=img_np,
            conf=conf,
            iou=iou,
            device=self.device,
            verbose=False
        )

        detections = self.get_detections(results, img_width, img_height)
        
        # Draw high quality visual annotations
        annotated_b64 = self.draw_detections(pil_image, detections)
        
        # Calculate aggregate road condition
        condition_info = RoadConditionAnalyzer.evaluate_road_condition(detections, img_width, img_height)

        return {
            "success": True,
            "model_info": {
                "name": self.model_name,
                "is_custom_model": self.is_custom_model,
                "weights_path": self.model_path,
                "confidence_threshold": conf,
                "iou_threshold": iou,
                "inference_device": self.device
            },
            "image_metadata": {
                "width": img_width,
                "height": img_height,
                "total_pixels": img_width * img_height
            },
            "detections_count": len(detections),
            "detections": detections,
            "total_damage_area_percentage": condition_info["total_damage_area_percentage"],
            "overall_severity": condition_info["overall_severity"],
            "overall_condition": condition_info["overall_condition"],
            "pavement_condition_score": condition_info["pavement_condition_score"],
            "risk_level": condition_info["risk_level"],
            "recommendation": condition_info["recommendation"],
            "summary": condition_info["summary"],
            "annotated_image": f"data:image/jpeg;base64,{annotated_b64}"
        }

    def get_detections(self, results, img_width: int, img_height: int) -> List[Dict[str, Any]]:
        """
        Extracts structured detection objects from Ultralytics Results.
        """
        detections: List[Dict[str, Any]] = []
        
        if not results or len(results) == 0:
            return detections

        r = results[0]
        if r.boxes is None or len(r.boxes) == 0:
            return detections

        for box in r.boxes:
            cls_id = int(box.cls[0].item())
            confidence = round(float(box.conf[0].item()), 4)
            
            # Extract coordinates [x1, y1, x2, y2]
            xyxy = box.xyxy[0].tolist()
            x1 = max(0, int(round(xyxy[0])))
            y1 = max(0, int(round(xyxy[1])))
            x2 = min(img_width, int(round(xyxy[2])))
            y2 = min(img_height, int(round(xyxy[3])))

            # Map class ID using authentic model names dictionary
            if hasattr(self.model, "names") and cls_id in self.model.names:
                raw_name = str(self.model.names[cls_id])
                if self.is_custom_model:
                    class_name = raw_name
                else:
                    # In development fallback model (COCO), retain true class name
                    class_name = f"{raw_name} (Dev-COCO)"
            else:
                class_name = self.get_class_name(cls_id)

            # Calculate extent & severity
            bbox_coords = [x1, y1, x2, y2]
            severity_info = SeverityEstimator.estimate_detection_severity(
                bbox=bbox_coords,
                image_width=img_width,
                image_height=img_height,
                class_name=class_name
            )

            detection_obj = {
                "class_id": cls_id,
                "class_name": class_name,
                "confidence": confidence,
                "confidence_percentage": round(confidence * 100.0, 1),
                "bbox": {
                    "x1": x1,
                    "y1": y1,
                    "x2": x2,
                    "y2": y2
                },
                "bbox_raw": bbox_coords,
                "box_width": x2 - x1,
                "box_height": y2 - y1,
                "area_percentage": severity_info["area_percentage"],
                "severity": severity_info["severity"],
                "severity_score": severity_info["weighted_severity_score"],
                "severity_description": severity_info["description"]
            }
            detections.append(detection_obj)

        return detections

    def draw_detections(self, pil_image: Image.Image, detections: List[Dict[str, Any]]) -> str:
        """
        Draws high-contrast, polished bounding boxes and technical label cards onto the image.
        Returns base64 encoded JPEG string.
        """
        annotated = pil_image.copy()
        draw = ImageDraw.Draw(annotated, "RGBA")
        
        # Select appropriate font or fallback
        try:
            font = ImageFont.truetype("arial.ttf", size=max(14, int(min(pil_image.size) / 38)))
        except Exception:
            font = ImageFont.load_default()

        for det in detections:
            bbox = det["bbox"]
            x1, y1, x2, y2 = bbox["x1"], bbox["y1"], bbox["x2"], bbox["y2"]
            class_name = det["class_name"]
            conf_pct = det["confidence_percentage"]
            severity = det["severity"]
            
            # Color scheme
            color_rgb = settings.CLASS_COLORS_RGB.get(class_name, settings.CLASS_COLORS_RGB["Default"])
            r, g, b = color_rgb

            # Draw semi-transparent bounding box fill
            fill_color = (r, g, b, 45)
            draw.rectangle([x1, y1, x2, y2], fill=fill_color)

            # Draw crisp bounding box border
            line_width = max(3, int(min(pil_image.size) / 250))
            draw.rectangle([x1, y1, x2, y2], outline=(r, g, b, 255), width=line_width)

            # Corner accents for futuristic/technical aesthetic
            corner_len = max(12, int((x2 - x1) * 0.15))
            corner_w = line_width + 2
            # Top-left
            draw.line([(x1, y1), (x1 + corner_len, y1)], fill=(255, 255, 255, 255), width=corner_w)
            draw.line([(x1, y1), (x1, y1 + corner_len)], fill=(255, 255, 255, 255), width=corner_w)
            # Bottom-right
            draw.line([(x2, y2), (x2 - corner_len, y2)], fill=(255, 255, 255, 255), width=corner_w)
            draw.line([(x2, y2), (x2, y2 - corner_len)], fill=(255, 255, 255, 255), width=corner_w)

            # Label text
            label_text = f"{class_name.upper()} | {conf_pct}% | {severity}"
            
            # Compute text bounding box
            try:
                text_bbox = draw.textbbox((x1, y1), label_text, font=font)
                t_w = text_bbox[2] - text_bbox[0]
                t_h = text_bbox[3] - text_bbox[1]
            except Exception:
                t_w, t_h = len(label_text) * 8, 16

            pad = 6
            label_y1 = max(0, y1 - t_h - (pad * 2))
            label_y2 = label_y1 + t_h + (pad * 2)
            label_x2 = min(pil_image.width, x1 + t_w + (pad * 2))

            # Draw solid dark label background badge
            draw.rectangle([x1, label_y1, label_x2, label_y2], fill=(15, 23, 42, 230), outline=(r, g, b, 255), width=1)
            # Text inside badge
            draw.text((x1 + pad, label_y1 + pad), label_text, fill=(255, 255, 255, 255), font=font)

        # Convert back to Base64 JPEG
        buffered = io.BytesIO()
        annotated.convert("RGB").save(buffered, format="JPEG", quality=92)
        return base64.b64encode(buffered.getvalue()).decode("utf-8")

# Global singleton detector instance
detector = RoadDamageDetector()
