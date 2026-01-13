"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDailyNutrition } from "@/hooks/use-query-family";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import { Flame, Beef, Wheat, Droplets } from "lucide-react";
import { motion } from "framer-motion";

export function DailyNutritionSummary() {
  const { data: nutrition, isLoading } = useDailyNutrition();

  if (isLoading) {
    return <SkeletonLoader variant="card" count={1} />;
  }

  if (!nutrition) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Nutrition Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No nutrition data available. Start logging meals to track your nutrition.
          </p>
        </CardContent>
      </Card>
    );
  }

  const macroCalories = {
    protein: nutrition.protein * 4,
    carbs: nutrition.carbs * 4,
    fats: nutrition.fats * 9,
  };

  const macroPercentages = {
    protein: (macroCalories.protein / nutrition.calories) * 100,
    carbs: (macroCalories.carbs / nutrition.calories) * 100,
    fats: (macroCalories.fats / nutrition.calories) * 100,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s Nutrition Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Calories */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Flame className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Calories</p>
              <p className="text-2xl font-bold">{Math.round(nutrition.calories)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Target: 2000</p>
            <div className="w-24 h-2 bg-orange-200 dark:bg-orange-900 rounded-full mt-1">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (nutrition.calories / 2000) * 100)}%` }}
                className="h-full bg-orange-500 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Macros */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <div className="flex justify-center mb-2">
              <Beef className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Protein</p>
            <p className="text-xl font-bold">{Math.round(nutrition.protein)}g</p>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(macroPercentages.protein)}%
            </p>
          </div>

          <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <div className="flex justify-center mb-2">
              <Wheat className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Carbs</p>
            <p className="text-xl font-bold">{Math.round(nutrition.carbs)}g</p>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(macroPercentages.carbs)}%
            </p>
          </div>

          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
            <div className="flex justify-center mb-2">
              <Droplets className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Fats</p>
            <p className="text-xl font-bold">{Math.round(nutrition.fats)}g</p>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(macroPercentages.fats)}%
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-sm text-muted-foreground">Fiber</p>
            <p className="text-lg font-semibold">{Math.round(nutrition.fiber)}g</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Sugar</p>
            <p className="text-lg font-semibold">{Math.round(nutrition.sugar)}g</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Sodium</p>
            <p className="text-lg font-semibold">{Math.round(nutrition.sodium)}mg</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Nutrition Score</p>
            <p className="text-lg font-semibold text-green-600 dark:text-green-400">
              {nutrition.nutritionScore}/100
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

