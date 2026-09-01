"use client";

import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import { UploadCloud, Image as ImageIcon, AlertCircle, FileText, Check } from "lucide-react";

interface ImageUploaderProps {
  onImageSelected: (file: File, previewUrl: string, dimensions: { width: number; height: number }) => void;
  disabled?: boolean;
}

export default function ImageUploader({ onImageSelected, disabled = false }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  const maxSizeBytes = 20 * 1024 * 1024; // 20 MB

  const validateAndProcessFile = (file: File) => {
    setErrorMessage(null);

    // Type validation
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage("Unsupported file type. Please upload a JPG, JPEG, or PNG image.");
      return;
    }

    // Size validation
    if (file.size > maxSizeBytes) {
      setErrorMessage(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed is 20MB.`);
      return;
    }

    // Read preview and dimensions
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        onImageSelected(file, dataUrl, {
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.onerror = () => {
        setErrorMessage("Corrupt or unreadable image file.");
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer ${
          isDragging
            ? "border-blue-500 bg-blue-500/10 scale-[1.008]"
            : "border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleFileInputChange}
          disabled={disabled}
          className="hidden"
        />

        {/* Pulsing Icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/10 border border-blue-500/30 text-blue-400 mb-4 shadow-lg shadow-blue-500/10">
          <UploadCloud className="h-8 w-8" />
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-100">
          Upload Road Pavement Image
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-sm">
          Drag and drop your road photo here, or click to browse files from your device.
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-md bg-slate-800/90 border border-slate-700/60 px-2.5 py-1 text-[11px] font-mono text-slate-300">
            JPG, JPEG, PNG, WEBP
          </span>
          <span className="rounded-md bg-slate-800/90 border border-slate-700/60 px-2.5 py-1 text-[11px] font-mono text-slate-300">
            Max 20MB
          </span>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3.5 flex items-center gap-3 text-xs text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
