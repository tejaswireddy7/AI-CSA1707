import React from "react";
import { HistoryItem } from "@/lib/types";
import SeverityBadge from "./SeverityBadge";
import { Calendar, Trash2, Eye, FileText, Layers } from "lucide-react";

interface HistoryCardProps {
  item: HistoryItem;
  onView: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
}

export default function HistoryCard({ item, onView, onDelete }: HistoryCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 shadow-lg hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between">
      {/* Top Image Preview & Details */}
      <div className="space-y-3">
        <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 h-44 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.annotatedUrl || item.thumbnailUrl}
            alt={item.filename}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2.5 right-2.5">
            <SeverityBadge severity={item.overallSeverity} size="sm" />
          </div>
          <div className="absolute bottom-2.5 left-2.5 rounded bg-slate-950/80 px-2 py-0.5 text-[10px] font-mono text-slate-300 backdrop-blur-sm border border-slate-800">
            {item.detectionsCount} {item.detectionsCount === 1 ? "Distress" : "Distresses"}
          </div>
        </div>

        <div>
          <h4 className="font-bold text-slate-100 text-sm truncate" title={item.filename}>
            {item.filename}
          </h4>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar className="h-3.5 w-3.5 text-slate-500" />
            <span>{new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        {/* Condition & Metrics Summary */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="rounded-lg bg-slate-950 p-2 border border-slate-800/80">
            <div className="text-[10px] font-sans text-slate-500">Overall Condition</div>
            <div className="font-bold text-slate-200 text-[11px] truncate mt-0.5">
              {item.overallCondition}
            </div>
          </div>
          <div className="rounded-lg bg-slate-950 p-2 border border-slate-800/80">
            <div className="text-[10px] font-sans text-slate-500">Extent Area</div>
            <div className="font-bold text-blue-400 text-[11px] mt-0.5">
              {item.totalAreaPercentage}%
            </div>
          </div>
        </div>

        {/* Damage Type Tags */}
        {item.damageTypes && item.damageTypes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {Array.from(new Set(item.damageTypes)).map((dmg, i) => (
              <span
                key={i}
                className="rounded bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 text-[10px] text-slate-300 font-sans"
              >
                {dmg}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <button
          onClick={() => onView(item)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600/15 border border-blue-500/30 text-xs font-semibold text-blue-400 hover:bg-blue-600 hover:text-white transition-all"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>View Analysis</span>
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="p-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
          title="Delete from history"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
