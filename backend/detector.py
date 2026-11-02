import io
import base64
import os
from pathlib import Path
from typing import Dict, List, Any, Tuple, Optional

import numpy as np
from PIL import Image, ImageDraw, ImageFont
import onnxruntime as ort

from config import settings
from severity import SeverityEstimator
from road_condition import RoadConditionAnalyzer


# ── ONNX inference helpers ────────────────────────────────────────────────────

def _preprocess(pil_image: Image.Image, input_size: int = 640) -> Tuple[np.ndarray, float, float, int, int]:
    """Resize image to square, normalise to [0,1], add batch dim (NCHW)."""
    orig_w, orig_h = pil_image.size
    resized = pil_image.resize((input_size, input_size), Image.BILINEAR)
    arr = np.array(resized, dtype=np.float32) / 255.0          # HWC, [0,1]
    arr = arr.transpose(2, 0, 1)[np.newaxis, ...]               # NCHW
    scale_x = orig_w / input_size
    scale_y = orig_h / input_size
    return arr, scale_x, scale_y, orig_w, orig_h


def _nms(boxes: np.ndarray, scores: np.ndarray, iou_thresh: float) -> List[int]:
    """Classic IoU-based non-maximum suppression. Returns kept indices."""
    if len(boxes) == 0:
        return []
    x1, y1, x2, y2 = boxes[:, 0], boxes[:, 1], boxes[:, 2], boxes[:, 3]
    areas = (x2 - x1) * (y2 - y1)
    order = scores.argsort()[::-1]
    keep: List[int] = []
    while len(order):
        i = order[0]
        keep.append(int(i))
        if len(order) == 1:
            break
        xx1 = np.maximum(x1[i], x1[order[1:]])
        yy1 = np.maximum(y1[i], y1[order[1:]])
        xx2 = np.minimum(x2[i], x2[order[1:]])
        yy2 = np.minimum(y2[i], y2[order[1:]])
        inter = np.maximum(0.0, xx2 - xx1) * np.maximum(0.0, yy2 - yy1)
        iou = inter / (areas[i] + areas[order[1:]] - inter + 1e-9)
        order = order[1:][iou <= iou_thresh]
    return keep


def _postprocess(
    raw_output: np.ndarray,
    scale_x: float,
    scale_y: float,
    orig_w: int,
    orig_h: int,
    conf_thresh: float,
    iou_thresh: float,
) -> List[Dict[str, Any]]:
    """
    Decode YOLOv8/v11 ONNX output tensor.
    Shape: [1, num_classes+4, 8400]  (cx, cy, w, h, cls0…clsN)
    """
    preds = raw_output[0]           # [num_classes+4, 8400]
    preds = preds.T                 # [8400, num_classes+4]

    num_classes = preds.shape[1] - 4
    boxes_cxcywh = preds[:, :4]
    class_scores  = preds[:, 4:]

    # Best class per anchor
    cls_ids   = class_scores.argmax(axis=1)
    cls_confs = class_scores.max(axis=1)

    # Confidence filter
    mask = cls_confs >= conf_thresh
    if not mask.any():
        return []

    boxes_cxcywh = boxes_cxcywh[mask]
    cls_ids       = cls_ids[mask]
    cls_confs     = cls_confs[mask]

    # cx,cy,w,h → x1,y1,x2,y2  (in 640-space)
    cx, cy, w, h = boxes_cxcywh[:, 0], boxes_cxcywh[:, 1], boxes_cxcywh[:, 2], boxes_cxcywh[:, 3]
    x1 = (cx - w / 2) * scale_x
    y1 = (cy - h / 2) * scale_y
    x2 = (cx + w / 2) * scale_x
    y2 = (cy + h / 2) * scale_y

    # Clip to image
    x1 = np.clip(x1, 0, orig_w)
    y1 = np.clip(y1, 0, orig_h)
    x2 = np.clip(x2, 0, orig_w)
    y2 = np.clip(y2, 0, orig_h)

    boxes_xyxy = np.stack([x1, y1, x2, y2], axis=1)

    # NMS
    keep = _nms(boxes_xyxy, cls_confs, iou_thresh)

    results = []
    for idx in keep:
        results.append({
            "x1": int(round(float(x1[idx]))),
            "y1": int(round(float(y1[idx]))),
            "x2": int(round(float(x2[idx]))),
            "y2": int(round(float(y2[idx]))),
            "class_id": int(cls_ids[idx]),
            "confidence": float(round(float(cls_confs[idx]), 4)),
        })
    return results


# ── Detector class (drop-in replacement for the original PyTorch version) ─────

class RoadDamageDetector:
    """
    YOLOv11 Road Damage Object Detection Engine — ONNX Runtime backend.
    Loads the exported best.onnx once at server startup; no PyTorch required.
    """

    def __init__(self):
        self.session: Optional[ort.InferenceSession] = None
        self.model_path: str = ""
        self.is_custom_model: bool = False
        self.model_name: str = ""
        self.classes: Dict[int, str] = {}
        self.device: str = settings.DEVICE
        self.is_loaded: bool = False
        self._input_name: str = ""
        self._input_size: int = 640

    def load_model(self) -> None:
        """
        Loads the ONNX model into an OnnxRuntime InferenceSession.
        Tries best.onnx first, then falls back to yolo11n.onnx.
        """
        # Resolve model path: prefer .onnx, fall back gracefully
        custom_onnx   = Path(settings.MODEL_PATH).with_suffix(".onnx")
        fallback_onnx = Path(settings.FALLBACK_MODEL_PATH).with_suffix(".onnx")

        if custom_onnx.exists():
            target_path = str(custom_onnx)
            self.is_custom_model = True
            self.model_name = f"Custom YOLOv11 ({custom_onnx.name})"
        elif fallback_onnx.exists():
            target_path = str(fallback_onnx)
            self.is_custom_model = False
            self.model_name = "YOLOv11 Nano (Dev Fallback – Generic COCO)"
            print(f"[RoadDamageDetector] Custom ONNX not found. Using fallback '{fallback_onnx}'.")
        else:
            raise RuntimeError(
                "No ONNX model found. Export your .pt model first:\n"
                "  python model/export_onnx.py"
            )

        providers = ["CPUExecutionProvider"]
        try:
            self.session = ort.InferenceSession(target_path, providers=providers)
            self.model_path = target_path
            self._input_name = self.session.get_inputs()[0].name
            self.classes = settings.ROAD_DAMAGE_CLASSES.copy()
            self.is_loaded = True
            print(f"[RoadDamageDetector] Loaded '{self.model_name}' via ONNX Runtime (CPU).")
        except Exception as e:
            self.is_loaded = False
            raise RuntimeError(f"Failed to load ONNX model from '{target_path}': {e}")

    def get_class_name(self, class_id: int) -> str:
        return self.classes.get(class_id, f"Distress_Class_{class_id}")

    def predict(
        self,
        image_bytes: bytes,
        conf_threshold: Optional[float] = None,
        iou_threshold: Optional[float] = None,
    ) -> Dict[str, Any]:
        """
        Runs ONNX inference on an uploaded image.
        Returns the same structured response as the original PyTorch version.
        """
        if not self.is_loaded or self.session is None:
            raise RuntimeError("ONNX model is not loaded. Call load_model() first.")

        conf = conf_threshold if conf_threshold is not None else settings.CONFIDENCE_THRESHOLD
        iou  = iou_threshold  if iou_threshold  is not None else settings.IOU_THRESHOLD

        # Decode image
        try:
            pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        except Exception as e:
            raise ValueError(f"Invalid or corrupt image format: {e}")

        img_width, img_height = pil_image.size

        # Pre-process
        inp, scale_x, scale_y, orig_w, orig_h = _preprocess(pil_image, self._input_size)

        # ONNX inference
        raw = self.session.run(None, {self._input_name: inp})

        # Post-process
        raw_dets = _postprocess(raw[0], scale_x, scale_y, orig_w, orig_h, conf, iou)

        # Build structured detection list (same schema as original)
        detections = []
        for d in raw_dets:
            cls_id     = d["class_id"]
            class_name = self.get_class_name(cls_id)
            confidence = d["confidence"]
            bbox_coords = [d["x1"], d["y1"], d["x2"], d["y2"]]

            severity_info = SeverityEstimator.estimate_detection_severity(
                bbox=bbox_coords,
                image_width=img_width,
                image_height=img_height,
                class_name=class_name,
            )

            detections.append({
                "class_id":             cls_id,
                "class_name":           class_name,
                "confidence":           confidence,
                "confidence_percentage": round(confidence * 100.0, 1),
                "bbox": {"x1": d["x1"], "y1": d["y1"], "x2": d["x2"], "y2": d["y2"]},
                "bbox_raw":             bbox_coords,
                "box_width":            d["x2"] - d["x1"],
                "box_height":           d["y2"] - d["y1"],
                "area_percentage":      severity_info["area_percentage"],
                "severity":             severity_info["severity"],
                "severity_score":       severity_info["weighted_severity_score"],
                "severity_description": severity_info["description"],
            })

        annotated_b64 = self.draw_detections(pil_image, detections)
        condition_info = RoadConditionAnalyzer.evaluate_road_condition(
            detections, img_width, img_height
        )

        return {
            "success": True,
            "model_info": {
                "name":                 self.model_name,
                "is_custom_model":      self.is_custom_model,
                "weights_path":         self.model_path,
                "confidence_threshold": conf,
                "iou_threshold":        iou,
                "inference_device":     "cpu (onnxruntime)",
            },
            "image_metadata": {
                "width":        img_width,
                "height":       img_height,
                "total_pixels": img_width * img_height,
            },
            "detections_count":           len(detections),
            "detections":                 detections,
            "total_damage_area_percentage": condition_info["total_damage_area_percentage"],
            "overall_severity":           condition_info["overall_severity"],
            "overall_condition":          condition_info["overall_condition"],
            "pavement_condition_score":   condition_info["pavement_condition_score"],
            "risk_level":                 condition_info["risk_level"],
            "recommendation":             condition_info["recommendation"],
            "summary":                    condition_info["summary"],
            "annotated_image":            f"data:image/jpeg;base64,{annotated_b64}",
        }

    def draw_detections(self, pil_image: Image.Image, detections: List[Dict[str, Any]]) -> str:
        """
        Draws high-contrast bounding boxes and label cards.
        Identical visual output to the original PyTorch version.
        """
        annotated = pil_image.copy()
        draw = ImageDraw.Draw(annotated, "RGBA")

        try:
            font = ImageFont.truetype("arial.ttf", size=max(14, int(min(pil_image.size) / 38)))
        except Exception:
            font = ImageFont.load_default()

        for det in detections:
            bbox       = det["bbox"]
            x1, y1, x2, y2 = bbox["x1"], bbox["y1"], bbox["x2"], bbox["y2"]
            class_name = det["class_name"]
            conf_pct   = det["confidence_percentage"]
            severity   = det["severity"]

            color_rgb = settings.CLASS_COLORS_RGB.get(class_name, settings.CLASS_COLORS_RGB["Default"])
            r, g, b   = color_rgb

            draw.rectangle([x1, y1, x2, y2], fill=(r, g, b, 45))
            line_width = max(3, int(min(pil_image.size) / 250))
            draw.rectangle([x1, y1, x2, y2], outline=(r, g, b, 255), width=line_width)

            corner_len = max(12, int((x2 - x1) * 0.15))
            corner_w   = line_width + 2
            draw.line([(x1, y1), (x1 + corner_len, y1)], fill=(255, 255, 255, 255), width=corner_w)
            draw.line([(x1, y1), (x1, y1 + corner_len)], fill=(255, 255, 255, 255), width=corner_w)
            draw.line([(x2, y2), (x2 - corner_len, y2)], fill=(255, 255, 255, 255), width=corner_w)
            draw.line([(x2, y2), (x2, y2 - corner_len)], fill=(255, 255, 255, 255), width=corner_w)

            label_text = f"{class_name.upper()} | {conf_pct}% | {severity}"
            try:
                text_bbox = draw.textbbox((x1, y1), label_text, font=font)
                t_w = text_bbox[2] - text_bbox[0]
                t_h = text_bbox[3] - text_bbox[1]
            except Exception:
                t_w, t_h = len(label_text) * 8, 16

            pad      = 6
            label_y1 = max(0, y1 - t_h - pad * 2)
            label_y2 = label_y1 + t_h + pad * 2
            label_x2 = min(pil_image.width, x1 + t_w + pad * 2)

            draw.rectangle([x1, label_y1, label_x2, label_y2],
                           fill=(15, 23, 42, 230), outline=(r, g, b, 255), width=1)
            draw.text((x1 + pad, label_y1 + pad), label_text,
                      fill=(255, 255, 255, 255), font=font)

        buffered = io.BytesIO()
        annotated.convert("RGB").save(buffered, format="JPEG", quality=92)
        return base64.b64encode(buffered.getvalue()).decode("utf-8")


# Global singleton
detector = RoadDamageDetector()
