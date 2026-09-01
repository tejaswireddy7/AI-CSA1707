"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  RotateCcw, 
  Download, 
  FileText, 
  AlertCircle, 
  Layers, 
  Info, 
  CheckCircle2,
  Cpu,
  History as HistoryIcon
} from "lucide-react";
import ImageUploader from "@/components/ImageUploader";
import ImagePreview from "@/components/ImagePreview";
import LoadingState from "@/components/LoadingState";
import AnnotatedViewer from "@/components/AnnotatedViewer";
import ConditionCard from "@/components/ConditionCard";
import DetectionTable from "@/components/DetectionTable";
import DetectionCard from "@/components/DetectionCard";
import ReportModal from "@/components/ReportModal";
import { predictRoadDamage, checkServerHealth } from "@/lib/api";
import { PredictionResponse, HistoryItem, ServerHealth } from "@/lib/types";
import { downloadBase64Image } from "@/lib/report";
import Link from "next/link";

export default function AnalyzePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [serverHealth, setServerHealth] = useState<ServerHealth | null>(null);

  useEffect(() => {
    checkServerHealth().then(setServerHealth);
  }, []);

  const handleImageSelected = (
    file: File,
    dataUrl: string,
    dims: { width: number; height: number }
  ) => {
    setSelectedFile(file);
    setPreviewUrl(dataUrl);
    setDimensions(dims);
    setResult(null);
    setErrorMessage(null);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setDimensions({ width: 0, height: 0 });
    setResult(null);
    setErrorMessage(null);
    setHoveredIndex(null);
  };

  const handleAnalyze = async (confidenceThreshold: number) => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const response = await predictRoadDamage(selectedFile, confidenceThreshold);
      setResult(response);

      // Save to localStorage history
      try {
        const existingHistoryStr = localStorage.getItem("road_damage_history");
        const existingHistory: HistoryItem[] = existingHistoryStr ? JSON.parse(existingHistoryStr) : [];
        
        const newEntry: HistoryItem = {
          id: `hist_${Date.now()}`,
          timestamp: new Date().toISOString(),
          filename: selectedFile.name,
          thumbnailUrl: previewUrl || "",
          annotatedUrl: response.annotated_image,
          detectionsCount: response.detections_count,
          damageTypes: response.detections.map((d) => d.class_name),
          totalAreaPercentage: response.total_damage_area_percentage,
          overallSeverity: response.overall_severity,
          overallCondition: response.overall_condition,
          pciScore: response.pavement_condition_score,
          rawResult: response,
        };

        const updatedHistory = [newEntry, ...existingHistory.slice(0, 49)];
        localStorage.setItem("road_damage_history", JSON.stringify(updatedHistory));
      } catch (storageErr) {
        console.warn("Could not save to localStorage:", storageErr);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unexpected error occurred during prediction.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-400 mb-2">
            <Cpu className="h-3.5 w-3.5" />
            <span>AI Road Damage Analysis Studio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Analyze Road Pavement
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Upload a road pavement image to detect distresses, calculate damage extent, and assess structural severity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/history"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <HistoryIcon className="h-4 w-4 text-slate-400" />
            <span>View History</span>
          </Link>
        </div>
      </div>

      {/* Backend Status Warning if Degraded or Offline */}
      {serverHealth && serverHealth.status !== "healthy" && (
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 flex items-start gap-3 text-xs text-amber-300">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Notice: Backend AI Status is Degraded / Reconnecting</span>
            <p className="text-amber-200/80">
              Ensure the FastAPI backend is running (`uvicorn main:app --reload` on port 8000). The system will automatically use the YOLOv11 model once initialized.
            </p>
          </div>
        </div>
      )}

      {/* Development Model Fallback Notice */}
      {result && !result.model_info.is_custom_model && (
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 flex items-start gap-3.5 text-xs text-amber-300">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Development Pretrained Model Active ({result.model_info.name})</span>
            <p className="text-amber-200/90 leading-relaxed">
              The backend is currently running the base YOLOv11 fallback model (trained on general objects like cars/pedestrians). To detect custom <strong>Potholes, Longitudinal Cracks, Transverse Cracks, and Alligator Cracks</strong>, train YOLOv11 on the Road Damage Dataset (RDD) in Google Colab and place the resulting <code>best.pt</code> in <code>backend/models/best.pt</code>.
            </p>
          </div>
        </div>
      )}

      {/* 3. STEP 1: Upload State (When no image is chosen) */}
      {!previewUrl && !isAnalyzing && !result && (
        <div className="max-w-2xl mx-auto py-6">
          <ImageUploader onImageSelected={handleImageSelected} />
        </div>
      )}

      {/* 4. STEP 2: Preview State (Image uploaded, awaiting analysis) */}
      {previewUrl && selectedFile && !isAnalyzing && !result && (
        <div className="max-w-3xl mx-auto">
          <ImagePreview
            file={selectedFile}
            previewUrl={previewUrl}
            dimensions={dimensions}
            onAnalyze={handleAnalyze}
            onRemove={handleReset}
            isAnalyzing={isAnalyzing}
          />
        </div>
      )}

      {/* 5. STEP 3: Loading / Inference State */}
      {isAnalyzing && (
        <div className="max-w-2xl mx-auto py-8">
          <LoadingState />
        </div>
      )}

      {/* 6. STEP 4: Analysis Results State */}
      {result && previewUrl && selectedFile && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Action Bar (Top of Results) */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="text-xs font-semibold text-slate-200">
                Inference Complete ({result.inference_time_ms ? `${result.inference_time_ms} ms` : "Instant"})
              </span>
              <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                • {result.model_info.name}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => downloadBase64Image(result.annotated_image, `yolo_${selectedFile.name}`)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                <Download className="h-3.5 w-3.5 text-blue-400" />
                <span>Annotated Image</span>
              </button>

              <button
                onClick={() => setIsReportModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition-all"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Inspection Report</span>
              </button>

              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Analyze Another</span>
              </button>
            </div>
          </div>

          {/* Side-by-Side YOLO Annotation Display */}
          <AnnotatedViewer
            originalUrl={previewUrl}
            annotatedUrl={result.annotated_image}
            filename={selectedFile.name}
            detectionsCount={result.detections_count}
            hoveredIndex={hoveredIndex}
          />

          {/* Overall Road Condition Assessment Card */}
          <ConditionCard
            condition={result.overall_condition}
            severity={result.overall_severity}
            totalAreaPercentage={result.total_damage_area_percentage}
            pciScore={result.pavement_condition_score}
            riskLevel={result.risk_level}
            recommendation={result.recommendation}
            detectionsCount={result.detections_count}
          />

          {/* Detections Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-400" />
                <span>Detection Results ({result.detections_count})</span>
              </h3>
              <span className="text-xs text-slate-400">
                Sorted by spatial localization
              </span>
            </div>

            {/* Detections Table View */}
            <DetectionTable
              detections={result.detections}
              onHighlight={setHoveredIndex}
              hoveredIndex={hoveredIndex}
            />

            {/* Detection Cards (Mobile & Expanded Grid) */}
            {result.detections_count > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {result.detections.map((det, idx) => (
                  <DetectionCard
                    key={idx}
                    detection={det}
                    index={idx}
                    isHighlighted={hoveredIndex === idx}
                    onHover={setHoveredIndex}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Bottom Call to Action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <button
              onClick={handleReset}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-xl shadow-blue-600/25 transition-all text-sm"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Analyze Another Image</span>
            </button>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-800 font-semibold text-slate-200 hover:bg-slate-800 transition-colors text-sm"
            >
              <FileText className="h-4 w-4 text-blue-400" />
              <span>Generate Full Report</span>
            </button>
          </div>

          {/* Certificate / Report Modal */}
          <ReportModal
            isOpen={isReportModalOpen}
            onClose={() => setIsReportModalOpen(false)}
            data={result}
            filename={selectedFile.name}
          />
        </div>
      )}
    </div>
  );
}
