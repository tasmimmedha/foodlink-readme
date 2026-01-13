"use client";

import { useNgoImpactInsights } from "@/hooks/use-query-ngo";
import { ImpactKPI } from "@/components/ngo/ImpactKPI";
import { ImpactTrendChart } from "@/components/ngo/ImpactTrendChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";

const COLORS = ["#34d399", "#fcd34d", "#f87171", "#60a5fa", "#c084fc"];

export default function NGOReportsPage() {
  const { data } = useNgoImpactInsights();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <ImpactKPI label="Meals provided" value={data?.kpis.meals ?? 0} sublabel="All time" />
        <ImpactKPI label="KG donated" value={`${data?.kpis.kilograms ?? 0} kg`} sublabel="Rescued" tone="amber" />
        <ImpactKPI label="CO₂ prevented" value={`${data?.kpis.co2 ?? 0} kg`} sublabel="Environmental" tone="indigo" />
        <ImpactKPI label="Partner count" value={data?.kpis.partners ?? 0} sublabel="Network" tone="rose" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <ImpactTrendChart data={data?.timeSeries ?? []} />

        <Card className="rounded-3xl border-slate-100 bg-white/80 shadow-lg dark:border-slate-800 dark:bg-slate-900/70">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Donation mix</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={data?.donationTypeBreakdown ?? []}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {(data?.donationTypeBreakdown ?? []).map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl border-slate-100 bg-white/80 shadow-lg dark:border-slate-800 dark:bg-slate-900/70">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Impact stories</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-80">
            <div className="space-y-4 pr-4">
              {(data?.stories ?? []).map((story) => (
                <div key={story.id} className="rounded-2xl border border-slate-100 p-4 dark:border-slate-800">
                  <p className="text-sm uppercase tracking-wide text-slate-400">{story.beneficiaryType}</p>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{story.title}</h3>
                  <p className="text-sm text-slate-500">{story.excerpt}</p>
                  <div className="mt-3 flex gap-4 text-xs uppercase tracking-wide text-slate-400">
                    <span>{story.metrics.meals} meals</span>
                    <span>{story.metrics.families} families</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}


