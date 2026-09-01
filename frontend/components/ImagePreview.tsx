"use client";

import React, { useState } from "react";
import { Sparkles, Trash2, Sliders, Image as ImageIcon, CheckCircle, Info } from "lucide-react";

interface ImagePreviewProps {
  file: File;
  previewUrl: string;
  dimensions: { width: number; height: number };
  onAnalyze: (confidenceThreshold: number) => void;
  onRemove: () => void;
  isAnalyzing: boolean;
}

export default function ImagePreview({
  file,
  previewUrl,
  dimensions,
  onAnalyze,
  onRemove,
  isAnalyzing,
}: ImagePreviewProps) {
  const [confidence, setConfidence] = useState<number>(0.25);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const fileSizeFormatted = (file.size / (1024 * 1024)).toFixed(2);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-blue-400" />
            <span>Ready for Deep YOLOv11 Analysis</span>
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="font-medium text-slate-200 truncate max-w-[200px] sm:max-w-xs">
              {file.name}
            </span>
            <span>•</span>
            <span className="font-mono">{fileSizeFormatted} MB</span>
            <span>•</span>
            <span className="font-mono">{dimensions.width} × {dimensions.height} px</span>
          </div>
        </div>

        <button
          onClick={onRemove}
          disabled={isAnalyzing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-xs font-medium text-red-400 hover:bg-red-500/20 disabled:opacity-50 transition-colors self-start sm:self-auto"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Remove Image</span>
        </button>
      </div>

      {/* Image Display */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800/80 bg-slate-950 flex items-center justify-center max-h-[480px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewUrl}
          alt="Road Surface"
          className="max-h-[480px] w-full object-contain rounded-xl"
        />
        <div className="absolute top-3 left-3 rounded-lg bg-slate-950/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-slate-300 border border-slate-800">
          Original Input Pavement
        </div>
      </div>

      {/* Optional YOLO Confidence Filter Slider */}
      <div className="rounded-xl bg-slate-950/70 border border-slate-800/80 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white"
          >
            <Sliders className="h-3.5 w-3.5 text-blue-400" />
            <span>Advanced YOLOv11 Parameters</span>
            <span className="text-[11px] text-slate-500">
              (Confidence Threshold: {(confidence * 100).toFixed(0)}%)
            </span>
          </button>
        </div>

        {showSettings && (
          <div className="pt-2 space-y-2 border-t border-slate-800/60">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Confidence Threshold</span>
              <span className="font-mono text-blue-400 font-bold">
                {(confidence * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.90"
              step="0.05"
              value={confidence}
              onChange={(e) => setConfidence(parseFloat(e.target.value))}
              disabled={isAnalyzing}
              className="w-full accent-blue-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>10% (High Sensitivity)</span>
              <span>50% (Balanced)</span>
              <span>90% (Strict)</span>
            </div>
          </div>
        )}
      </div>

      {/* Analyze Button */}
      <div>
        <button
          onClick={() => onAnalyze(confidence)}
          disabled={isAnalyzing}
          className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-6 py-4 text-center font-bold text-white shadow-xl shadow-blue-600/25 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-center gap-2 text-base sm:text-lg">
            <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" />
            <span>Analyze Road Damage</span>
          </div>
          <span className="text-xs font-normal text-blue-100/80 block mt-0.5">
            Execute Genuine YOLOv11 Detection & Severity Pipeline
          </span>
        </button>
      </div>
    </div>
  );
}
