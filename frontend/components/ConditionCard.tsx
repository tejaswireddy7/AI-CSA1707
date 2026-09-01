import React from "react";
import { ShieldCheck, AlertCircle, AlertTriangle, CheckCircle2, Wrench, Info } from "lucide-react";
import SeverityBadge from "./SeverityBadge";

interface ConditionCardProps {
  condition: string;
  severity: string;
  totalAreaPercentage: number;
  pciScore: number;
  riskLevel: string;
  recommendation: string;
  detectionsCount: number;
}

export default function ConditionCard({
  condition,
  severity,
  totalAreaPercentage,
  pciScore,
  riskLevel,
  recommendation,
  detectionsCount,
}: ConditionCardProps) {
  const normCond = condition.toLowerCase();

  let headerGradient = "from-slate-900 to-slate-950 border-slate-800";
  let statusColor = "text-slate-100";
  let IconComponent = Info;

  if (normCond.includes("no damage") || normCond.includes("good")) {
    headerGradient = "from-emerald-950/40 via-slate-900 to-slate-950 border-emerald-500/30";
    statusColor = "text-emerald-400";
    IconComponent = CheckCircle2;
  } else if (normCond.includes("minor")) {
    headerGradient = "from-blue-950/40 via-slate-900 to-slate-950 border-blue-500/30";
    statusColor = "text-blue-400";
    IconComponent = ShieldCheck;
  } else if (normCond.includes("moderate")) {
    headerGradient = "from-amber-950/40 via-slate-900 to-slate-950 border-amber-500/30";
    statusColor = "text-amber-400";
    IconComponent = AlertTriangle;
  } else if (normCond.includes("severe")) {
    headerGradient = "from-red-950/40 via-slate-900 to-slate-950 border-red-500/40";
    statusColor = "text-red-400";
    IconComponent = AlertCircle;
  }

  return (
    <div className={`rounded-2xl bg-gradient-to-b ${headerGradient} border p-6 shadow-xl space-y-6 transition-all`}>
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900/90 border border-slate-700/60 shadow-inner">
            <IconComponent className={`h-6 w-6 ${statusColor}`} />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Overall Road Assessment
            </div>
            <div className={`text-2xl sm:text-3xl font-black ${statusColor} tracking-tight`}>
              {condition}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SeverityBadge severity={severity} size="lg" />
          <span className="rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-xs font-mono text-slate-300">
            Risk: <span className="font-semibold text-white">{riskLevel}</span>
          </span>
        </div>
      </div>

      {/* Metrics 3-Col Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Extent Area % */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800/80 p-4">
          <div className="text-[11px] font-medium text-slate-400">Estimated Distress Extent</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{totalAreaPercentage}%</span>
            <span className="text-[11px] text-slate-500">of pavement area</span>
          </div>
          <div className="mt-2 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                totalAreaPercentage > 30 ? "bg-red-500" : totalAreaPercentage > 10 ? "bg-amber-500" : "bg-blue-500"
              }`}
              style={{ width: `${Math.min(totalAreaPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Detections Count */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800/80 p-4">
          <div className="text-[11px] font-medium text-slate-400">Total Anomalies Located</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{detectionsCount}</span>
            <span className="text-[11px] text-slate-500">instances</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            YOLOv11 multi-class localization
          </p>
        </div>

        {/* Metric 3: Pavement Condition Index Proxy */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800/80 p-4">
          <div className="text-[11px] font-medium text-slate-400">Pavement Index (PCI Proxy)</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono ${pciScore >= 80 ? "text-emerald-400" : pciScore >= 50 ? "text-amber-400" : "text-red-400"}`}>
              {pciScore}
            </span>
            <span className="text-[11px] text-slate-500">/ 100</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            Weighted serviceability score
          </p>
        </div>
      </div>

      {/* Engineering Recommendation Box */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4 flex items-start gap-3.5">
        <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 shrink-0">
          <Wrench className="h-4 w-4 text-blue-400" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
            Prescribed Maintenance Intervention
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {recommendation}
          </p>
        </div>
      </div>

      {/* Academic Methodology Note */}
      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
        <Info className="h-3.5 w-3.5 shrink-0 text-slate-400" />
        <span>
          Damage extent is an approximate bounding-box-based geometric estimate. Bounding boxes & confidence are generated by YOLOv11.
        </span>
      </div>
    </div>
  );
}
