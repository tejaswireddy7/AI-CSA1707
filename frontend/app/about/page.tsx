import React from "react";
import Link from "next/link";
import { 
  Cpu, 
  BookOpen, 
  HelpCircle, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  BarChart3, 
  Crosshair,
  ArrowRight
} from "lucide-react";

export default function AboutAiPage() {
  const topics = [
    {
      title: "What is YOLO?",
      badge: "You Only Look Once",
      content:
        "YOLO is a groundbreaking single-stage convolutional object detection framework originally introduced by Joseph Redmon et al. Unlike multi-stage detectors (e.g. Faster R-CNN) that perform region proposals before classification, YOLO frames object detection as a single regression problem—predicting bounding box coordinates and class probabilities directly from full images in a single forward pass.",
    },
    {
      title: "What is YOLOv11?",
      badge: "State of the Art (2024+)",
      content:
        "YOLOv11 is the latest evolutionary milestone in the Ultralytics YOLO series. It incorporates architectural innovations including C3k2 feature extraction blocks, SPPF (Spatial Pyramid Pooling - Fast), and C2PSA (Cross-Stage Partial Self-Attention) mechanisms. This allows YOLOv11 to capture fine asphalt fissures and long-range spatial context with fewer parameters and significantly higher throughput than previous architectures.",
    },
    {
      title: "What is Object Detection?",
      badge: "Localization + Classification",
      content:
        "Object detection goes beyond whole-image classification (which only answers 'what is in this image?') by answering both 'what is in this image?' and 'where is it located?'. For road distress inspection, this enables the system to simultaneously pinpoint multiple cracks and potholes at precise pixel coordinates across a single frame.",
    },
    {
      title: "What is Transfer Learning?",
      badge: "Pretrained Feature Reuse",
      content:
        "Transfer learning leverages neural network weights previously trained on massive visual benchmarks (such as MS COCO with 80 classes) and fine-tunes the network on specialized domain datasets like the Road Damage Dataset (RDD2020 / RDD2022). The network reuses fundamental low-level edge and texture detectors, requiring far fewer domain images to achieve high generalization.",
    },
    {
      title: "What is a Bounding Box?",
      badge: "Spatial Coordinates [x1, y1, x2, y2]",
      content:
        "A bounding box is a rectangular perimeter defined by four coordinates [x1, y1, x2, y2] that tightly envelops a detected road distress. The width (x2 - x1) and height (y2 - y1) define the geometric extent of the anomaly within the camera field of view.",
    },
    {
      title: "What is a Confidence Score?",
      badge: "Bayesian Probability [0.0 - 1.0]",
      content:
        "The confidence score reflects the model's certainty that a bounding box encloses a valid distress object and belongs to a specific class. A confidence of 0.942 signifies a 94.2% model certainty, allowing practitioners to filter out low-confidence noise.",
    },
    {
      title: "How is Road Damage Severity Estimated?",
      badge: "Mathematical Extent Ratio",
      content:
        "Rather than falsely claiming that generic YOLO directly classifies depth or structural severity, our system computes severity mathematically using the ratio of detected bounding box area to total image resolution: Extent % = (Box Area / Image Area) * 100. This is calibrated into 4 engineering tiers: No Damage (0%), Low (<10%), Moderate (10%-30%), and High (>30%).",
    },
    {
      title: "Why Decouple Frontend & Backend?",
      badge: "Production Microservices",
      content:
        "Deep learning frameworks (PyTorch, Ultralytics, CUDA) require native C++ binaries and large memory allocations incompatible with lightweight edge JavaScript runtimes like Vercel. Decoupling the Next.js UI from a FastAPI Python server ensures horizontal scaling, fast cold starts, and production stability.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-3.5 py-1 text-xs font-semibold text-blue-400">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Capstone Academic Documentation</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-100 tracking-tight">
          About AI & Computer Vision Foundations
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          Comprehensive theoretical reference explaining the neural architecture, deep learning paradigms, and mathematical formulations powering this capstone project.
        </p>
      </div>

      {/* Academic Distinction Alert */}
      <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-6 flex items-start gap-4 shadow-lg">
        <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div className="space-y-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <h4 className="font-bold text-slate-100 text-sm sm:text-base">
            Academic Integrity & Algorithmic Rigor
          </h4>
          <p>
            In academic machine learning, it is critical to separate <strong>object detection</strong> (which YOLOv11 performs) from <strong>severity classification</strong>. Ordinary YOLO detects bounding boxes, class labels, and confidence. Our application calculates severity mathematically via geometric distress extent ratios and transparent domain impact weightings.
          </p>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topics.map((t, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3 hover:border-slate-700 transition-colors shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-semibold text-blue-400 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                {t.badge}
              </span>
              <span className="font-mono text-xs text-slate-600">
                Topic {idx + 1}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-100">
              {t.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t.content}
            </p>
          </div>
        ))}
      </div>

      {/* Link to Model Telemetry */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-xl font-bold text-slate-100">
            Inspect Active YOLOv11 Model Metadata
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            View live weights configuration, class dictionary, and evaluation benchmark telemetry from the running FastAPI backend.
          </p>
        </div>
        <Link
          href="/model-info"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-lg shadow-blue-600/20 text-xs sm:text-sm shrink-0"
        >
          <Cpu className="h-4 w-4" />
          <span>View Model Telemetry</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
