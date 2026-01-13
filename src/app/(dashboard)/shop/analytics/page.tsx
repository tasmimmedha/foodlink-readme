"use client";

import { RetailAnalyticsCharts } from "@/components/shop/RetailAnalyticsCharts";
import { KPIBlock } from "@/components/shop/KPIBlock";
import {
  useWasteTrends,
  useMarkdownRecoveryTrend,
  useWasteBreakdowns,
  useRetailImpactKPIs,
} from "@/hooks/use-query-shop";

export default function ShopAnalyticsPage() {
  const { data: wasteTrend = [] } = useWasteTrends();
  const { data: markdownTrend = [] } = useMarkdownRecoveryTrend();
  const { data: breakdown } = useWasteBreakdowns();
  const { data: impact } = useRetailImpactKPIs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Retail analytics</h1>
        <p className="text-sm text-slate-500">
          Track waste reduction, markdown recovery, and donation impact.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <KPIBlock label="CO₂ prevented" value={`${impact?.totalCo2Prevented ?? 0} kg`} helper="vs last month" />
        <KPIBlock label="Meals donated" value={impact?.mealsDonated ?? 0} helper="via surplus pickups" tone="indigo" />
        <KPIBlock
          label="Waste reduction"
          value={`${impact?.wasteReductionPercent ?? 0}%`}
          helper="month over month"
          tone="amber"
        />
      </div>

      <RetailAnalyticsCharts
        wasteTrend={wasteTrend}
        markdownTrend={markdownTrend}
        wasteByCategory={breakdown?.wasteByCategory ?? []}
        surplusVsSold={breakdown?.surplusVsSold ?? []}
        expiredDaily={breakdown?.expiredPerDay ?? []}
      />
    </div>
  );
}

