"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/helpers";

interface WasteRiskBadgeProps {
  level: "low" | "medium" | "high";
}

export function WasteRiskBadge({ level }: WasteRiskBadgeProps) {
  const variants = {
    low: { text: "text-emerald-600", bg: "bg-emerald-50" },
    medium: { text: "text-amber-600", bg: "bg-amber-50" },
    high: { text: "text-rose-600", bg: "bg-rose-50" },
  }[level];

  return (
    <motion.span
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      className={cn(
        "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest",
        variants.bg,
        variants.text
      )}
    >
      {level} risk
    </motion.span>
  );
}

