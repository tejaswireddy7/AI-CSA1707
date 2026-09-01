# AI Methodology & Theoretical Framework

**Project Title**: AI-Driven Road Damage Detection and Severity Assessment Using YOLO-Based Deep Object Detection

---

## 1. End-to-End Scientific Pipeline

```
Dataset Collection (RDD2020/2022)
               │
               ▼
Annotation Standardization (YOLO txt format: class, x_center, y_center, width, height)
               │
               ▼
Data Augmentation & Normalization (Mosaic, MixUp, HSV jitter, Random Flips)
               │
               ▼
YOLOv11 Deep Neural Network Transfer Learning (C3k2, SPPF, C2PSA Attention)
               │
               ▼
Loss Optimization (CIoU + DFL + BCE Classification Loss)
               │
               ▼
Inference & Non-Maximum Suppression (NMS)
               │
               ▼
Bounding-Box Geometric Extent Calculation
               │
               ▼
Calibrated Severity Level Estimation (No Damage, Low, Moderate, High)
               │
               ▼
Pavement Condition Index (PCI) Proxy & Maintenance Advisory
```

---

## 2. Deep Object Detection with YOLOv11

YOLOv11 represents state-of-the-art single-stage object detection:
- **Backbone**: Modified CSPDarknet integrating C3k2 blocks for lightweight yet expressive feature extraction.
- **Attention**: C2PSA (Cross-Stage Partial Self-Attention) captures long-range spatial dependencies across asphalt cracks and irregular pothole boundaries.
- **Neck**: Path Aggregation Network (PANet) fusing multi-scale feature maps for detecting fine micro-cracks alongside large potholes.
- **Head**: Decoupled anchor-free detection head separating classification and bounding box regression branches.

---

## 3. Mathematical Severity Formulation

### A. Individual Distress Extent Ratio

For a detected bounding box $B_i = [x_1, y_1, x_2, y_2]$ on an image of dimensions $W \times H$:

$$\text{Box Area}(B_i) = (x_2 - x_1) \times (y_2 - y_1)$$

$$\text{Area Percentage}(B_i) = \left( \frac{\text{Box Area}(B_i)}{W \times H} \right) \times 100$$

### B. Calibrated Severity Tiering

$$\text{Severity}(B_i) = \begin{cases} 
\text{No Damage} & \text{if } \text{Area} = 0\% \\
\text{Low} & \text{if } 0\% < \text{Area} < 10\% \\
\text{Moderate} & \text{if } 10\% \le \text{Area} \le 30\% \\
\text{High} & \text{if } \text{Area} > 30\%
\end{cases}$$

### C. Overall Road Condition & Pavement Index Proxy

Given $N$ detections with cumulative distress area $A_{\text{total}}$ and maximum severity rank $R_{\max} \in \{0, 1, 2, 3\}$:

$$\text{PCI Proxy} = \max\left(0, 100 - \left[ 1.5 \cdot A_{\text{total}} + 5.0 \cdot N + 10.0 \cdot R_{\max} \right] \right)$$

---

## 4. Academic Distinction Note

> [!NOTE]
> In this capstone architecture, YOLOv11 provides deep object detection (classes, bounding coordinates, and confidence). Severity estimation is computed mathematically through geometric spatial analysis and domain impact weightings. The application does not falsely claim that generic YOLO classifies severity without specialized multi-task annotation heads.
