"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/helpers";

interface KPIBlockProps {
  label: string;
  value: string | number;
  helper?: string;
  icon?: LucideIcon;
  tone?: "emerald" | "indigo" | "amber";
}

const TONES: Record<NonNullable<KPIBlockProps["tone"]>, string> = {
  emerald: "text-emerald-600 bg-emerald-50",
  indigo: "text-indigo-600 bg-indigo-50",
  amber: "text-amber-600 bg-amber-50",
};

export function KPIBlock({ label, value, helper, icon: Icon, tone = "emerald" }: KPIBlockProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="rounded-3xl border border-slate-100 bg-white/95 p-4 shadow-lg shadow-slate-200/70"
    >
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <div className="mt-2 flex items-center gap-3">
          {Icon && (
            <span className={cn("rounded-2xl p-2", TONES[tone])}>
              <Icon className="h-4 w-4" />
            </span>
          )}
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
      </div>
      {helper && <p className="text-xs text-slate-500">{helper}</p>}
    </motion.div>
  );
}

