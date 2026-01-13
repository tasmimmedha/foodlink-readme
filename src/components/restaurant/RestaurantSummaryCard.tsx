"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/helpers";

interface RestaurantSummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  accent?: string;
}

export function RestaurantSummaryCard({
  title,
  value,
  subtitle,
  icon,
  accent = "from-emerald-500/80 to-teal-500/80",
}: RestaurantSummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 dark:bg-gray-900/70 shadow-xl shadow-emerald-100/50 dark:shadow-emerald-900/40 hover:shadow-2xl transition-shadow cursor-pointer group"
    >
      <div className={cn("absolute inset-0 blur-3xl opacity-30 bg-gradient-to-br group-hover:opacity-40 transition-opacity", accent)} />
      <div className="relative p-6 flex items-start gap-4">
        <motion.div
          whileHover={{ rotate: 5, scale: 1.1 }}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 dark:bg-gray-800/90 text-emerald-600 shadow-lg group-hover:shadow-xl transition-shadow"
        >
          {icon}
        </motion.div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium">{title}</p>
          <motion.p
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold text-gray-900 dark:text-white mt-2 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
          >
            {value}
          </motion.p>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-2 font-medium">{subtitle}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

