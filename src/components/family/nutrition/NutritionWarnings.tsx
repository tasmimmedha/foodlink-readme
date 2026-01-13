"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNutritionWarnings } from "@/hooks/use-query-family";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import { AlertTriangle, Info, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export function NutritionWarnings() {
  const { data: warnings, isLoading } = useNutritionWarnings();

  if (isLoading) {
    return <SkeletonLoader variant="card" count={1} />;
  }

  if (!warnings || warnings.length === 0) {
    return (
      <Card className="border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-green-600 dark:text-green-400" />
            Nutrition Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-700 dark:text-green-300 text-center py-4">
            ✅ All nutrition levels are within healthy ranges!
          </p>
        </CardContent>
      </Card>
    );
  }

  const getIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      default:
        return <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getBadgeVariant = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive";
      case "warning":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          Nutrition Warnings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {warnings.map((warning, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border ${
              warning.severity === "critical"
                ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900"
                : warning.severity === "warning"
                ? "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900"
                : "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                {getIcon(warning.severity)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">{warning.nutrient}</p>
                    <Badge variant={getBadgeVariant(warning.severity) as any}>
                      {warning.type === "high" ? "High" : "Low"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{warning.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Current: {Math.round(warning.currentValue)}
                    {warning.nutrient === "Calories" ? "" : warning.nutrient === "Sodium" ? "mg" : "g"} 
                    {" "}• Recommended: {Math.round(warning.recommendedValue)}
                    {warning.nutrient === "Calories" ? "" : warning.nutrient === "Sodium" ? "mg" : "g"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

