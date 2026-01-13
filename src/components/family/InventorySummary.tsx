"use client";

import { useMemo } from "react";
import { SectionCard } from "@/components/shared/section-card";
import { GlowButton } from "@/components/shared/glow-button";
import { useInventorySummary } from "@/hooks/use-query-family";
import { useState } from "react";
import { InventoryAddDrawer } from "./InventoryAddDrawer";
import { AnimatedCounter } from "@/components/landing/AnimatedCounter";
import { Package, AlertTriangle, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/helpers";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import { motion } from "framer-motion";

export function InventorySummary() {
  const { data, isLoading } = useInventorySummary();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // All hooks must be called before any early returns
  const summary = useMemo(() => data || {
    totalItems: 0,
    expiringSoon: 0,
    expired: 0,
    expiringItems: [],
  }, [data]);

  const expiringItemsToShow = useMemo(() => 
    summary.expiringItems.slice(0, 5),
    [summary.expiringItems]
  );

  if (isLoading) {
    return (
      <SectionCard title="Inventory Overview">
        <SkeletonLoader variant="card" count={3} />
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Inventory Overview"
      description="Track your food inventory and expiry dates"
      headerAction={
        <GlowButton size="default" className="gap-2" onClick={() => setDrawerOpen(true)}>
          <Plus className="h-4 w-4" />
          <span>Add Item</span>
        </GlowButton>
      }
    >
      <div className="space-y-6">
        {/* Stats Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.1 }}
             className="text-center p-5 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 rounded-2xl border border-blue-200/60 dark:border-blue-800/40 shadow-sm hover:shadow-md transition-all"
           >
             <div className="flex items-center justify-center h-10 w-10 mx-auto mb-3 rounded-xl bg-blue-500/10">
               <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
             </div>
             <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-1">
               <AnimatedCounter value={summary.totalItems} />
             </div>
             <div className="text-xs font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wide">Total Items</div>
           </motion.div>

           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.2 }}
             className="text-center p-5 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 rounded-2xl border border-amber-200/60 dark:border-amber-800/40 shadow-sm hover:shadow-md transition-all"
           >
             <div className="flex items-center justify-center h-10 w-10 mx-auto mb-3 rounded-xl bg-amber-500/10">
               <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
           </div>
             <div className="text-3xl font-bold text-amber-900 dark:text-amber-100 mb-1">
               <AnimatedCounter value={summary.expiringSoon} />
             </div>
             <div className="text-xs font-medium text-amber-700 dark:text-amber-300 uppercase tracking-wide">Expiring Soon</div>
           </motion.div>

           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.3 }}
             className="text-center p-5 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20 rounded-2xl border border-red-200/60 dark:border-red-800/40 shadow-sm hover:shadow-md transition-all"
           >
             <div className="flex items-center justify-center h-10 w-10 mx-auto mb-3 rounded-xl bg-red-500/10">
               <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
           </div>
             <div className="text-3xl font-bold text-red-900 dark:text-red-100 mb-1">
               <AnimatedCounter value={summary.expired} />
             </div>
             <div className="text-xs font-medium text-red-700 dark:text-red-300 uppercase tracking-wide">Expired</div>
           </motion.div>
         </div>

        {/* Expiring Soon List */}
        {summary.expiringItems.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">
              Expiring Soon
            </h4>
            <div className="space-y-3">
              {expiringItemsToShow.map((item, index) => (
                <motion.div
                   key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-4 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/60 dark:border-amber-800/40 hover:shadow-md hover:border-amber-300 dark:hover:border-amber-700 transition-all">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">{item.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                      {item.quantity} {item.unit || "units"}
                    </div>
                  </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                    <Badge
                      variant={
                        item.daysUntilExpiry <= 1
                          ? "destructive"
                          : item.daysUntilExpiry <= 3
                          ? "default"
                          : "secondary"
                      }
                          className="text-xs font-medium whitespace-nowrap"
                    >
                      {item.daysUntilExpiry === 0
                        ? "Today"
                        : item.daysUntilExpiry === 1
                        ? "1 day"
                        : `${item.daysUntilExpiry} days`}
                    </Badge>
                        <span className="text-xs text-muted-foreground whitespace-nowrap hidden sm:inline">
                      {formatDate(item.expiryDate)}
                    </span>
                      </div>
                  </div>
                </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {summary.expiringItems.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No items expiring soon. Great job!
          </div>
        )}
      </div>
      <InventoryAddDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </SectionCard>
  );
}

