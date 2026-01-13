"use client";

import { PageHeader } from "@/components/shared/page-header";
import { TrendChart } from "@/components/family/TrendChart";
import { MetricCard } from "@/components/family/MetricCard";
import { useImpactTrends, useInventory, useWasteAnalytics, useRecentLogs } from "@/hooks/use-query-family";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import { TrendingDown, Package, Trash2, DollarSign, PieChart, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";

export default function AnalyticsPage() {
  const { data: trends, isLoading: trendsLoading } = useImpactTrends();
  const { data: inventory, isLoading: inventoryLoading } = useInventory();
  const { data: wasteAnalytics, isLoading: wasteLoading } = useWasteAnalytics();
  const { data: logs, isLoading: logsLoading } = useRecentLogs(30);

  const isLoading = trendsLoading || inventoryLoading || wasteLoading || logsLoading;

  // Calculate analytics from data
  const totalItems = inventory?.length || 0;
  const expiringItems = inventory?.filter((item) => item.isExpiringSoon).length || 0;
  const expiredItems = inventory?.filter((item) => item.isExpired).length || 0;

  const wasteReduction = trends && trends.length > 0
    ? Math.round(((trends[trends.length - 1].wastePrevented - trends[0].wastePrevented) / trends[0].wastePrevented) * 100)
    : 0;

  const chartData = trends?.map((trend) => ({
    date: trend.date,
    value: trend.wastePrevented,
  })) || [];

  const co2Data = trends?.map((trend) => ({
    date: trend.date,
    value: trend.co2Saved,
  })) || [];

  // Category distribution
  const categoryData = inventory?.reduce((acc, item) => {
    const cat = item.category || "Other";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  }));

  // Waste by category
  const wasteByCategory = logs?.reduce((acc, log) => {
    if (log.wasWasted) {
      const cat = log.category || "Other";
      acc[cat] = (acc[cat] || 0) + (log.quantity || 0);
    }
    return acc;
  }, {} as Record<string, number>) || {};

  const wasteChartData = Object.entries(wasteByCategory).map(([name, value]) => ({
    name,
    value: Number((value / 1000).toFixed(2)), // Convert to kg
  }));

  const COLORS = ["#22c55e", "#16a34a", "#10b981", "#059669", "#047857", "#065f46"];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Track your food consumption and waste reduction"
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Items"
          value={totalItems}
          icon={Package}
          description="Items in inventory"
        />
        <MetricCard
          title="Expiring Soon"
          value={expiringItems}
          icon={TrendingDown}
          description="Items expiring in 3 days"
          trend={expiringItems > 0 ? { value: Math.round((expiringItems / totalItems) * 100), isPositive: false } : undefined}
        />
        <MetricCard
          title="Expired Items"
          value={expiredItems}
          icon={Trash2}
          description="Items that expired"
          trend={expiredItems > 0 ? { value: Math.round((expiredItems / totalItems) * 100), isPositive: false } : undefined}
        />
        <MetricCard
          title="Waste Reduction"
          value={`${Math.abs(wasteReduction)}%`}
          icon={DollarSign}
          description="This month"
          trend={wasteReduction < 0 ? { value: Math.abs(wasteReduction), isPositive: true } : undefined}
        />
      </div>

      {/* Charts */}
      {isLoading ? (
        <SkeletonLoader variant="card" count={3} />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrendChart
              data={chartData}
              title="Waste Prevented (kg)"
              type="line"
              color="hsl(142, 76%, 36%)"
            />
            <TrendChart
              data={co2Data}
              title="CO₂ Saved (kg)"
              type="bar"
              color="hsl(142, 76%, 50%)"
            />
          </div>

          {/* Category Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {categoryChartData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Inventory by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={categoryChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {wasteChartData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Waste by Category (kg)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={wasteChartData}>
                      <XAxis dataKey="name" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="value" fill="hsl(0, 84%, 60%)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}

      {/* Waste Analytics Summary */}
      {wasteAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {wasteAnalytics.wastePrevented} kg
                </div>
                <div className="text-sm text-muted-foreground">Waste Prevented</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {wasteAnalytics.leftoverUsage}%
                </div>
                <div className="text-sm text-muted-foreground">Leftover Usage Rate</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {wasteAnalytics.monthlyFoodUsageScore}/100
                </div>
                <div className="text-sm text-muted-foreground">Usage Score</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {wasteReduction < 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900"
              >
                <p className="font-semibold text-green-800 dark:text-green-200">
                  🎉 Great Progress!
                </p>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  You've reduced waste by {Math.abs(wasteReduction)}% this month. Keep it up!
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900"
              >
                <p className="font-semibold text-blue-800 dark:text-blue-200">
                  💡 Tip
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Plan your meals better to reduce waste. Use the meal planner to make the most of your inventory.
                </p>
              </motion.div>
            )}

            {wasteAnalytics && wasteAnalytics.monthlyFoodUsageScore < 70 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900"
              >
                <p className="font-semibold text-orange-800 dark:text-orange-200">
                  ⚠️ Improvement Opportunity
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                  Your usage score is {wasteAnalytics.monthlyFoodUsageScore}/100. Try planning meals around items that are expiring soon to improve your score.
                </p>
              </motion.div>
            )}

            {expiringItems > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900"
              >
                <p className="font-semibold text-yellow-800 dark:text-yellow-200">
                  ⏰ Action Needed
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  You have {expiringItems} items expiring soon. Plan meals using these items to prevent waste.
                </p>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

