"use client";

import { SectionCard } from "@/components/shared/section-card";
import { useEnvironmentalImpact } from "@/hooks/use-query-family";
import { AnimatedCounter } from "@/components/landing/AnimatedCounter";
import { RadialProgress } from "@/components/landing/RadialProgress";
import { Leaf, Droplets, Wind } from "lucide-react";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import { motion } from "framer-motion";

export function EnvironmentalImpact() {
  const { data, isLoading } = useEnvironmentalImpact();

  if (isLoading) {
    return (
      <SectionCard title="Environmental Impact">
        <SkeletonLoader variant="card" count={3} />
      </SectionCard>
    );
  }

  const impact = data || {
    co2Prevented: 0,
    wasteReduced: 0,
    waterSaved: 0,
    xpPoints: 0,
    level: 1,
    xpProgress: 0,
  };

  return (
    <SectionCard
      title="Environmental Impact"
      description="Your contribution to a sustainable future"
    >
      <div className="space-y-4">
        {/* Impact Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="p-4 bg-[#f9fafb] rounded-lg border border-green-200/50 text-center"
          >
            <Wind className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-900">
              <AnimatedCounter value={impact.co2Prevented} suffix=" kg" />
            </div>
            <div className="text-xs text-green-700 mt-1">CO₂ Prevented</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="p-4 bg-[#f9fafb] rounded-lg border border-blue-200/50 text-center"
          >
            <Leaf className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-900">
              <AnimatedCounter value={impact.wasteReduced} suffix=" kg" />
            </div>
            <div className="text-xs text-blue-700 mt-1">Waste Reduced</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="p-4 bg-[#f9fafb] rounded-lg border border-cyan-200/50 text-center"
          >
            <Droplets className="h-8 w-8 text-cyan-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-cyan-900">
              <AnimatedCounter value={impact.waterSaved} suffix=" L" />
            </div>
            <div className="text-xs text-cyan-700 mt-1">Water Saved</div>
          </motion.div>
        </div>

        {/* XP Progress Ring */}
        <div className="flex flex-col items-center justify-center py-2">
          <RadialProgress
            value={impact.xpProgress}
            max={100}
            size={140}
            label=""
            gradient="gold"
          />
          <div className="mt-3 text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-[#22c55e] to-[#16a34a] bg-clip-text text-transparent">
              Level {impact.level}
            </div>
            <div className="text-sm text-muted-foreground mt-0.5">
              <AnimatedCounter value={impact.xpPoints} /> XP Points
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {impact.xpProgress}% to next level
            </div>
          </div>
        </div>

        {/* Achievement Summary */}
        <div className="p-3 bg-gradient-to-r from-[#22c55e]/10 to-[#16a34a]/10 rounded-lg border border-[#22c55e]/20">
          <div className="text-sm font-medium text-center text-green-900">
            🌱 You're making a real difference!
          </div>
          <div className="text-xs text-center text-green-700 mt-0.5">
            Keep reducing waste to unlock more achievements
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

