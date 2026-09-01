export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Detection {
  class_id: number;
  class_name: string;
  confidence: number;
  confidence_percentage: number;
  bbox: BoundingBox;
  bbox_raw: [number, number, number, number];
  box_width: number;
  box_height: number;
  area_percentage: number;
  severity: "No Damage" | "Low" | "Moderate" | "High";
  severity_score: number;
  severity_description: string;
}

export interface ModelInfo {
  name: string;
  is_custom_model: boolean;
  weights_path: string;
  confidence_threshold: number;
  iou_threshold: number;
  inference_device: string;
}

export interface PredictionResponse {
  success: boolean;
  filename?: string;
  inference_time_ms?: number;
  model_info: ModelInfo;
  image_metadata: {
    width: number;
    height: number;
    total_pixels: number;
  };
  detections_count: number;
  detections: Detection[];
  total_damage_area_percentage: number;
  overall_severity: "No Damage" | "Low" | "Moderate" | "High";
  overall_condition: "No Damage" | "Good" | "Minor Damage" | "Moderate Damage" | "Severe Damage";
  pavement_condition_score: number;
  risk_level: "Minimal" | "Low" | "Elevated" | "Critical";
  recommendation: string;
  summary: string;
  annotated_image: string; // Base64 data URI
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  filename: string;
  thumbnailUrl: string;
  annotatedUrl: string;
  detectionsCount: number;
  damageTypes: string[];
  totalAreaPercentage: number;
  overallSeverity: string;
  overallCondition: string;
  pciScore: number;
  rawResult: PredictionResponse;
}

export interface ServerHealth {
  status: "healthy" | "degraded" | "offline";
  model_loaded: boolean;
  model_name: string;
  is_custom_model: boolean;
  weights_path: string;
  device: string;
  version: string;
}

export interface BenchmarkModelInfo {
  architecture: string;
  variant: string;
  task: string;
  active_weights: string;
  is_custom_model: boolean;
  framework: string;
  classes_supported: Record<number, string>;
  confidence_threshold: number;
  iou_threshold: number;
  metrics_status: string;
  benchmark_dataset_reference: string;
  extent_estimation: string;
  severity_engine: string;
}
