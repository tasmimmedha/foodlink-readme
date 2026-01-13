"use client";

import { useState } from "react";
import { useNgoHistory } from "@/hooks/use-query-ngo";
import { DonationHistoryTimeline } from "@/components/ngo/DonationHistoryTimeline";
import { ImpactKPI } from "@/components/ngo/ImpactKPI";
import { ExportReportButton } from "@/components/ngo/ExportReportButton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import type { HistoryFilters } from "@/lib/server";

export default function NGOGistoryPage() {
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const filters: HistoryFilters = {};
  if (status !== "all") {
    filters.status = status as HistoryFilters["status"];
  }
  if (search) {
    filters.search = search;
  }
  const { data } = useNgoHistory(filters);

  const entries = data?.entries ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-slate-100 bg-white/80 p-4 shadow-lg dark:border-slate-800 dark:bg-slate-900/70">
        <Input
          placeholder="Search donor, item, or tag"
          className="max-w-sm"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Select value={status} onValueChange={(value) => setStatus(value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
            <SelectItem value="redirected">Redirected</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <ExportReportButton filters={filters} />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <ImpactKPI label="Total meals" value={data?.summary.totalMeals ?? 0} sublabel="This year" />
        <ImpactKPI label="Total kg" value={`${data?.summary.totalKg ?? 0}kg`} sublabel="Donated" tone="amber" />
        <ImpactKPI label="CO₂ prevented" value={`${data?.summary.totalCo2 ?? 0}kg`} sublabel="Impact" tone="indigo" />
        <ImpactKPI label="Beneficiaries" value={data?.summary.beneficiaries ?? 0} sublabel="Reached" tone="rose" />
      </div>

      <Card className="rounded-3xl border-slate-100 bg-white/80 shadow-lg dark:border-slate-800 dark:bg-slate-900/70">
        <CardContent className="p-6">
          <DonationHistoryTimeline entries={entries} onSelect={(entry) => toast({ title: entry.donorName, description: entry.itemsSummary })} />
        </CardContent>
      </Card>
    </div>
  );
}


