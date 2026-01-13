"use client";

import { useEffect, useState } from "react";
import { RestaurantDonationLog } from "@/lib/server/db";
import { getDonationHistory } from "@/lib/server/restaurant.donations.server";
import { DonationHistoryTimeline } from "@/components/restaurant/DonationHistoryTimeline";
import { PageHeader } from "@/components/shared/page-header";

export default function RestaurantDonationHistoryPage() {
  const [logs, setLogs] = useState<RestaurantDonationLog[]>([]);

  useEffect(() => {
    getDonationHistory().then(setLogs);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Donation History"
        description="Review the meals shared, recipients, and impact metrics for each drop."
      />
      <div className="rounded-3xl border border-white/60 bg-white/80 dark:bg-gray-900/70 p-6 shadow-lg">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Donation History</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Track the meals donated and impact generated with your surplus.
      </p>
      <DonationHistoryTimeline donations={logs} />
    </div>
    </div>
  );
}

