"use client";

import React, { useState, useEffect } from "react";
import { fetchModelInfo, checkServerHealth } from "@/lib/api";
import { BenchmarkModelInfo, ServerHealth } from "@/lib/types";
import { 
  Cpu, 
  Layers, 
  Activity, 
  ShieldAlert, 
  Info, 
  CheckCircle2, 
  Sliders, 
  AlertCircle,
  Database,
  BarChart2
} from "lucide-react";

export default function ModelInfoPage() {
  const [modelInfo, setModelInfo] = useState<BenchmarkModelInfo | null>(null);
  const [health, setHealth] = useState<ServerHealth | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([fetchModelInfo(), checkServerHealth()]).then(([info, h]) => {
      setModelInfo(info);
      setHealth(h);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-3.5 py-1 text-xs font-semibold text-blue-400">
          <Cpu className="h-3.5 w-3.5" />
          <span>Live Neural Engine Telemetry</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-100 tracking-tight">
          YOLOv11 Model Specifications
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          Authentic architectural parameters and real-time backend inference status for the Road Damage Detection pipeline.
        </p>
      </div>

      {/* Live Server State Status Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-blue-400">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Inference Backend Status</div>
            <div className="text-base font-bold text-slate-100">
              {health?.status === "healthy" ? "Online & Ready for Inference" : "Server Disconnected"}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <span className="rounded-lg bg-slate-950 px-3 py-1.5 border border-slate-800 text-slate-300">
            Device: <span className="text-blue-400 font-bold">{health?.device?.toUpperCase() || "CPU"}</span>
          </span>
          <span className="rounded-lg bg-slate-950 px-3 py-1.5 border border-slate-800 text-slate-300">
            Active Weights: <span className="text-amber-400 font-bold">{health?.weights_path || "yolo11n.pt"}</span>
          </span>
        </div>
      </div>

      {/* Model Spec Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-2 shadow-lg">
          <span className="text-xs font-mono text-slate-400 uppercase">Architecture</span>
          <h3 className="text-xl font-bold text-slate-100">YOLOv11 (Ultralytics)</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Single-stage real-time object detector featuring C3k2 convolutional feature extraction and C2PSA attention.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-2 shadow-lg">
          <span className="text-xs font-mono text-slate-400 uppercase">Target Task</span>
          <h3 className="text-xl font-bold text-slate-100">Object Detection</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Multi-class bounding box spatial localization $[x_1, y_1, x_2, y_2]$ and class probability output.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-2 shadow-lg">
          <span className="text-xs font-mono text-slate-400 uppercase">Supported Classes</span>
          <h3 className="text-xl font-bold text-slate-100">4 Distress Types</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Longitudinal Crack, Transverse Crack, Alligator Crack, and Pothole according to RDD benchmarks.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-2 shadow-lg">
          <span className="text-xs font-mono text-slate-400 uppercase">Input Specification</span>
          <h3 className="text-xl font-bold text-slate-100">Road Pavement Image</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Standard RGB images (JPG/PNG), dynamically normalized to 640×640 tensor input dimensions.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-2 shadow-lg">
          <span className="text-xs font-mono text-slate-400 uppercase">Custom Weights File</span>
          <h3 className="text-xl font-bold text-slate-100">backend/models/best.pt</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Configurable via <code>MODEL_PATH</code> environment variable. Defaults to <code>yolo11n.pt</code> development fallback if best.pt is absent.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-2 shadow-lg">
          <span className="text-xs font-mono text-slate-400 uppercase">Severity Methodology</span>
          <h3 className="text-xl font-bold text-slate-100">Geometric Extent Ratio</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Mathematical bounding box area percentage relative to image size. Clearly decoupled from neural classification.
          </p>
        </div>
      </div>

      {/* Model Benchmark Metrics Section */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <BarChart2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100">
                Evaluation & Benchmark Metrics
              </h3>
              <p className="text-xs text-slate-400">
                Academic Standard: Precision, Recall, mAP@50, and mAP@50-95
              </p>
            </div>
          </div>
        </div>

        {/* Academic Notice on Fabricated Accuracy */}
        <div className="rounded-2xl bg-slate-950 border border-slate-800/80 p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Info className="h-4 w-4 shrink-0" />
            <span>Academic Policy on Benchmark Metrics</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            In accordance with project guidelines, this application does not fabricate static accuracy metrics (e.g. &quot;95% accuracy&quot;). Measured benchmark metrics are generated exclusively by executing the evaluation suite on the validated test dataset:
          </p>
          <div className="rounded-xl bg-slate-900 p-3 font-mono text-xs text-blue-300 border border-slate-800">
            python model/evaluation/evaluate.py --weights backend/models/best.pt --data data.yaml
          </div>
          <p className="text-[11px] text-slate-400 italic">
            Status: {modelInfo?.metrics_status || "Metrics unavailable until model evaluation is completed on test split."}
          </p>
        </div>
      </div>
    </div>
  );
}
