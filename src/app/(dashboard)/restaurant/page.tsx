"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RestaurantInventoryItem, RestaurantSurplusItem, RestaurantImpactMetrics } from "@/lib/server/db";
import { getRestaurantInventory, getExpiringItems } from "@/lib/server/restaurant.inventory.server";
import { getSurplusItems } from "@/lib/server/restaurant.surplus.server";
import { getRestaurantImpact } from "@/lib/server/restaurant.analytics.server";
import { RestaurantSummaryCard } from "@/components/restaurant/RestaurantSummaryCard";
import { ExpiringStockList } from "@/components/restaurant/ExpiringStockList";
import { WasteRiskGauge } from "@/components/restaurant/WasteRiskGauge";
import { SuggestedDonations } from "@/components/restaurant/SuggestedDonations";
import { Button } from "@/components/ui/button";
import { PlusCircle, PackageCheck, Truck, Leaf, AlertTriangle, Package, TrendingUp, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { motion } from "framer-motion";

export default function RestaurantDashboardPage() {
  const [inventory, setInventory] = useState<RestaurantInventoryItem[]>([]);
  const [expiring, setExpiring] = useState<RestaurantInventoryItem[]>([]);
  const [surplus, setSurplus] = useState<RestaurantSurplusItem[]>([]);
  const [impact, setImpact] = useState<RestaurantImpactMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [inv, exp, sur, imp] = await Promise.all([
        getRestaurantInventory(),
        getExpiringItems(),
        getSurplusItems(),
        getRestaurantImpact(),
      ]);
      setInventory(inv);
      setExpiring(exp);
      setSurplus(sur);
      setImpact(imp);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const todaysSurplus = surplus.filter((item) => item.status === "pending").length;
  const suggestedDonations = expiring.slice(0, 3);
  const wasteRiskScore = impact ? 100 - impact.sustainabilityScore : 45;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mx-auto" />
          <p className="text-sm text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Restaurant Dashboard"
        description="Monitor surplus, reduce risk, and keep sustainability targets on track."
      />
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <RestaurantSummaryCard
          title="Today's Surplus"
          value={`${todaysSurplus} items`}
          subtitle="Ready for pickup"
          icon={<Leaf className="h-5 w-5" />}
          accent="from-emerald-500/80 to-teal-500/80"
        />
        <RestaurantSummaryCard
          title="Expiring Soon"
          value={`${expiring.length}`}
          subtitle="Needs attention"
          icon={<AlertTriangle className="h-5 w-5" />}
          accent="from-amber-500/80 to-orange-500/80"
        />
        <RestaurantSummaryCard
          title="Inventory Batches"
          value={`${inventory.length}`}
          subtitle="Active stock"
          icon={<Package className="h-5 w-5" />}
          accent="from-blue-500/80 to-cyan-500/80"
        />
        <RestaurantSummaryCard
          title="Sustainability Score"
          value={`${impact?.sustainabilityScore ?? 0}%`}
          subtitle="Daily target"
          icon={<TrendingUp className="h-5 w-5" />}
          accent="from-green-500/80 to-emerald-500/80"
        />
      </section>

      <section className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-white/60 bg-white/80 dark:bg-gray-900/70 p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Items Nearing Expiry</h2>
                <p className="text-sm text-muted-foreground">Prioritize these for donations or menu specials</p>
              </div>
              {expiring.length > 0 && (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-600 text-xs font-bold">
                  {expiring.length}
                </span>
              )}
            </div>
            <ExpiringStockList items={expiring} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl border border-white/60 bg-white/80 dark:bg-gray-900/70 p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Suggested Donations</h2>
                <p className="text-sm text-muted-foreground">Items ready to be donated to reduce waste</p>
              </div>
              {suggestedDonations.length > 0 && (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold">
                  {suggestedDonations.length}
                </span>
              )}
            </div>
            <SuggestedDonations items={suggestedDonations} />
          </motion.div>
        </div>
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <WasteRiskGauge score={wasteRiskScore} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-3xl border border-white/60 bg-white/80 dark:bg-gray-900/70 p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                asChild
                className="w-full justify-between rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-md hover:shadow-lg transition-all"
              >
                <Link href="/restaurant/surplus">
                  Add Surplus <PlusCircle className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-between rounded-2xl border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all"
              >
                <Link href="/restaurant/inventory">
                  Update Inventory <PackageCheck className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-between rounded-2xl border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all"
              >
                <Link href="/restaurant/surplus">
                  View Pickups <Truck className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

