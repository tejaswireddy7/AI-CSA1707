"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HistoryItem } from "@/lib/types";
import HistoryCard from "@/components/HistoryCard";
import ReportModal from "@/components/ReportModal";
import { 
  History as HistoryIcon, 
  Trash2, 
  Download, 
  Layers, 
  Filter, 
  ArrowLeft, 
  Sparkles,
  Inbox
} from "lucide-react";

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [selectedReportItem, setSelectedReportItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("road_damage_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error reading history from localStorage:", e);
    }
  }, []);

  const handleDelete = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem("road_damage_history", JSON.stringify(updated));
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all inspection history?")) {
      setHistory([]);
      localStorage.removeItem("road_damage_history");
    }
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `road_damage_history_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredHistory = history.filter((item) => {
    if (filterSeverity === "all") return true;
    return item.overallSeverity?.toLowerCase() === filterSeverity.toLowerCase();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-400 mb-2">
            <HistoryIcon className="h-3.5 w-3.5" />
            <span>Audit Trail & Records</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Inspection History
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse and review locally cached YOLOv11 road pavement inspection results.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/analyze"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition-all"
          >
            <Sparkles className="h-4 w-4" />
            <span>New Analysis</span>
          </Link>
          {history.length > 0 && (
            <>
              <button
                onClick={handleExportJson}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                <Download className="h-3.5 w-3.5 text-blue-400" />
                <span>Export JSON</span>
              </button>
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-400 hover:bg-red-500 hover:text-white transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear All</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      {history.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-slate-900/60 border border-slate-800 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Filter className="h-4 w-4 text-blue-400" />
            <span>Filter by Severity:</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {["all", "No Damage", "Low", "Moderate", "High"].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  filterSeverity === sev
                    ? "bg-blue-600 text-white font-semibold"
                    : "bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {sev === "all" ? "All Inspections" : sev}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* History Grid */}
      {filteredHistory.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHistory.map((item) => (
            <HistoryCard
              key={item.id}
              item={item}
              onView={(it) => setSelectedReportItem(it)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/80 text-slate-400">
            <Inbox className="h-8 w-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-200">
            {history.length === 0 ? "No Inspections Found" : "No Results for Selected Filter"}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {history.length === 0
              ? "You haven't run any road damage analyses yet. Upload an image to see your results recorded here."
              : "Try switching your severity filter above to view all past analyses."}
          </p>
          {history.length === 0 && (
            <div className="pt-2">
              <Link
                href="/analyze"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white text-xs shadow-lg shadow-blue-600/20"
              >
                <Sparkles className="h-4 w-4" />
                <span>Start Your First Analysis</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Modal Viewer */}
      {selectedReportItem && (
        <ReportModal
          isOpen={!!selectedReportItem}
          onClose={() => setSelectedReportItem(null)}
          data={selectedReportItem.rawResult}
          filename={selectedReportItem.filename}
        />
      )}
    </div>
  );
}
