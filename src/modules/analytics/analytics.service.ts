import { apiGet } from "@/lib/api-client";

export interface AnalyticsData {
  totalItems: number;
  expiringSoon: number;
  expired: number;
  totalWaste: number;
  wasteReduction: number;
  topCategories: Array<{
    category: string;
    count: number;
  }>;
  monthlyWaste: Array<{
    month: string;
    waste: number;
  }>;
  consumptionTrends: Array<{
    date: string;
    consumed: number;
    wasted: number;
  }>;
}

export interface DashboardStats {
  inventoryItems: number;
  shoppingListItems: number;
  expiringItems: number;
  communityPosts: number;
}

export async function getAnalytics(): Promise<AnalyticsData> {
  return apiGet<AnalyticsData>("/analytics");
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return apiGet<DashboardStats>("/analytics/dashboard");
}

export async function getWasteReport(startDate: string, endDate: string): Promise<AnalyticsData> {
  return apiGet<AnalyticsData>(`/analytics/waste?startDate=${startDate}&endDate=${endDate}`);
}

