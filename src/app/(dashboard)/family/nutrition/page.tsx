"use client";

import { PageHeader } from "@/components/shared/page-header";
import { DailyNutritionSummary } from "@/components/family/nutrition/DailyNutritionSummary";
import { NutritionWarnings } from "@/components/family/nutrition/NutritionWarnings";
import { MacroBreakdownChart } from "@/components/family/nutrition/MacroBreakdownChart";
import { VitaminMineralGrid } from "@/components/family/nutrition/VitaminMineralGrid";
import { NutritionRecommendations } from "@/components/family/nutrition/NutritionRecommendations";
import { HealthyPlateGauge } from "@/components/family/nutrition/HealthyPlateGauge";
import { WeeklyNutritionScoreChart } from "@/components/family/nutrition/WeeklyNutritionScoreChart";
import { NutritionBadgePreview } from "@/components/family/nutrition/NutritionBadgePreview";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import { Suspense } from "react";

export default function NutritionPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Nutrition Plan"
        description="Track your daily nutrition, vitamins, and maintain a balanced diet"
      />

      {/* Top Row - Summary and Warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<SkeletonLoader variant="card" count={1} />}>
          <DailyNutritionSummary />
        </Suspense>
        <Suspense fallback={<SkeletonLoader variant="card" count={1} />}>
          <NutritionWarnings />
        </Suspense>
      </div>

      {/* Second Row - Macro Chart and Healthy Plate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<SkeletonLoader variant="card" count={1} />}>
          <MacroBreakdownChart />
        </Suspense>
        <Suspense fallback={<SkeletonLoader variant="card" count={1} />}>
          <HealthyPlateGauge />
        </Suspense>
      </div>

      {/* Third Row - Vitamins & Minerals */}
      <Suspense fallback={<SkeletonLoader variant="card" count={1} />}>
        <VitaminMineralGrid />
      </Suspense>

      {/* Fourth Row - Weekly Score and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<SkeletonLoader variant="card" count={1} />}>
          <WeeklyNutritionScoreChart />
        </Suspense>
        <Suspense fallback={<SkeletonLoader variant="card" count={1} />}>
          <NutritionRecommendations />
        </Suspense>
      </div>

      {/* Fifth Row - Badges */}
      <Suspense fallback={<SkeletonLoader variant="card" count={1} />}>
        <NutritionBadgePreview />
      </Suspense>
    </div>
  );
}

