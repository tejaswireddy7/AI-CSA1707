"use client";

import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  BarChart3, 
  Search, 
  FileCheck2, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Box,
  Compass
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: Cpu,
      title: "AI Detection",
      badge: "YOLOv11 Deep Neural Net",
      description: "State-of-the-art single-stage convolutional vision with C3k2 feature extraction and C2PSA spatial self-attention.",
      color: "from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400"
    },
    {
      icon: Layers,
      title: "Damage Classification",
      badge: "4 Primary Distress Classes",
      description: "Automated discrimination between Longitudinal Cracks, Transverse Cracks, Alligator Fatigue Cracking, and Potholes.",
      color: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400"
    },
    {
      icon: BarChart3,
      title: "Severity Assessment",
      badge: "Mathematical Extent Ratio",
      description: "Calibrated geometric bounding-box area percentage computation relative to road dimensions (No Damage, Low, Moderate, High).",
      color: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400"
    },
    {
      icon: Box,
      title: "Visual Analysis",
      badge: "Bounding Boxes & Confidence",
      description: "Real-time overlay with color-coded bounding coordinates, class labels, and authentic YOLOv11 confidence ratings.",
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400"
    }
  ];

  const distressClasses = [
    {
      id: "D00",
      name: "Longitudinal Crack",
      risk: "Early Structural Warning",
      color: "bg-blue-500/10 border-blue-500/30 text-blue-300",
      desc: "Cracks running parallel to lane direction caused by pavement joint fatigue."
    },
    {
      id: "D10",
      name: "Transverse Crack",
      risk: "Thermal Contraction",
      color: "bg-purple-500/10 border-purple-500/30 text-purple-300",
      desc: "Cracks perpendicular to roadway centerline caused by temperature fluctuations."
    },
    {
      id: "D20",
      name: "Alligator Crack",
      risk: "Subgrade Fatigue Failure",
      color: "bg-amber-500/10 border-amber-500/30 text-amber-300",
      desc: "Interconnected multi-sided pattern signaling base layer load failure."
    },
    {
      id: "D40",
      name: "Pothole",
      risk: "Critical Roadway Hazard",
      color: "bg-red-500/10 border-red-500/30 text-red-300",
      desc: "Bowl-shaped pavement cavity presenting extreme danger to vehicles."
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-8 sm:pt-20 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Top Capstone Pill */}
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/90 border border-blue-500/30 px-4 py-1.5 text-xs font-semibold text-blue-300 mb-8 shadow-lg shadow-blue-500/10 animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-ping" />
          <span>AI Capstone Project • YOLOv11 Computer Vision</span>
        </div>

        {/* Hero Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-100 tracking-tight max-w-5xl mx-auto leading-[1.1]">
          AI-Driven Road Damage Detection &{" "}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
            Severity Assessment
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          Intelligent computer vision for automated road-condition analysis. Powered by genuine YOLOv11 deep object detection and mathematical extent estimation.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/analyze"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 font-bold text-white shadow-xl shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition-all text-base"
          >
            <Sparkles className="h-5 w-5 text-amber-300" />
            <span>Analyze Road</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>

          <Link
            href="/how-it-works"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-slate-900/90 border border-slate-800 font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-all text-base"
          >
            <Compass className="h-5 w-5 text-slate-400" />
            <span>How It Works</span>
          </Link>
        </div>

        {/* Quick Trust Highlights */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <span className="text-xs text-slate-300 font-medium">Real YOLOv11 Weights</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <span className="text-xs text-slate-300 font-medium">4 Distress Classes</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <span className="text-xs text-slate-300 font-medium">Calibrated Severity</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <span className="text-xs text-slate-300 font-medium">Downloadable Reports</span>
          </div>
        </div>
      </section>

      {/* 2. Core Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <div className="text-xs font-bold text-blue-400 tracking-wider uppercase">
            Engineering Capabilities
          </div>
          <h2 className="text-3xl font-extrabold text-slate-100 sm:text-4xl">
            Complete Pavement Intelligence Suite
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            From image upload to actionable maintenance recommendations, every phase utilizes rigorous algorithmic workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 hover:bg-slate-900 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feat.color} border mb-5 shadow-md`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mb-1">
                    {feat.badge}
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Supported Distress Classes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-8 sm:p-12 shadow-2xl">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              RDD Benchmark Standards
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100 mt-1">
              Supported Road Distress Classes
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Our YOLOv11 model is structured around standardized international pavement distress taxonomy (Road Damage Dataset RDD2020 / RDD2022).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {distressClasses.map((cls, idx) => (
              <div
                key={idx}
                className={`rounded-2xl border p-5 ${cls.color} space-y-3`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800">
                    {cls.id}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {cls.risk}
                  </span>
                </div>
                <h4 className="font-bold text-slate-100 text-base">
                  {cls.name}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {cls.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Live Quick Analysis CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-900/50 to-slate-900 border border-blue-500/30 p-10 sm:p-16 shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 border border-blue-400/30 px-3 py-1 text-xs font-semibold text-blue-300">
              <Zap className="h-3.5 w-3.5 text-amber-300" />
              <span>Real-Time Inference Available</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Ready to Inspect Pavement Distress?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Upload any road surface photo to perform live YOLOv11 detection, measure damage extent, and view the automated severity report.
            </p>
            <div className="pt-4">
              <Link
                href="/analyze"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-xl shadow-blue-600/30 text-base hover:scale-105 transition-all"
              >
                <Sparkles className="h-5 w-5 text-amber-300" />
                <span>Launch Analysis Studio</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
