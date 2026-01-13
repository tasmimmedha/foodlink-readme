"use client";

import { PageHeader } from "@/components/shared/page-header";
import { ChartContainer } from "@/components/shared/chart-container";
import { KPIWidget } from "@/components/shared/kpi-widget";
import { useAnalytics } from "@/hooks/use-query-analytics";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import { TrendingDown, Package, AlertTriangle, Trash2 } from "lucide-react";

export default function AnalyticsPage() {
  const { data: analytics, isLoading } = useAnalytics();

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Track your food waste and consumption patterns"
      />
      {isLoading ? (
        <SkeletonLoader variant="card" count={4} />
      ) : (
        <>
          <KPIWidget
            kpis={[
              {
                title: "Total Items",
                value: analytics?.totalItems || 0,
                icon: Package,
              },
              {
                title: "Expiring Soon",
                value: analytics?.expiringSoon || 0,
                icon: AlertTriangle,
              },
              {
                title: "Total Waste",
                value: analytics?.totalWaste || 0,
                icon: Trash2,
              },
              {
                title: "Waste Reduction",
                value: `${analytics?.wasteReduction || 0}%`,
                icon: TrendingDown,
                trend: {
                  value: analytics?.wasteReduction || 0,
                  isPositive: true,
                },
              },
            ]}
            className="mb-8"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <ChartContainer title="Monthly Waste">
              <p className="text-sm text-muted-foreground">Chart will be implemented with Recharts</p>
            </ChartContainer>
            <ChartContainer title="Consumption Trends">
              <p className="text-sm text-muted-foreground">Chart will be implemented with Recharts</p>
            </ChartContainer>
          </div>
        </>
      )}
    </div>
  );
}

