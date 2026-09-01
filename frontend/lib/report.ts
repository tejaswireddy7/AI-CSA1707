import { PredictionResponse } from "./types";

export function generateTextReport(data: PredictionResponse, filename: string): string {
  const timestamp = new Date().toLocaleString();
  const divider = "=".repeat(65);
  const subDivider = "-".repeat(65);

  let content = `${divider}
AI ROAD DAMAGE DETECTION & SEVERITY ASSESSMENT REPORT
${divider}

Report Generated : ${timestamp}
File Inspected   : ${filename}
Image Resolution : ${data.image_metadata.width} x ${data.image_metadata.height} px (${(data.image_metadata.total_pixels / 1_000_000).toFixed(2)} MP)
Inference Engine : ${data.model_info.name}
Inference Device : ${data.model_info.inference_device.toUpperCase()}
Inference Time   : ${data.inference_time_ms ? `${data.inference_time_ms} ms` : "N/A"}

${subDivider}
1. EXECUTIVE SUMMARY & OVERALL CONDITION
${subDivider}
Overall Road Condition   : ${data.overall_condition.toUpperCase()}
Overall Severity Level   : ${data.overall_severity.toUpperCase()}
Total Distress Extent    : ${data.total_damage_area_percentage}% of pavement area
Pavement Index (PCI)     : ${data.pavement_condition_score} / 100
Operational Risk Level   : ${data.risk_level.toUpperCase()}

Maintenance Action :
${data.recommendation}

${subDivider}
2. DETECTED SURFACE DISTRESSES (${data.detections_count} TOTAL)
${subDivider}
`;

  if (data.detections_count === 0) {
    content += "No road damage anomalies were detected within the active confidence threshold.\n";
  } else {
    data.detections.forEach((det, idx) => {
      content += `
[Damage #${idx + 1}] ${det.class_name.toUpperCase()}
  - Confidence Score    : ${det.confidence_percentage}% (YOLOv11 Raw: ${det.confidence})
  - Estimated Severity  : ${det.severity.toUpperCase()}
  - Distress Area Ratio : ${det.area_percentage}% of total image
  - Bounding Box [x1,y1,x2,y2] : [${det.bbox.x1}, ${det.bbox.y1}, ${det.bbox.x2}, ${det.bbox.y2}]
  - Assessment Notes    : ${det.severity_description}
`;
    });
  }

  content += `
${subDivider}
3. ACADEMIC & METHODOLOGICAL NOTES
${subDivider}
- YOLOv11 Deep Learning Model provides bounding box localization & classification.
- Severity levels are estimated via mathematical spatial bounding-box area ratios.
- Capstone Project: AI-Driven Road Damage Detection and Severity Assessment.

${divider}
END OF REPORT
${divider}
`;

  return content;
}

export function downloadTextReport(data: PredictionResponse, filename: string): void {
  const content = generateTextReport(data, filename);
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `road_damage_report_${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadJsonReport(data: PredictionResponse, filename: string): void {
  const exportData = {
    metadata: {
      exported_at: new Date().toISOString(),
      source_file: filename,
    },
    ...data,
  };
  const jsonStr = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `road_damage_data_${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadBase64Image(dataUri: string, filename: string = "annotated_road.jpg"): void {
  const a = document.createElement("a");
  a.href = dataUri;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
