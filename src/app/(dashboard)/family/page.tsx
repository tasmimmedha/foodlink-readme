"use client";

import { lazy, Suspense } from "react";
import { DashboardHeader } from "@/components/family/DashboardHeader";
import { XPProgressBar } from "@/components/family/XPProgressBar";
import { InventorySummary } from "@/components/family/InventorySummary";
import { ExpiringSoonList } from "@/components/family/ExpiringSoonList";
import { useImpactMetrics } from "@/hooks/use-query-family";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";

// Lazy load components that make heavy API calls or are below the fold
const WasteAnalytics = lazy(() => 
  import("@/components/family/WasteAnalytics").then(m => ({ default: m.WasteAnalytics }))
);
const MealPlannerWidget = lazy(() => 
  import("@/components/family/MealPlannerWidget").then(m => ({ default: m.MealPlannerWidget }))
);
const SmartShoppingWidget = lazy(() => 
  import("@/components/family/SmartShoppingWidget").then(m => ({ default: m.SmartShoppingWidget }))
);
const BulkBuyOpportunities = lazy(() => 
  import("@/components/family/BulkBuyOpportunities").then(m => ({ default: m.BulkBuyOpportunities }))
);
const EnvironmentalImpact = lazy(() => 
  import("@/components/family/EnvironmentalImpact").then(m => ({ default: m.EnvironmentalImpact }))
);
const RecentLogs = lazy(() => 
  import("@/components/family/RecentLogs").then(m => ({ default: m.RecentLogs }))
);
const BadgeShowcase = lazy(() => 
  import("@/components/family/BadgeShowcase").then(m => ({ default: m.BadgeShowcase }))
);

export default function FamilyDashboardPage() {
  const { data: impactMetrics, isLoading: impactLoading } = useImpactMetrics();

  return (
    <div className="space-y-6">
      <DashboardHeader userName="John Smith" householdName="Smith Family" />

      {/* XP Progress Bar */}
      {!impactLoading && impactMetrics && (
        <XPProgressBar
          totalXP={impactMetrics.totalXP}
          level={impactMetrics.level}
          currentLevelXP={impactMetrics.currentLevelXP}
          nextLevelXP={impactMetrics.nextLevelXP}
        />
      )}

      {/* Top Row - Inventory & Expiring Soon - Load first */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InventorySummary />
        <ExpiringSoonList />
      </div>

      {/* Second Row - Waste Analytics & Recent Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<SkeletonLoader variant="card" count={1} />}>
          <WasteAnalytics />
        </Suspense>
        <Suspense fallback={<SkeletonLoader variant="card" count={1} />}>
          <RecentLogs />
        </Suspense>
      </div>

      {/* Third Row - Meal Planner (full width) */}
      <div className="grid grid-cols-1 gap-6">
        <Suspense fallback={<SkeletonLoader variant="card" count={1} />}>
          <MealPlannerWidget />
        </Suspense>
      </div>

      {/* Fourth Row - Shopping, Bulk Buy & Environmental Impact */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Suspense fallback={<SkeletonLoader variant="card" count={1} />}>
          <SmartShoppingWidget />
        </Suspense>
        <Suspense fallback={<SkeletonLoader variant="card" count={1} />}>
        <BulkBuyOpportunities />
        </Suspense>
        <Suspense fallback={<SkeletonLoader variant="card" count={1} />}>
        <EnvironmentalImpact />
        </Suspense>
      </div>

      {/* Fifth Row - Badges */}
      <div className="grid grid-cols-1 gap-6">
        <Suspense fallback={<SkeletonLoader variant="card" count={1} />}>
          <BadgeShowcase />
        </Suspense>
      </div>
    </div>
  );
}

