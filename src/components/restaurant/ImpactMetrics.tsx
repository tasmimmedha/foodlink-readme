"use client";

import { RestaurantImpactMetrics } from "@/lib/server/db";
import { motion } from "framer-motion";

interface ImpactMetricsProps {
  impact: RestaurantImpactMetrics | null;
}

const METRIC_CONFIG = [
  { key: "wastePreventedKg", label: "Waste Prevented", suffix: "kg" },
  { key: "waterSavedLiters", label: "Water Saved", suffix: "L" },
  { key: "co2PreventedKg", label: "CO₂ Prevented", suffix: "kg" },
  { key: "surplusDonationRate", label: "Donation Rate", suffix: "%" },
] as const;

export function ImpactMetrics({ impact }: ImpactMetricsProps) {
  if (!impact) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {METRIC_CONFIG.map((metric, index) => (
        <motion.div
          key={metric.key}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="rounded-3xl border border-white/60 bg-white/80 dark:bg-gray-900/70 p-4 shadow-lg"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">{metric.label}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {(impact[metric.key] as number).toLocaleString()} {metric.suffix}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

