"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommunityImpact } from "@/lib/server/db";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";

interface ImpactTrendChartProps {
  data: CommunityImpact["weeklyTrend"];
}

export function ImpactTrendChart({ data }: ImpactTrendChartProps) {
  if (!data?.length) return null;

  return (
    <Card className="border-none bg-white/80 dark:bg-gray-900/80 shadow-xl shadow-emerald-100/40">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Weekly Surplus Trend</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="impactGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(15, 23, 42, 0.9)",
                border: "none",
                borderRadius: "12px",
                color: "#fff",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#impactGradient)"
              dot={{ fill: "#10b981", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

