"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDailyNutrition } from "@/hooks/use-query-family";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import { motion } from "framer-motion";

interface VitaminMineral {
  name: string;
  value: number;
  unit: string;
  target: number;
  icon: string;
}

export function VitaminMineralGrid() {
  const { data: nutrition, isLoading } = useDailyNutrition();

  if (isLoading) {
    return <SkeletonLoader variant="card" count={1} />;
  }

  if (!nutrition) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vitamins & Minerals</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No data available
          </p>
        </CardContent>
      </Card>
    );
  }

  const vitamins: VitaminMineral[] = [
    {
      name: "Vitamin A",
      value: nutrition.vitaminA,
      unit: "IU",
      target: 5000,
      icon: "🥕",
    },
    {
      name: "Vitamin B",
      value: nutrition.vitaminB,
      unit: "mg",
      target: 1.5,
      icon: "🌾",
    },
    {
      name: "Vitamin C",
      value: nutrition.vitaminC,
      unit: "mg",
      target: 75,
      icon: "🍊",
    },
    {
      name: "Vitamin D",
      value: nutrition.vitaminD,
      unit: "IU",
      target: 600,
      icon: "☀️",
    },
    {
      name: "Iron",
      value: nutrition.iron,
      unit: "mg",
      target: 18,
      icon: "🔴",
    },
    {
      name: "Calcium",
      value: nutrition.calcium,
      unit: "mg",
      target: 1000,
      icon: "🥛",
    },
  ];

  const getProgress = (value: number, target: number) => {
    return Math.min(100, (value / target) * 100);
  };

  const getStatus = (value: number, target: number) => {
    const progress = getProgress(value, target);
    if (progress >= 100) return "excellent";
    if (progress >= 80) return "good";
    if (progress >= 50) return "fair";
    return "low";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-600 dark:text-green-400";
      case "good":
        return "text-blue-600 dark:text-blue-400";
      case "fair":
        return "text-yellow-600 dark:text-yellow-400";
      default:
        return "text-red-600 dark:text-red-400";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vitamins & Minerals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {vitamins.map((vitamin, index) => {
            const progress = getProgress(vitamin.value, vitamin.target);
            const status = getStatus(vitamin.value, vitamin.target);

            return (
              <motion.div
                key={vitamin.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{vitamin.icon}</span>
                  <span className={`text-xs font-semibold ${getStatusColor(status)}`}>
                    {status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm font-semibold mb-1">{vitamin.name}</p>
                <p className="text-lg font-bold mb-2">
                  {Math.round(vitamin.value)} {vitamin.unit}
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Target: {vitamin.target} {vitamin.unit}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      className={`h-full rounded-full ${
                        status === "excellent"
                          ? "bg-green-500"
                          : status === "good"
                          ? "bg-blue-500"
                          : status === "fair"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

