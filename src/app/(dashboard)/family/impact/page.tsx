"use client";

import { PageHeader } from "@/components/shared/page-header";
import { XPProgressBar } from "@/components/family/XPProgressBar";
import { MetricCard } from "@/components/family/MetricCard";
import { TrendChart } from "@/components/family/TrendChart";
import { useImpactMetrics, useImpactTrends } from "@/hooks/use-query-family";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import { Leaf, Droplets, Award, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function ImpactPage() {
  const { data: metrics, isLoading: metricsLoading } = useImpactMetrics();
  const { data: trends, isLoading: trendsLoading } = useImpactTrends();

  const isLoading = metricsLoading || trendsLoading;

  const chartData = trends?.map((trend) => ({
    date: trend.date,
    value: trend.co2Saved,
  })) || [];

  const waterData = trends?.map((trend) => ({
    date: trend.date,
    value: trend.waterSaved,
  })) || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Environmental Impact"
        description="See how your actions are making a difference"
      />

      {/* XP Progress */}
      {metrics && (
        <XPProgressBar
          totalXP={metrics.totalXP}
          level={metrics.level}
          currentLevelXP={metrics.currentLevelXP}
          nextLevelXP={metrics.nextLevelXP}
        />
      )}

      {/* Impact Metrics */}
      {isLoading ? (
        <SkeletonLoader variant="card" count={4} />
      ) : metrics ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Waste Prevented"
            value={`${metrics.wastePrevented} kg`}
            icon={Leaf}
            description="Total waste prevented"
            iconColor="text-green-600"
          />
          <MetricCard
            title="CO₂ Saved"
            value={`${metrics.co2Saved} kg`}
            icon={TrendingUp}
            description="Carbon dioxide prevented"
            iconColor="text-blue-600"
          />
          <MetricCard
            title="Water Saved"
            value={`${metrics.waterSaved} L`}
            icon={Droplets}
            description="Water saved"
            iconColor="text-cyan-600"
          />
          <MetricCard
            title="Green Score"
            value={`${metrics.familyGreenScore}/100`}
            icon={Award}
            description="Family sustainability score"
            iconColor="text-[#FFD700]"
          />
        </div>
      ) : null}

      {/* Charts */}
      {isLoading ? (
        <SkeletonLoader variant="card" count={2} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TrendChart
            data={chartData}
            title="CO₂ Saved Over Time"
            type="line"
            color="hsl(142, 76%, 36%)"
          />
          <TrendChart
            data={waterData}
            title="Water Saved Over Time"
            type="bar"
            color="hsl(195, 100%, 50%)"
          />
        </div>
      )}

      {/* Impact Summary */}
      {metrics && (
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>Your Impact Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-primary mb-2">
                  {metrics.mealsDonated}
                </div>
                <div className="text-sm text-muted-foreground">Meals Donated</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-primary mb-2">
                  {metrics.totalXP.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total XP Earned</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-primary mb-2">
                  Level {metrics.level}
                </div>
                <div className="text-sm text-muted-foreground">Current Level</div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Environmental Impact Visualization */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-900">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-5xl mb-4">🌱</div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">
                  {metrics.wastePrevented} kg
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  Waste Prevented
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Equivalent to {Math.round(metrics.wastePrevented * 2.2)} lbs
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-900">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-5xl mb-4">🌍</div>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-2">
                  {metrics.co2Saved} kg
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  CO₂ Saved
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Equivalent to {Math.round(metrics.co2Saved / 4.6)} miles driven
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950/20 dark:to-cyan-900/20 border-cyan-200 dark:border-cyan-900">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-5xl mb-4">💧</div>
                <div className="text-2xl font-bold text-cyan-700 dark:text-cyan-300 mb-2">
                  {metrics.waterSaved} L
                </div>
                <div className="text-sm text-cyan-600 dark:text-cyan-400">
                  Water Saved
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Equivalent to {Math.round(metrics.waterSaved / 3.785)} gallons
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

