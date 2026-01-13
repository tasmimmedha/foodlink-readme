"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Star } from "lucide-react";
import { cn } from "@/lib/helpers";

interface XPProgressBarProps {
  totalXP: number;
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  className?: string;
}

export function XPProgressBar({
  totalXP,
  level,
  currentLevelXP,
  nextLevelXP,
  className,
}: XPProgressBarProps) {
  const progress = (currentLevelXP / nextLevelXP) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={cn(
        "bg-gradient-to-br from-amber-50/80 via-yellow-50/60 to-orange-50/80 dark:from-amber-950/40 dark:via-yellow-950/30 dark:to-orange-950/40 border-2 border-amber-200/60 dark:border-amber-800/40 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl",
        className
      )}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full blur-md opacity-60 animate-pulse" />
                <div className="relative bg-gradient-to-br from-[#FFD700] to-[#FFA500] p-3 rounded-xl shadow-lg">
                  <Trophy className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
                  Level {level}
                </div>
                <div className="text-3xl font-extrabold bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FF8C00] bg-clip-text text-transparent">
                  {totalXP.toLocaleString()} XP
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-amber-100/80 to-yellow-100/80 dark:from-amber-900/40 dark:to-yellow-900/40 rounded-xl border border-amber-200/60 dark:border-amber-800/40">
              <Star className="h-5 w-5 text-[#FFD700] fill-[#FFD700]" />
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{level}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-lg">
                {currentLevelXP} / {nextLevelXP} XP
              </span>
              <span className="text-base font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-lg">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="relative h-4 bg-gray-200/60 dark:bg-gray-800/60 rounded-full overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FF8C00] rounded-full relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

