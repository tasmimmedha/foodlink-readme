"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash2 } from "lucide-react";

interface ItemImageUploaderProps {
  value?: string;
  onChange?: (value?: string) => void;
  label?: string;
}

export function ItemImageUploader({ value, onChange, label = "Upload image" }: ItemImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setLoading(false);
      onChange?.(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      {value ? (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Item preview" className="h-40 w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-3 bg-slate-900/50 opacity-0 transition hover:opacity-100">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full bg-white/90"
            >
              <ImagePlus className="mr-2 h-4 w-4" />
              Replace
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="rounded-full"
              onClick={() => onChange?.(undefined)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex h-40 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500 transition hover:border-emerald-300 hover:text-emerald-600"
        >
          {loading ? "Processing..." : "Drop image or click to upload"}
        </button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

