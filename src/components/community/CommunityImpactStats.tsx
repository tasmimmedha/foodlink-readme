"use client";

import { motion } from "framer-motion";
import { CommunityImpact } from "@/lib/server/db";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Droplets, Trophy, HeartHandshake } from "lucide-react";

interface CommunityImpactStatsProps {
  impact: CommunityImpact | null;
}

const ICON_MAP = {
  surplus: Leaf,
  water: Droplets,
  co2: Trophy,
  meals: HeartHandshake,
};

export function CommunityImpactStats({ impact }: CommunityImpactStatsProps) {
  if (!impact) return null;

  const stats = [
    {
      label: "Total surplus shared",
      value: `${impact.totalSurplusKg} kg`,
      change: "+12% vs last week",
      icon: ICON_MAP.surplus,
    },
    {
      label: "Water saved",
      value: `${impact.waterSavedLiters.toLocaleString()} L`,
      change: "+6% efficiency",
      icon: ICON_MAP.water,
    },
    {
      label: "CO₂ prevented",
      value: `${impact.co2PreventedKg} kg`,
      change: "-320 kg emissions",
      icon: ICON_MAP.co2,
    },
    {
      label: "Meals provided",
      value: `${impact.mealsProvided}`,
      change: "+48 meals this week",
      icon: ICON_MAP.meals,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <Card className="border-none bg-gradient-to-br from-white to-emerald-50/70 dark:from-gray-900 dark:to-emerald-950/30 shadow-lg shadow-emerald-100/60 dark:shadow-emerald-900/30">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <Icon className="h-10 w-10 text-emerald-500 drop-shadow" />
                  <span className="text-xs font-semibold text-emerald-500">{stat.change}</span>
                </div>
                <p className="mt-4 text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white mt-2">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

