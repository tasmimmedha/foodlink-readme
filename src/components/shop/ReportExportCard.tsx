"use client";

import { Button } from "@/components/ui/button";
import { FileDown, Printer } from "lucide-react";
import { motion } from "framer-motion";

interface ReportExportCardProps {
  title: string;
  description: string;
  onDownload?: () => void;
  onPrint?: () => void;
}

export function ReportExportCard({
  title,
  description,
  onDownload,
  onPrint,
}: ReportExportCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-3xl border border-slate-100 bg-white/95 p-5 shadow-lg shadow-slate-200/60"
    >
      <p className="text-base font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="outline" className="rounded-full" onClick={onPrint}>
          <Printer className="mr-2 h-4 w-4" />
          Printable view
        </Button>
        <Button className="rounded-full" onClick={onDownload}>
          <FileDown className="mr-2 h-4 w-4" />
          Download CSV
        </Button>
      </div>
    </motion.div>
  );
}

