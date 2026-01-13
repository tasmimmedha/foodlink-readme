"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";

const PIE_COLORS = ["#34d399", "#60a5fa", "#fbbf24", "#fb7185", "#c084fc"];

export interface RetailAnalyticsChartsProps {
  wasteTrend: { label: string; value: number }[];
  markdownTrend: { label: string; value: number }[];
  wasteByCategory: { category: string; value: number }[];
  surplusVsSold: { label: string; value: number }[];
  expiredDaily: { label: string; value: number }[];
}

export function RetailAnalyticsCharts({
  wasteTrend,
  markdownTrend,
  wasteByCategory,
  surplusVsSold,
  expiredDaily,
}: RetailAnalyticsChartsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ChartCard title="Waste reduction trend">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={wasteTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="label" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Markdown recovery">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={markdownTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="label" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Waste by category">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={wasteByCategory} dataKey="value" nameKey="category" outerRadius={90} label>
              {wasteByCategory.map((entry, index) => (
                <Cell key={entry.category} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Surplus vs sold">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={surplusVsSold} dataKey="value" nameKey="label" outerRadius={90} label>
              {surplusVsSold.map((entry, index) => (
                <Cell key={entry.label} fill={PIE_COLORS[(index + 2) % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Expired items per day" className="lg:col-span-2">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={expiredDaily}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="label" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="value" fill="#f97316" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ChartCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-slate-100 bg-white/95 p-4 shadow-lg shadow-slate-200/60 ${className ?? ""}`}
    >
      <p className="text-sm font-semibold text-slate-500">{title}</p>
      <div className="mt-3 h-56">{children}</div>
    </div>
  );
}

