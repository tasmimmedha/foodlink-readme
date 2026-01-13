"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { RestaurantImpactMetrics } from "@/lib/server/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SustainabilityChartProps {
  weekly: RestaurantImpactMetrics["weeklyTrend"];
  monthly: RestaurantImpactMetrics["monthlyTrend"];
}

export function SustainabilityChart({ weekly, monthly }: SustainabilityChartProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card className="border-none bg-white/80 dark:bg-gray-900/70 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg">Weekly Waste Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.1)" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="border-none bg-white/80 dark:bg-gray-900/70 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg">Monthly Donation Volume</CardTitle>
        </CardHeader>
        <CardContent className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthly}>
              <defs>
                <linearGradient id="donationGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#0ea5e9" fill="url(#donationGradient)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

