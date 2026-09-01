"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  Activity, 
  Layers, 
  History as HistoryIcon, 
  BookOpen, 
  Cpu, 
  Menu, 
  X, 
  CheckCircle2, 
  AlertTriangle 
} from "lucide-react";
import { checkServerHealth } from "@/lib/api";
import { ServerHealth } from "@/lib/types";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [health, setHealth] = useState<ServerHealth | null>(null);

  useEffect(() => {
    let isMounted = true;
    checkServerHealth().then((data) => {
      if (isMounted) setHealth(data);
    });
    const interval = setInterval(() => {
      checkServerHealth().then((data) => {
        if (isMounted) setHealth(data);
      });
    }, 20000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const navLinks = [
    { name: "Dashboard", href: "/", icon: Activity },
    { name: "Analyze Road", href: "/analyze", icon: Layers, highlight: true },
    { name: "History", href: "/history", icon: HistoryIcon },
    { name: "How It Works", href: "/how-it-works", icon: BookOpen },
    { name: "About AI", href: "/about", icon: Cpu },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-amber-500 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-xl tracking-wider">AI</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg text-slate-100 tracking-tight">
                RoadDamage<span className="text-blue-400">AI</span>
              </span>
              <span className="hidden md:inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold text-blue-400 border border-blue-500/20">
                YOLOv11
              </span>
            </div>
            <span className="text-[10px] text-slate-400 hidden sm:block">
              Intelligent Pavement Assessment
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  link.highlight
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25 hover:from-blue-500 hover:to-indigo-500"
                    : isActive
                    ? "bg-slate-800/90 text-blue-400 border border-slate-700/60"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Icon className={`h-4 w-4 ${link.highlight ? "text-white" : isActive ? "text-blue-400" : "text-slate-400"}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Live Backend Status Pill */}
        <div className="hidden lg:flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-full bg-slate-900/90 border border-slate-800 px-3 py-1 text-xs">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                health?.status === "healthy" ? "bg-emerald-400" : "bg-amber-400"
              }`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                health?.status === "healthy" ? "bg-emerald-500" : "bg-amber-500"
              }`} />
            </span>
            <span className="text-slate-300 font-mono text-[11px]">
              {health?.status === "healthy" ? "YOLOv11 Engine Active" : "Connecting AI..."}
            </span>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium ${
                  link.highlight
                    ? "bg-blue-600 text-white font-semibold"
                    : isActive
                    ? "bg-slate-800 text-blue-400"
                    : "text-slate-300 hover:bg-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
