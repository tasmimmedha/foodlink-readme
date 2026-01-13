"use client";

import { cn } from "@/lib/helpers";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface TrendProps {
  value: string;
  direction: "up" | "down";
  label?: string;
}

interface NGODashboardCardProps {
  title: string;
  value: string;
  sublabel?: string;
  icon?: LucideIcon;
  accent?: string;
  trend?: TrendProps;
  progress?: number; // 0-1
  footer?: React.ReactNode;
  className?: string;
}

export function NGODashboardCard({
  title,
  value,
  sublabel,
  icon: Icon,
  accent = "from-emerald-400 via-lime-300 to-emerald-500",
  trend,
  progress,
  footer,
  className,
}: NGODashboardCardProps) {
  const displayProgress = typeof progress === "number";

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-white/90 via-white/70 to-white/40 p-5 shadow-lg shadow-emerald-100/60 backdrop-blur-xl dark:border-emerald-900/40 dark:from-emerald-950/40 dark:via-slate-900/60 dark:to-slate-900",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-300">
            {title}
          </p>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-4xl font-bold text-slate-900 dark:text-white">{value}</span>
            {sublabel && <span className="text-sm text-slate-500 dark:text-slate-300">{sublabel}</span>}
          </div>
        </div>
        {Icon && (
          <div
            className={cn(
              "rounded-2xl p-3 text-white shadow-lg shadow-emerald-200/60 dark:shadow-emerald-900/50",
              "bg-gradient-to-br",
              accent
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>

      {trend && (
        <div
          className={cn(
            "mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
            trend.direction === "up"
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"
              : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300"
          )}
        >
          <span
            className={cn(
              "inline-flex h-2 w-2 rounded-full",
              trend.direction === "up" ? "bg-emerald-500" : "bg-rose-500"
            )}
          />
          <span>{trend.value}</span>
          {trend.label && <span className="text-slate-500 dark:text-slate-300">{trend.label}</span>}
        </div>
      )}

      {displayProgress && (
        <div className="mt-4 flex items-center gap-4">
          <div className="relative h-16 w-16">
            <svg className="h-full w-full" viewBox="0 0 36 36">
              <path
                className="text-slate-200 dark:text-slate-700"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: Math.min(Math.max(progress ?? 0, 0), 1) }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-emerald-500"
                strokeWidth="3.5"
                stroke="url(#gradient)"
                fill="none"
                strokeLinecap="round"
                d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#a3e635" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {Math.round((progress ?? 0) * 100)}%
              </span>
            </div>
          </div>
          <div className="flex-1">
            <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(Math.max(progress ?? 0, 0), 1) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-3 rounded-full bg-gradient-to-r from-emerald-400 to-lime-400 shadow-inner shadow-emerald-200/50"
              />
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-300">Capacity utilization</p>
          </div>
        </div>
      )}

      {footer && <div className="mt-4 text-sm text-slate-500 dark:text-slate-300">{footer}</div>}
    </motion.div>
  );
}


