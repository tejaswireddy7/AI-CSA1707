"use client";

import React, { useState } from "react";
import { Layers, Columns, Image as ImageIcon, Sparkles, Download, Check } from "lucide-react";
import { downloadBase64Image } from "@/lib/report";

interface AnnotatedViewerProps {
  originalUrl: string;
  annotatedUrl: string;
  filename: string;
  detectionsCount: number;
  hoveredIndex?: number | null;
}

export default function AnnotatedViewer({
  originalUrl,
  annotatedUrl,
  filename,
  detectionsCount,
}: AnnotatedViewerProps) {
  const [viewMode, setViewMode] = useState<"side-by-side" | "annotated-only" | "original-only">("side-by-side");
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const handleDownload = () => {
    downloadBase64Image(annotatedUrl, `annotated_${filename || "road_analysis.jpg"}`);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 shadow-xl space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="font-bold text-slate-100 text-base sm:text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-400" />
            <span>YOLOv11 Visual Analysis</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {detectionsCount > 0
              ? `${detectionsCount} road damage ${detectionsCount === 1 ? "distress" : "distresses"} identified with bounding boxes.`
              : "Clean pavement view. No distress detected."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle Buttons */}
          <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode("side-by-side")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
                viewMode === "side-by-side"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Columns className="h-3.5 w-3.5" />
              <span>Split View</span>
            </button>
            <button
              onClick={() => setViewMode("annotated-only")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
                viewMode === "annotated-only"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>AI Overlay</span>
            </button>
            <button
              onClick={() => setViewMode("original-only")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
                viewMode === "original-only"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <ImageIcon className="h-3.5 w-3.5" />
              <span>Raw</span>
            </button>
          </div>

          {/* Download Annotated Image Button */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs font-semibold text-slate-100 transition-colors shadow-sm"
          >
            {downloadSuccess ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-300">Saved</span>
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5 text-blue-400" />
                <span>Download Overlay</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Image Containers */}
      {viewMode === "side-by-side" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Raw Image */}
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col items-center justify-center">
            <div className="w-full bg-slate-950/90 px-3 py-1.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold">Original Pavement</span>
              <span className="text-[10px] text-slate-500">Pre-Inference</span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={originalUrl}
              alt="Raw road capture"
              className="w-full max-h-[460px] object-contain"
            />
          </div>

          {/* YOLO Annotated Image */}
          <div className="relative rounded-xl overflow-hidden border border-blue-500/40 bg-slate-950 flex flex-col items-center justify-center shadow-lg shadow-blue-500/5">
            <div className="w-full bg-blue-950/60 px-3 py-1.5 border-b border-blue-500/30 flex items-center justify-between text-xs text-blue-200">
              <span className="font-semibold flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-amber-300" />
                YOLOv11 Deep Detection
              </span>
              <span className="text-[10px] font-mono text-blue-300 bg-blue-900/60 px-2 py-0.5 rounded border border-blue-500/30">
                {detectionsCount} Bounding Boxes
              </span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={annotatedUrl}
              alt="YOLOv11 annotated road capture"
              className="w-full max-h-[460px] object-contain"
            />
          </div>
        </div>
      )}

      {viewMode === "annotated-only" && (
        <div className="relative rounded-xl overflow-hidden border border-blue-500/40 bg-slate-950 flex flex-col items-center justify-center">
          <div className="w-full bg-blue-950/60 px-4 py-2 border-b border-blue-500/30 flex items-center justify-between text-xs text-blue-200">
            <span className="font-semibold flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              YOLOv11 Detection Overlay
            </span>
            <span className="text-xs font-mono text-blue-300">
              {detectionsCount} Detected Instances
            </span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={annotatedUrl}
            alt="YOLOv11 annotated road capture"
            className="w-full max-h-[580px] object-contain"
          />
        </div>
      )}

      {viewMode === "original-only" && (
        <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col items-center justify-center">
          <div className="w-full bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold">Raw Pavement Image</span>
            <span className="text-xs text-slate-500">{filename}</span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={originalUrl}
            alt="Raw road capture"
            className="w-full max-h-[580px] object-contain"
          />
        </div>
      )}
    </div>
  );
}
