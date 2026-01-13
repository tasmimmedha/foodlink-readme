"use client";

import { PageHeader } from "@/components/shared/page-header";
import { KPIWidget } from "@/components/shared/kpi-widget";
import { useDashboardStats } from "@/hooks/use-query-analytics";
import { Package, ShoppingCart, AlertTriangle, Users } from "lucide-react";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your food management"
      />
      {isLoading ? (
        <SkeletonLoader variant="card" count={4} />
      ) : (
        <KPIWidget
          kpis={[
            {
              title: "Inventory Items",
              value: stats?.inventoryItems || 0,
              icon: Package,
              description: "Total items in inventory",
            },
            {
              title: "Shopping List",
              value: stats?.shoppingListItems || 0,
              icon: ShoppingCart,
              description: "Items to purchase",
            },
            {
              title: "Expiring Soon",
              value: stats?.expiringItems || 0,
              icon: AlertTriangle,
              description: "Items expiring in 7 days",
            },
            {
              title: "Community Posts",
              value: stats?.communityPosts || 0,
              icon: Users,
              description: "Recent community activity",
            },
          ]}
        />
      )}
    </div>
  );
}

