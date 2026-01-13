"use client";

import { motion } from "framer-motion";

interface WasteRiskGaugeProps {
  score: number; // 0-100
  label?: string;
}

export function WasteRiskGauge({ score, label = "Waste Risk" }: WasteRiskGaugeProps) {
  const normalized = Math.min(100, Math.max(0, score));
  const color =
    normalized > 70 ? "text-rose-500" : normalized > 40 ? "text-amber-500" : "text-emerald-500";
  const bgColor =
    normalized > 70 ? "bg-rose-50" : normalized > 40 ? "bg-amber-50" : "bg-emerald-50";
  const borderColor =
    normalized > 70 ? "border-rose-200" : normalized > 40 ? "border-amber-200" : "border-emerald-200";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`relative flex flex-col items-center justify-center rounded-3xl border ${borderColor} ${bgColor} dark:bg-gray-900/80 p-8 shadow-xl shadow-emerald-100/50 hover:shadow-2xl transition-shadow`}
    >
      <svg width={160} height={160} className="-rotate-90">
        <circle
          cx="80"
          cy="80"
          r="68"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth="14"
          fill="transparent"
        />
        <motion.circle
          cx="80"
          cy="80"
          r="68"
          stroke="url(#riskGradient)"
          strokeWidth="14"
          fill="transparent"
          strokeLinecap="round"
          initial={{ strokeDasharray: 0, strokeDashoffset: 0 }}
          animate={{ strokeDasharray: `${normalized * 4.27} ${427}` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground font-semibold mb-2">{label}</p>
        <motion.p
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          className={`text-5xl font-bold ${color} mb-1`}
        >
          {normalized.toFixed(0)}%
        </motion.p>
        <p className="text-xs text-muted-foreground font-medium">Lower is better</p>
      </div>
    </motion.div>
  );
}

