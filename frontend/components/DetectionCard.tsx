import React from "react";
import { Detection } from "@/lib/types";
import SeverityBadge from "./SeverityBadge";
import { Crosshair, Maximize2, ShieldAlert } from "lucide-react";

interface DetectionCardProps {
  detection: Detection;
  index: number;
  isHighlighted?: boolean;
  onHover?: (index: number | null) => void;
}

export default function DetectionCard({
  detection,
  index,
  isHighlighted = false,
  onHover,
}: DetectionCardProps) {
  return (
    <div
      onMouseEnter={() => onHover && onHover(index)}
      onMouseLeave={() => onHover && onHover(null)}
      className={`rounded-xl border p-4 transition-all duration-200 cursor-pointer ${
        isHighlighted
          ? "border-blue-500 bg-blue-950/30 shadow-lg shadow-blue-500/10 scale-[1.01]"
          : "border-slate-800 bg-slate-900/70 hover:border-slate-700 hover:bg-slate-900"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-xs font-mono font-bold text-slate-300 border border-slate-700">
            {index + 1}
          </span>
          <h4 className="font-bold text-slate-100 text-sm">
            {detection.class_name}
          </h4>
        </div>
        <SeverityBadge severity={detection.severity} size="sm" />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="rounded-lg bg-slate-950/80 p-2 border border-slate-800/80">
          <div className="text-[10px] text-slate-400 font-sans">Confidence Score</div>
          <div className="text-sm font-bold text-blue-400 mt-0.5">
            {detection.confidence_percentage}%
          </div>
        </div>

        <div className="rounded-lg bg-slate-950/80 p-2 border border-slate-800/80">
          <div className="text-[10px] text-slate-400 font-sans">Distress Extent</div>
          <div className="text-sm font-bold text-slate-200 mt-0.5">
            {detection.area_percentage}%
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1">
          <Crosshair className="h-3 w-3 text-slate-500" />
          <span className="font-mono">
            {detection.box_width}x{detection.box_height} px
          </span>
        </div>
        <div className="text-[10px] text-slate-500 font-mono">
          [{detection.bbox.x1}, {detection.bbox.y1}, {detection.bbox.x2}, {detection.bbox.y2}]
        </div>
      </div>
    </div>
  );
}
