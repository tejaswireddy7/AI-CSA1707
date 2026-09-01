import React from "react";
import { Detection } from "@/lib/types";
import SeverityBadge from "./SeverityBadge";
import { Eye, Layers, Crosshair } from "lucide-react";

interface DetectionTableProps {
  detections: Detection[];
  onHighlight?: (index: number | null) => void;
  hoveredIndex?: number | null;
}

export default function DetectionTable({
  detections,
  onHighlight,
  hoveredIndex,
}: DetectionTableProps) {
  if (detections.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center">
        <Layers className="mx-auto h-8 w-8 text-slate-500" />
        <p className="mt-2 text-sm font-medium text-slate-300">
          No road damage detected.
        </p>
        <p className="text-xs text-slate-500 mt-1">
          The pavement image shows no surface defects above the confidence threshold.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-4 py-3.5">#</th>
              <th scope="col" className="px-4 py-3.5">Damage Type</th>
              <th scope="col" className="px-4 py-3.5">YOLOv11 Confidence</th>
              <th scope="col" className="px-4 py-3.5">Estimated Extent</th>
              <th scope="col" className="px-4 py-3.5">Estimated Severity</th>
              <th scope="col" className="px-4 py-3.5">Bounding Coordinates</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
            {detections.map((det, index) => {
              const isHovered = hoveredIndex === index;
              return (
                <tr
                  key={index}
                  onMouseEnter={() => onHighlight && onHighlight(index)}
                  onMouseLeave={() => onHighlight && onHighlight(null)}
                  className={`transition-colors cursor-pointer ${
                    isHovered
                      ? "bg-blue-950/40 border-l-2 border-l-blue-500"
                      : "hover:bg-slate-800/40"
                  }`}
                >
                  <td className="px-4 py-3 font-semibold text-slate-400">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 font-sans font-semibold text-slate-100 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-400" />
                    <span>{det.class_name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-blue-300">
                        {det.confidence_percentage}%
                      </span>
                      <div className="hidden sm:block h-1.5 w-16 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${det.confidence_percentage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {det.area_percentage}% of view
                  </td>
                  <td className="px-4 py-3 font-sans">
                    <SeverityBadge severity={det.severity} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-[11px]">
                    <span className="inline-flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      <Crosshair className="h-3 w-3 text-slate-500" />
                      [{det.bbox.x1}, {det.bbox.y1}, {det.bbox.x2}, {det.bbox.y2}]
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
