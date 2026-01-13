"use client";

import { useEffect, useState } from "react";
import { CommunityImpact } from "@/lib/server/db";
import { getCommunityImpact } from "@/lib/server/community.server";
import { CommunityImpactStats } from "@/components/community/CommunityImpactStats";
import { ImpactTrendChart } from "@/components/community/ImpactTrendChart";
import { Card, CardContent } from "@/components/ui/card";

export default function CommunityImpactPage() {
  const [impact, setImpact] = useState<CommunityImpact | null>(null);

  useEffect(() => {
    loadImpact();
  }, []);

  const loadImpact = async () => {
    setImpact(await getCommunityImpact());
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Community Impact</h1>
        <p className="text-gray-500">Track how our building prevents waste and boosts sharing.</p>
      </div>
      <CommunityImpactStats impact={impact} />
      <ImpactTrendChart data={impact?.weeklyTrend ?? []} />

      <section>
        <h2 className="text-xl font-semibold mb-3">Your Contribution</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {impact?.personalContribution.map((item) => (
            <Card key={item.label} className="border-none bg-white/80 dark:bg-gray-900/70 shadow-lg">
              <CardContent className="p-5">
                <p className="text-sm uppercase tracking-wide text-gray-500">{item.label}</p>
                <p className="text-3xl font-bold text-emerald-600">{`${item.value} ${item.unit}`}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

