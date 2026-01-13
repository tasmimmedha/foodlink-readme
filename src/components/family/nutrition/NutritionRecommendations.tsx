"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNutritionSuggestions } from "@/hooks/use-query-family";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import { Lightbulb, TrendingUp, TrendingDown, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export function NutritionRecommendations() {
  const { data: suggestions, isLoading } = useNutritionSuggestions();

  if (isLoading) {
    return <SkeletonLoader variant="card" count={1} />;
  }

  if (!suggestions || suggestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Keep up the great work! Your nutrition is well-balanced.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "increase":
        return <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case "decrease":
        return <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />;
      default:
        return <Plus className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-900";
      default:
        return "bg-blue-100 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          Personalized Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border ${getPriorityColor(suggestion.priority)}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getIcon(suggestion.type)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold">{suggestion.message}</p>
                  <Badge variant={suggestion.priority === "high" ? "destructive" : "secondary"}>
                    {suggestion.priority}
                  </Badge>
                </div>
                <p className="text-sm opacity-90">{suggestion.suggestion}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

