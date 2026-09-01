import React from "react";
import { Cpu, Sparkles, Layers } from "lucide-react";

export default function LoadingState() {
  return (
    <div className="rounded-2xl border border-blue-500/30 bg-slate-900/80 p-8 sm:p-12 text-center shadow-2xl space-y-6">
      {/* Animated Glowing Radar Pulse */}
      <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
        <div className="absolute h-full w-full rounded-full bg-blue-500/20 animate-ping opacity-75" />
        <div className="absolute h-20 w-20 rounded-full bg-blue-500/30 animate-pulse" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/30">
          <Cpu className="h-8 w-8 animate-spin" style={{ animationDuration: "4s" }} />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-slate-100 flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" />
          <span>AI is Analyzing Road Pavement...</span>
        </h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Executing YOLOv11 deep object detection, computing bounding box coordinates, and evaluating damage severity extent.
        </p>
      </div>

      {/* Pipeline Status Indicator Sequence */}
      <div className="mx-auto max-w-sm rounded-xl bg-slate-950/80 border border-slate-800 p-3 space-y-2 text-xs font-mono text-slate-400">
        <div className="flex items-center justify-between text-blue-400">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
            1. Image Normalization & Tensor Load
          </span>
          <span>✓</span>
        </div>
        <div className="flex items-center justify-between text-blue-300">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
            2. YOLOv11 Multi-Scale Feature Extraction
          </span>
          <span className="animate-spin text-[10px]">⚙</span>
        </div>
        <div className="flex items-center justify-between text-slate-500">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
            3. Geometric Extent & Severity Scoring
          </span>
          <span>...</span>
        </div>
      </div>
    </div>
  );
}
