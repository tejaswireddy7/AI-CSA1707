import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "AI-Driven Road Damage Detection & Severity Assessment (YOLOv11)",
  description:
    "An Artificial Intelligence Capstone Project implementing deep object detection using YOLOv11 for road defect classification, spatial localization, geometric extent estimation, and calibrated severity assessment.",
  keywords: [
    "Road Damage Detection",
    "YOLOv11",
    "Pavement Inspection",
    "Object Detection",
    "Pothole Detection",
    "Crack Detection",
    "Computer Vision",
    "FastAPI",
    "Next.js"
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col selection:bg-blue-600 selection:text-white`}
      >
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-600/10 via-indigo-600/5 to-transparent blur-3xl opacity-60" />
          <div className="absolute -top-40 right-0 w-96 h-96 bg-amber-500/5 blur-3xl rounded-full" />
        </div>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
