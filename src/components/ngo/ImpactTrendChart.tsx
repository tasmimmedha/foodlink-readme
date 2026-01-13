"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ImpactTrendChartProps {
  data: { label: string; kg: number; meals: number }[];
}

export function ImpactTrendChart({ data }: ImpactTrendChartProps) {
  return (
    <Card className="rounded-3xl border-slate-100 bg-white/80 shadow-lg shadow-slate-100/70 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-black/30">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Impact trend</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 0, right: 0 }}>
            <defs>
              <linearGradient id="colorKg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#34d399" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="colorMeals" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip
              contentStyle={{
                borderRadius: 16,
                borderColor: "#d1fae5",
                background: "#fff",
              }}
            />
            <Area type="monotone" dataKey="kg" stroke="#34d399" strokeWidth={3} fill="url(#colorKg)" />
            <Area type="monotone" dataKey="meals" stroke="#6366f1" strokeWidth={3} fill="url(#colorMeals)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}


