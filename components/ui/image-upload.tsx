"use client";

import { useRef, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  aspect?: "square" | "cover";
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  folder = "empireexperts",
  label,
  aspect = "square",
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");
    setUploading(true);

    const form = new FormData();
    form.append("file", file);
    form.append("folder", folder);

    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();

    setUploading(false);

    if (!res.ok) {
      setError(data.error || "Upload failed");
      return;
    }

    onChange(data.url);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  const isCover = aspect === "cover";

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && <p className="text-sm font-medium text-slate-700">{label}</p>}

      <div
        className={cn(
          "relative border-2 border-dashed border-slate-200 rounded-xl overflow-hidden bg-slate-50 transition-colors hover:border-blue-300 cursor-pointer group",
          isCover ? "h-36 w-full" : "h-24 w-24"
        )}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {value ? (
          <>
            <img
              src={value}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("");
                }}
                className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X size={14} />
              </button>
              <span className="text-white text-xs font-medium">Change</span>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400 group-hover:text-blue-500 transition-colors">
            {uploading ? (
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <>
                {isCover ? (
                  <Upload size={20} />
                ) : (
                  <ImageIcon size={20} />
                )}
                <span className="text-xs font-medium text-center px-2">
                  {isCover ? "Upload cover image" : "Upload logo"}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}

      <p className="text-xs text-slate-400">
        JPEG, PNG, WebP · max 5 MB
        {isCover ? " · recommended 1200×400px" : " · recommended 200×200px"}
      </p>
    </div>
  );
}
