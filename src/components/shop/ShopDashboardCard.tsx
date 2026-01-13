"use client";

import { cn } from "@/lib/helpers";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

export interface ShopDashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    label: string;
    value: string;
    direction: "up" | "down";
  };
  accent?: string;
  className?: string;
}

export function ShopDashboardCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accent = "from-emerald-400 via-lime-300 to-emerald-500",
  className,
}: ShopDashboardCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/70 bg-white/95 p-5 shadow-[0_10px_40px_rgba(15,118,110,0.12)] backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/80",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{value}</p>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
        {Icon && (
          <div
            className={cn(
              "rounded-2xl p-3 text-white shadow-lg shadow-emerald-200/70 dark:shadow-emerald-900/50",
              "bg-gradient-to-br",
              accent
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      {trend && (
        <div
          className={cn(
            "mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
            trend.direction === "up"
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"
              : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-200"
          )}
        >
          <span className="inline-flex h-2 w-2 rounded-full bg-current" />
          <span>{trend.value}</span>
          <span className="text-slate-400">{trend.label}</span>
        </div>
      )}
    </motion.div>
  );
}

