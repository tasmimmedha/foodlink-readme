"use client";

import { KPIWidget } from "@/components/shared/kpi-widget";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Users, Package, BarChart3, Activity, Link2 } from "lucide-react";
import { useSystemStats, useUserAnalytics, useFoodAnalytics, useWasteAnalytics } from "@/hooks/use-query-admin";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#10b981", "#14b8a6", "#059669", "#0d9488", "#34d399", "#5eead4"]; // Emerald/Teal theme

export default function AdminDashboardPage() {
  const { data: systemStats, isLoading: statsLoading } = useSystemStats();
  const { data: userAnalytics, isLoading: userLoading } = useUserAnalytics();
  const { data: foodAnalytics, isLoading: foodLoading } = useFoodAnalytics();
  const { data: wasteAnalytics, isLoading: wasteLoading } = useWasteAnalytics();

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed max-w-2xl">
          Comprehensive overview of FoodFlow platform metrics and analytics
        </p>
      </div>

      {/* System Stats Cards */}
      {statsLoading ? (
        <SkeletonLoader variant="card" count={4} />
      ) : (
        <KPIWidget
          kpis={[
            {
              title: "Total Users",
              value: systemStats?.totalUsers || 0,
              icon: Users,
              description: `${userAnalytics?.newRegistrations.last7Days || 0} new in last 7 days`,
            },
            {
              title: "Food Items",
              value: systemStats?.totalFoodItems || 0,
              icon: Package,
              description: "In catalog",
            },
            {
              title: "Inventory Items",
              value: systemStats?.totalInventoryItems || 0,
              icon: Activity,
              description: "Across all users",
            },
            {
              title: "Consumption Logs",
              value: systemStats?.totalConsumptionLogs || 0,
              icon: BarChart3,
              description: "Total entries",
            },
          ]}
        />
      )}

      {/* User Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="rounded-2xl border-2 hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Active Users</CardTitle>
              <CardDescription>User activity over time</CardDescription>
            </CardHeader>
            <CardContent>
              {userLoading ? (
                <SkeletonLoader variant="text" count={3} />
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {userAnalytics?.activeUsers.daily || 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Daily Active</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {userAnalytics?.activeUsers.weekly || 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Weekly Active</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {userAnalytics?.activeUsers.monthly || 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Monthly Active</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="rounded-2xl border-2 hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>New registrations trend</CardDescription>
            </CardHeader>
            <CardContent>
              {userLoading ? (
                <SkeletonLoader variant="text" count={3} />
              ) : userAnalytics?.userGrowth ? (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={userAnalytics.userGrowth.slice(-14)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : null}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Food Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="rounded-2xl border-2 hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Popular Foods</CardTitle>
              <CardDescription>Most frequently used food items</CardDescription>
            </CardHeader>
            <CardContent>
              {foodLoading ? (
                <SkeletonLoader variant="text" count={5} />
              ) : foodAnalytics?.popularFoods && foodAnalytics.popularFoods.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={foodAnalytics.popularFoods.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="usageCount" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="rounded-2xl border-2 hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
              <CardDescription>Food consumption by category</CardDescription>
            </CardHeader>
            <CardContent>
              {foodLoading ? (
                <SkeletonLoader variant="text" count={5} />
              ) : foodAnalytics?.categoryTrends && foodAnalytics.categoryTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={foodAnalytics.categoryTrends}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, consumptionCount }) => `${category}: ${consumptionCount}`}
                      outerRadius={80}
                      fill="#10b981"
                      dataKey="consumptionCount"
                    >
                      {foodAnalytics.categoryTrends.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Waste Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card className="rounded-2xl border-2 hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Waste Prevention Impact</CardTitle>
            <CardDescription>Community impact metrics</CardDescription>
          </CardHeader>
          <CardContent>
            {wasteLoading ? (
              <SkeletonLoader variant="text" count={4} />
            ) : wasteAnalytics ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {wasteAnalytics.totalWastePrevented.toFixed(1)} kg
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Waste Prevented</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {wasteAnalytics.communityImpact.totalSurplusShared.toFixed(1)} kg
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Surplus Shared</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {wasteAnalytics.communityImpact.totalMealsProvided}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Meals Provided</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {wasteAnalytics.communityImpact.co2Prevented.toFixed(1)} kg
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">CO₂ Prevented</p>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Card className="rounded-2xl border-2 hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.a
                href="/admin/foods"
                whileHover={{ y: -4, scale: 1.02 }}
                className="flex flex-col items-center justify-center p-6 border-2 rounded-2xl hover:shadow-lg transition-all duration-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
              >
                <Package className="h-8 w-8 mb-2 text-primary" />
                <span className="text-sm font-medium">Manage Foods</span>
              </motion.a>
              <motion.a
                href="/admin/users"
                whileHover={{ y: -4, scale: 1.02 }}
                className="flex flex-col items-center justify-center p-6 border-2 rounded-2xl hover:shadow-lg transition-all duration-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
              >
                <Users className="h-8 w-8 mb-2 text-primary" />
                <span className="text-sm font-medium">Manage Users</span>
              </motion.a>
              <motion.a
                href="/admin/analytics"
                whileHover={{ y: -4, scale: 1.02 }}
                className="flex flex-col items-center justify-center p-6 border-2 rounded-2xl hover:shadow-lg transition-all duration-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
              >
                <BarChart3 className="h-8 w-8 mb-2 text-primary" />
                <span className="text-sm font-medium">View Analytics</span>
              </motion.a>
              <motion.a
                href="/admin/settings"
                whileHover={{ y: -4, scale: 1.02 }}
                className="flex flex-col items-center justify-center p-6 border-2 rounded-2xl hover:shadow-lg transition-all duration-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
              >
                <Shield className="h-8 w-8 mb-2 text-primary" />
                <span className="text-sm font-medium">Settings</span>
              </motion.a>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
