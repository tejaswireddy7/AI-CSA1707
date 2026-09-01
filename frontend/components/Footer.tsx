import Link from "next/link";
import { Cpu, ExternalLink, ShieldCheck, Code } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Academic Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white text-sm">
                AI
              </div>
              <span className="font-bold text-slate-100 text-base">
                AI-Driven Road Damage Detection
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              An Artificial Intelligence Capstone Project implementing real-time deep object detection with YOLOv11 for road pavement defect localization, classification, and mathematical severity assessment.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Authentic YOLOv11 Deep Neural Inference • Zero Mocking</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-200 text-xs tracking-wider uppercase">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/analyze" className="hover:text-blue-400 transition-colors">
                  AI Analysis Studio
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-blue-400 transition-colors">
                  Inspection History
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-blue-400 transition-colors">
                  Architecture Pipeline
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors">
                  YOLOv11 Capstone Theory
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Technical Stack */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-200 text-xs tracking-wider uppercase">
              Technology Stack
            </h4>
            <ul className="space-y-2 text-xs font-mono text-slate-400">
              <li>YOLOv11 (Ultralytics PyTorch)</li>
              <li>FastAPI + Uvicorn ASGI</li>
              <li>Next.js App Router (TypeScript)</li>
              <li>Tailwind CSS & OpenCV</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Artificial Intelligence Capstone Project. MIT License.
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors">
              <Cpu className="h-3.5 w-3.5 text-blue-400" />
              YOLOv11 Computer Vision
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
