"use client";

import { useMemo } from "react";
import { SectionCard } from "@/components/shared/section-card";
import { useWasteAnalytics } from "@/hooks/use-query-family";
import { AnimatedCounter } from "@/components/landing/AnimatedCounter";
import { RadialProgress } from "@/components/landing/RadialProgress";
import { TrendingUp, TrendingDown, Leaf } from "lucide-react";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import { motion } from "framer-motion";

export function WasteAnalytics() {
  const { data, isLoading } = useWasteAnalytics();

  // All hooks must be called before any early returns
  const analytics = useMemo(() => data || {
    wastePrevented: 0,
    leftoverUsage: 0,
    monthlyFoodUsageScore: 0,
    wasteLogs: [],
    monthlyTrend: [],
  }, [data]);

  const trendData = useMemo(() => {
    if (!analytics.monthlyTrend.length) return [];
    const maxUsage = Math.max(...analytics.monthlyTrend.map((m) => m.usage));
    return analytics.monthlyTrend.slice(-6).map((month) => ({
      ...month,
      usagePercentage: maxUsage > 0 ? (month.usage / maxUsage) * 100 : 0,
      wastePercentage: maxUsage > 0 ? (month.waste / maxUsage) * 100 : 0,
    }));
  }, [analytics.monthlyTrend]);

  if (isLoading) {
    return (
      <SectionCard title="Waste Analytics">
        <SkeletonLoader variant="card" count={2} />
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Waste Analytics"
      description="Track your food waste reduction and usage patterns"
    >
      <div className="space-y-3">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 bg-gradient-to-br from-emerald-50/80 to-green-50/60 dark:from-emerald-950/30 dark:to-green-950/20 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                <Leaf className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
              <AnimatedCounter value={analytics.wastePrevented} suffix=" kg" />
            </div>
            <div className="text-xs font-medium text-emerald-700 dark:text-emerald-300 mt-1 uppercase tracking-wide">Waste Prevented</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 bg-gradient-to-br from-blue-50/80 to-cyan-50/60 dark:from-blue-950/30 dark:to-cyan-950/20 rounded-xl border border-blue-200/60 dark:border-blue-800/40 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
            </div>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              <AnimatedCounter value={analytics.leftoverUsage} suffix="%" />
            </div>
            <div className="text-xs font-medium text-blue-700 dark:text-blue-300 mt-1 uppercase tracking-wide">Leftover Usage</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 bg-gradient-to-br from-purple-50/80 to-violet-50/60 dark:from-purple-950/30 dark:to-violet-950/20 rounded-xl border border-purple-200/60 dark:border-purple-800/40 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
            </div>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              <AnimatedCounter value={analytics.monthlyFoodUsageScore} suffix="/100" />
            </div>
            <div className="text-xs font-medium text-purple-700 dark:text-purple-300 mt-1 uppercase tracking-wide">Usage Score</div>
          </motion.div>
        </div>

        {/* Usage Score Progress */}
        <div className="flex items-center justify-center py-1">
          <div className="text-center">
            <RadialProgress
              value={analytics.monthlyFoodUsageScore}
              max={100}
              size={120}
              label="Score"
              gradient="primary"
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              Monthly Food Usage Score
            </p>
          </div>
        </div>

        {/* Monthly Trend Chart */}
        {trendData.length > 0 && (
          <div className="pt-2">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
              Monthly Trend
            </h4>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-gradient-to-r from-emerald-500 to-green-500"></div>
                  <span className="text-muted-foreground">Used</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-gradient-to-r from-red-500 to-rose-500"></div>
                  <span className="text-muted-foreground">Wasted</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {trendData.map((month, index) => {
                const total = month.usage + month.waste;
                const usagePercent = total > 0 ? (month.usage / total) * 100 : 0;
                const wastePercent = total > 0 ? (month.waste / total) * 100 : 0;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      {/* Month Label */}
                      <div className="w-20 flex-shrink-0">
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {month.month}
                      </span>
                    </div>
                      
                      {/* Progress Bar */}
                      <div className="flex-1 min-w-0">
                        <div className="flex gap-0.5 h-6 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-inner">
                          {usagePercent > 0 && (
                      <motion.div
                              className="bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 rounded-l-lg relative overflow-hidden group-hover:brightness-110 transition-all"
                        initial={{ width: 0 }}
                              animate={{ width: `${usagePercent}%` }}
                              transition={{ duration: 0.6, delay: index * 0.05, ease: "easeOut" }}
                            >
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                animate={{ x: ["-100%", "100%"] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: index * 0.1 }}
                      />
                            </motion.div>
                          )}
                          {wastePercent > 0 && (
                      <motion.div
                              className="bg-gradient-to-r from-red-500 via-rose-500 to-red-600 rounded-r-lg relative overflow-hidden group-hover:brightness-110 transition-all"
                        initial={{ width: 0 }}
                              animate={{ width: `${wastePercent}%` }}
                              transition={{ duration: 0.6, delay: index * 0.05 + 0.1, ease: "easeOut" }}
                            >
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                animate={{ x: ["-100%", "100%"] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: index * 0.1 + 0.5 }}
                      />
                            </motion.div>
                          )}
                        </div>
                      </div>
                      
                      {/* Values */}
                      <div className="w-full sm:w-auto sm:flex-shrink-0 sm:text-right">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:justify-end">
                          <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                            {month.usage.toFixed(1)}kg
                          </span>
                          <span className="text-muted-foreground">used</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="font-semibold text-red-700 dark:text-red-400">
                            {month.waste.toFixed(1)}kg
                          </span>
                          <span className="text-muted-foreground">wasted</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}

