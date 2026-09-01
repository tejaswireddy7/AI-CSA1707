"use client";

import React, { useState } from "react";
import { PredictionResponse } from "@/lib/types";
import { generateTextReport, downloadTextReport, downloadJsonReport } from "@/lib/report";
import { X, FileText, Download, Code, Check, Printer } from "lucide-react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PredictionResponse;
  filename: string;
}

export default function ReportModal({ isOpen, onClose, data, filename }: ReportModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const reportText = generateTextReport(data, filename);

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">
                AI Road Damage Analysis Certificate
              </h3>
              <p className="text-xs text-slate-400">
                Official Capstone Inspection Report • YOLOv11 Deep Object Detection
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body: Text Report Preview */}
        <div className="p-6 overflow-y-auto font-mono text-xs text-slate-300 space-y-4 bg-slate-950/60 leading-relaxed">
          <pre className="whitespace-pre-wrap rounded-xl border border-slate-800/80 bg-slate-950 p-4 select-all shadow-inner overflow-x-auto text-[11px] sm:text-xs">
            {reportText}
          </pre>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <FileText className="h-3.5 w-3.5" />}
              <span>{copied ? "Copied to Clipboard" : "Copy Text"}</span>
            </button>
            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadJsonReport(data, filename)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
            >
              <Code className="h-3.5 w-3.5 text-amber-400" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={() => downloadTextReport(data, filename)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition-all"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download (.txt)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
