"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

interface IngredientBreakdownChartProps {
  data: { ingredient: string; usage: number }[];
}

const COLORS = ["#34d399", "#10b981", "#0ea5e9", "#fbbf24", "#f87171", "#6366f1"];

export function IngredientBreakdownChart({ data }: IngredientBreakdownChartProps) {
  if (!data.length) return null;
  return (
    <div className="rounded-3xl border border-white/60 bg-white/80 dark:bg-gray-900/70 p-4 shadow-lg">
      <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-[0.4em]">Ingredients</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="usage" nameKey="ingredient" outerRadius={90} innerRadius={50}>
              {data.map((entry, index) => (
                <Cell key={`cell-${entry.ingredient}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

