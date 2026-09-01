import React from "react";
import Link from "next/link";
import { 
  UploadCloud, 
  Cpu, 
  Sparkles, 
  Layers, 
  Crosshair, 
  BarChart3, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  Sliders,
  FileText
} from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      step: "01",
      icon: UploadCloud,
      title: "Pavement Image Ingestion",
      subtitle: "Client Validation & Encoding",
      description: "User submits pavement imagery (smartphone, dashcam, or drone). Client enforces MIME constraints and checks dimensions.",
      details: "Transmitted via multipart/form-data with binary stream validation.",
      color: "from-blue-600 to-cyan-500",
    },
    {
      step: "02",
      icon: Sliders,
      title: "Tensor Preprocessing",
      subtitle: "Normalization & Color Conversion",
      description: "FastAPI server decodes image via PIL and NumPy, normalizes pixel channels, and formats inputs for deep inference.",
      details: "Resolution adapted to standard 640x640 input tensor shape.",
      color: "from-cyan-500 to-indigo-600",
    },
    {
      step: "03",
      icon: Cpu,
      title: "YOLOv11 Deep Feature Extraction",
      subtitle: "C3k2 & C2PSA Attention",
      description: "State-of-the-art YOLOv11 deep neural network processes spatial features using Cross-Stage Partial attention layers.",
      details: "Runs single-stage feed-forward inference loaded in memory at startup.",
      color: "from-indigo-600 to-purple-600",
    },
    {
      step: "04",
      icon: Layers,
      title: "Multi-Class Damage Discrimination",
      subtitle: "RDD Taxonomy Mapping",
      description: "Classifies detections into 4 primary road damage types: Longitudinal Cracks, Transverse Cracks, Alligator Cracks, and Potholes.",
      details: "Evaluates raw class logits and assigns confidence probabilities.",
      color: "from-purple-600 to-pink-600",
    },
    {
      step: "05",
      icon: Crosshair,
      title: "Bounding Box Localization & NMS",
      subtitle: "IoU Suppression",
      description: "Non-Maximum Suppression (NMS) removes duplicate overlapping detections, extracting precise bounding box coordinates [x1, y1, x2, y2].",
      details: "Decoupled anchor-free regression head outputs box boundaries.",
      color: "from-pink-600 to-rose-600",
    },
    {
      step: "06",
      icon: BarChart3,
      title: "Damage Extent Estimation",
      subtitle: "Geometric Spatial Math",
      description: "Computes total distress area percentage relative to the image pixel dimensions: Area % = (Box Width × Box Height) / Image Area × 100.",
      details: "Transparent spatial heuristic distinct from semantic segmentation.",
      color: "from-rose-600 to-amber-500",
    },
    {
      step: "07",
      icon: ShieldAlert,
      title: "Calibrated Severity Assessment",
      subtitle: "4-Tier Criticality Engine",
      description: "Maps extent percentages to engineering severity tiers: No Damage (0%), Low (<10%), Moderate (10%-30%), High (>30%).",
      details: "Applies distress-specific hazard weighting (e.g. higher impact for potholes).",
      color: "from-amber-500 to-emerald-500",
    },
    {
      step: "08",
      icon: CheckCircle2,
      title: "Overall Road Condition & Report",
      subtitle: "Pavement Condition Index (PCI)",
      description: "Aggregates all detections into an overall pavement condition rating and outputs downloadable certificates.",
      details: "Conditions: No Damage, Good, Minor Damage, Moderate Damage, Severe Damage.",
      color: "from-emerald-500 to-blue-600",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-3.5 py-1 text-xs font-semibold text-blue-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>System Pipeline & Theoretical Flow</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-100 tracking-tight">
          How RoadDamageAI Works
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          An 8-stage computer vision and mathematical severity assessment pipeline designed for automated infrastructure quality control.
        </p>
      </div>

      {/* 8-Step Interactive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="relative rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between hover:border-slate-700 hover:bg-slate-900 transition-all shadow-lg group"
            >
              <div>
                {/* Step Number & Icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-black text-slate-700 group-hover:text-blue-400 transition-colors">
                    {item.step}
                  </span>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-md`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <div className="text-[11px] font-mono font-semibold text-blue-400 uppercase tracking-wider mb-1">
                  {item.subtitle}
                </div>
                <h3 className="text-base font-bold text-slate-100 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                {item.details}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pipeline Summary Diagram Box */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 sm:p-10 shadow-2xl space-y-6">
        <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Layers className="h-5 w-5 text-blue-400" />
          <span>Capstone Microservice Architecture</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          The application strictly decouples user interface rendering from deep neural inference. Next.js on Vercel acts as the presentation client, communicating over REST API to a Python FastAPI backend hosting the YOLOv11 weights in memory.
        </p>

        <div className="rounded-2xl bg-slate-950 p-6 font-mono text-xs text-blue-300 border border-slate-800/80 overflow-x-auto">
          <pre>{`User Browser (Next.js / Vercel)
      │
      ▼  POST /predict (image/jpeg)
FastAPI Backend (Python 3.11)
      │
      ├─► YOLOv11 Deep Object Detection Engine (load_model singleton)
      │       └─► Returns: Class IDs, Bounding Boxes, Confidence Scores
      │
      ├─► SeverityEstimator (Geometric Extent Ratio Math)
      │       └─► Returns: Area Percentage, 4-Tier Severity Level
      │
      └─► RoadConditionAnalyzer (Pavement Serviceability Index)
              └─► Returns: Overall Road Condition & Maintenance Directive`}</pre>
        </div>

        <div className="flex justify-center pt-4">
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-xl shadow-blue-600/30 text-sm"
          >
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>Try The Live AI Pipeline</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
