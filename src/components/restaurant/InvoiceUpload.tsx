"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";

interface InvoiceUploadProps {
  onUpload: (payload: { fileName: string; data: string }) => void;
}

export function InvoiceUpload({ onUpload }: InvoiceUploadProps) {
  const [status, setStatus] = useState<string>();

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      onUpload({ fileName: file.name, data });
      setStatus(`Uploaded ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  return (
    <motion.label
      whileHover={{ scale: 1.01 }}
      className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-emerald-200/70 bg-white/70 px-6 py-8 text-center shadow-inner"
    >
      <Upload className="h-8 w-8 text-emerald-500 mb-3" />
      <p className="font-semibold text-gray-900">Upload Invoice</p>
      <p className="text-xs text-muted-foreground">PDF or image files are supported</p>
      <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleFile} />
      {status && <p className="mt-3 text-xs text-emerald-600">{status}</p>}
    </motion.label>
  );
}

