"use client";

import { useEffect, useState } from "react";
import { RestaurantImpactMetrics } from "@/lib/server/db";
import { getRestaurantImpact } from "@/lib/server/restaurant.analytics.server";
import { ImpactMetrics } from "@/components/restaurant/ImpactMetrics";
import { SustainabilityChart } from "@/components/restaurant/SustainabilityChart";
import { WasteRiskGauge } from "@/components/restaurant/WasteRiskGauge";
import { PageHeader } from "@/components/shared/page-header";

export default function RestaurantAnalyticsPage() {
  const [impact, setImpact] = useState<RestaurantImpactMetrics | null>(null);

  useEffect(() => {
    getRestaurantImpact().then(setImpact);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sustainability Analytics"
        description="Watch waste prevention, donation rates, and category performance."
      />
      <ImpactMetrics impact={impact} />
      <SustainabilityChart weekly={impact?.weeklyTrend ?? []} monthly={impact?.monthlyTrend ?? []} />
      <div className="grid lg:grid-cols-2 gap-4">
        <WasteRiskGauge score={impact ? 100 - impact.sustainabilityScore : 45} label="Waste Risk" />
        <div className="rounded-3xl border border-white/60 bg-white/80 dark:bg-gray-900/70 p-6 shadow-lg">
          <h3 className="text-lg font-semibold">Category Breakdown</h3>
          <div className="mt-4 space-y-3">
            {impact?.categoryBreakdown.map((cat) => (
              <div key={cat.category} className="flex items-center justify-between text-sm">
                <span>{cat.category}</span>
                <span className="font-semibold">{cat.wasteKg} kg</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

