"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ShopDashboardCard } from "@/components/shop/ShopDashboardCard";
import { TrendLineChart } from "@/components/shop/TrendLineChart";
import {
  useShopInventory,
  useExpiringItems,
  useMarkdownCandidates,
  useSurplusQueue,
  useWasteTrends,
  useMarkdownRecoveryTrend,
} from "@/hooks/use-query-shop";
import { Button } from "@/components/ui/button";
import { Plus, Tag, Package, Truck } from "lucide-react";
import { KPIBlock } from "@/components/shop/KPIBlock";
import { ensureShopSeedData } from "@/lib/server/shop.seed";

export default function ShopDashboardPage() {
  const [seedReady, setSeedReady] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    ensureShopSeedData()
      .then(() => {
        // Invalidate all shop queries to refetch fresh data
        queryClient.invalidateQueries({ queryKey: ["shop"] });
        setSeedReady(true);
      })
      .catch((err) => {
        console.error("Failed to seed shop data:", err);
        setSeedReady(true); // Continue anyway
      });
  }, [queryClient]);

  const { data: inventory = [] } = useShopInventory(undefined, { enabled: seedReady });
  const { data: expiring } = useExpiringItems({ enabled: seedReady });
  const { data: markdowns = [] } = useMarkdownCandidates({ enabled: seedReady });
  const { data: surplus = [] } = useSurplusQueue({ enabled: seedReady });
  const { data: wasteTrend = [] } = useWasteTrends({ enabled: seedReady });
  const { data: markdownTrend = [] } = useMarkdownRecoveryTrend({ enabled: seedReady });

  const totalSkus = inventory.length;
  const expiringToday = expiring?.today.length ?? 0;
  const markdownReady = markdowns.length;
  const surplusPending = surplus.filter((item) => item.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-4">
        <ShopDashboardCard title="Total SKUs" value={totalSkus} subtitle="Active products" />
        <ShopDashboardCard
          title="Expiring today"
          value={expiringToday}
          subtitle="Immediate action"
          accent="from-rose-400 via-rose-300 to-amber-400"
        />
        <ShopDashboardCard
          title="Markdown-ready"
          value={markdownReady}
          subtitle="Within 48h"
          accent="from-amber-400 via-yellow-300 to-amber-500"
        />
        <ShopDashboardCard
          title="Surplus pending"
          value={surplusPending}
          subtitle="Waiting pickup"
          accent="from-indigo-400 via-sky-300 to-emerald-400"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button 
          className="rounded-full gap-2 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/30"
          onClick={() => router.push("/shop/inventory?action=add")}
        >
          <Plus className="h-4 w-4" />
          Add SKU
        </Button>
        <Button 
          variant="outline" 
          className="rounded-full gap-2 transition-all duration-200 hover:scale-105 hover:bg-slate-50 hover:border-slate-300 hover:shadow-md"
          onClick={() => router.push("/shop/inventory")}
        >
          <Tag className="h-4 w-4" />
          Update price
        </Button>
        <Button 
          variant="ghost" 
          className="rounded-full gap-2 text-emerald-600 transition-all duration-200 hover:scale-105 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-sm"
          onClick={() => router.push("/shop/inventory")}
        >
          <Package className="h-4 w-4" />
          Mark discount
        </Button>
        <Button 
          variant="ghost" 
          className="rounded-full gap-2 text-indigo-600 transition-all duration-200 hover:scale-105 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-sm"
          onClick={() => router.push("/shop/surplus")}
        >
          <Truck className="h-4 w-4" />
          Mark surplus
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-100 bg-white/95 p-4 shadow-lg">
          <p className="text-sm font-semibold text-slate-600">Waste reduction</p>
          <TrendLineChart data={wasteTrend} color="#10b981" />
        </div>
        <div className="rounded-3xl border border-slate-100 bg-white/95 p-4 shadow-lg">
          <p className="text-sm font-semibold text-slate-600">Markdown recovery</p>
          <TrendLineChart data={markdownTrend} color="#6366f1" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <KPIBlock label="Revenue recovered via markdowns" value="৳84k" helper="Last 30 days" />
        <KPIBlock
          label="Waste diverted"
          value="312 kg"
          helper="CO₂ prevented 240kg"
          tone="indigo"
        />
        <KPIBlock
          label="NGO pickups this week"
          value={`${surplusPending}`}
          helper="Awaiting confirmation"
          tone="amber"
        />
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white/95 p-5 shadow-lg">
        <p className="text-sm font-semibold text-slate-600">Suggested next actions</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-500">
          <li>Schedule markdown for dairy aisle – 4 SKUs under 48h.</li>
          <li>Confirm NGO pickup slot for bread & milk surplus.</li>
          <li>Assign staff to tomato donation prep before 5 PM.</li>
        </ul>
      </div>
    </div>
  );
}

