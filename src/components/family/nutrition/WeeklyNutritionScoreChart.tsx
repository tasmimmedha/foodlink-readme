"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWeeklyNutritionScores } from "@/hooks/use-query-family";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { motion } from "framer-motion";

export function WeeklyNutritionScoreChart() {
  const { data: scores, isLoading } = useWeeklyNutritionScores();

  if (isLoading) {
    return <SkeletonLoader variant="card" count={1} />;
  }

  if (!scores || scores.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Nutrition Score</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No data available
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = scores.map((score) => {
    const date = new Date(score.date);
    return {
      date: date.toLocaleDateString("en-US", { weekday: "short" }),
      fullDate: score.date,
      score: score.score,
    };
  });

  const averageScore = Math.round(
    scores.reduce((sum, s) => sum + s.score, 0) / scores.length
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-semibold">{data.fullDate}</p>
          <p className="text-lg font-bold text-green-600 dark:text-green-400">
            Score: {data.score}/100
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Nutrition Score Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">Average Score</p>
          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-4xl font-bold text-green-600 dark:text-green-400"
          >
            {averageScore}
          </motion.p>
          <p className="text-sm text-muted-foreground mt-1">out of 100</p>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: "currentColor" }}
            />
            <YAxis
              domain={[0, 100]}
              className="text-xs"
              tick={{ fill: "currentColor" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={70} stroke="#10b981" strokeDasharray="3 3" label="Good" />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-6 grid grid-cols-7 gap-2">
          {chartData.map((day, index) => (
            <div key={index} className="text-center">
              <p className="text-xs text-muted-foreground mb-1">{day.date}</p>
              <div
                className={`h-16 rounded flex items-center justify-center text-sm font-semibold ${
                  day.score >= 80
                    ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                    : day.score >= 60
                    ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300"
                    : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                }`}
              >
                {day.score}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

