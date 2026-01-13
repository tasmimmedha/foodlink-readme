"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDailyNutrition } from "@/hooks/use-query-family";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = {
  protein: "#3b82f6", // blue
  carbs: "#10b981", // green
  fats: "#f59e0b", // yellow
};

export function MacroBreakdownChart() {
  const { data: nutrition, isLoading } = useDailyNutrition();

  if (isLoading) {
    return <SkeletonLoader variant="card" count={1} />;
  }

  if (!nutrition) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Macro Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No data available
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

  const totalCalories = macroCalories.protein + macroCalories.carbs + macroCalories.fats;

  const data = [
    {
      name: "Protein",
      value: Math.round(macroCalories.protein),
      grams: Math.round(nutrition.protein),
      percentage: Math.round((macroCalories.protein / totalCalories) * 100),
      color: COLORS.protein,
    },
    {
      name: "Carbs",
      value: Math.round(macroCalories.carbs),
      grams: Math.round(nutrition.carbs),
      percentage: Math.round((macroCalories.carbs / totalCalories) * 100),
      color: COLORS.carbs,
    },
    {
      name: "Fats",
      value: Math.round(macroCalories.fats),
      grams: Math.round(nutrition.fats),
      percentage: Math.round((macroCalories.fats / totalCalories) * 100),
      color: COLORS.fats,
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.grams}g ({data.percentage}%)
          </p>
          <p className="text-sm text-muted-foreground">
            {data.value} calories
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Macro Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ percentage }) => `${percentage}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value, entry: any) => (
                <span style={{ color: entry.color }}>
                  {value}: {entry.payload.grams}g
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
          {data.map((macro) => (
            <div key={macro.name} className="text-center">
              <div
                className="w-4 h-4 rounded-full mx-auto mb-2"
                style={{ backgroundColor: macro.color }}
              />
              <p className="text-sm font-semibold">{macro.name}</p>
              <p className="text-lg font-bold">{macro.grams}g</p>
              <p className="text-xs text-muted-foreground">{macro.percentage}%</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

