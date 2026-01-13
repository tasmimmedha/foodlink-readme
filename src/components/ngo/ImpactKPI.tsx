"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/helpers";

interface ImpactKPIProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon?: LucideIcon;
  tone?: "emerald" | "amber" | "indigo" | "rose";
  trend?: { value: string; direction: "up" | "down" };
}

const toneMap: Record<NonNullable<ImpactKPIProps["tone"]>, string> = {
  emerald: "from-emerald-400 to-lime-400",
  amber: "from-amber-400 to-orange-400",
  indigo: "from-indigo-400 to-cyan-400",
  rose: "from-rose-400 to-pink-400",
};

export function ImpactKPI({ label, value, sublabel, icon: Icon, tone = "emerald", trend }: ImpactKPIProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-3xl border border-slate-100 bg-white/90 p-4 shadow-lg shadow-slate-100/60 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-black/30"
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={cn("rounded-2xl p-3 text-white shadow-lg", `bg-gradient-to-br ${toneMap[tone]}`)}>
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
          <p className="text-2xl font-semibold text-slate-900 dark:text-white">{value}</p>
          {sublabel && <p className="text-xs text-slate-400">{sublabel}</p>}
        </div>
      </div>
      {trend && (
        <div
          className={cn(
            "mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
            trend.direction === "up" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          )}
        >
          {trend.value}
          <span className="text-slate-400">vs last month</span>
        </div>
      )}
    </motion.div>
  );
}


