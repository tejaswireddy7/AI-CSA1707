import React from "react";

interface SeverityBadgeProps {
  severity: "No Damage" | "Low" | "Moderate" | "High" | string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function SeverityBadge({
  severity,
  size = "md",
  showLabel = false,
}: SeverityBadgeProps) {
  const normalized = severity?.toLowerCase() || "low";

  let colorClasses = "bg-slate-800 text-slate-300 border-slate-700";
  let dotColor = "bg-slate-400";

  if (normalized.includes("no damage") || normalized.includes("good")) {
    colorClasses = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    dotColor = "bg-emerald-400";
  } else if (normalized.includes("low") || normalized.includes("minor")) {
    colorClasses = "bg-blue-500/10 text-blue-400 border-blue-500/30";
    dotColor = "bg-blue-400";
  } else if (normalized.includes("moderate")) {
    colorClasses = "bg-amber-500/15 text-amber-400 border-amber-500/30";
    dotColor = "bg-amber-400";
  } else if (normalized.includes("high") || normalized.includes("severe") || normalized.includes("critical")) {
    colorClasses = "bg-red-500/15 text-red-400 border-red-500/30";
    dotColor = "bg-red-400";
  }

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3.5 py-1.5 text-sm font-semibold",
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${colorClasses} ${sizeClasses}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      <span>{showLabel ? `Estimated Severity: ${severity}` : severity}</span>
    </span>
  );
}
