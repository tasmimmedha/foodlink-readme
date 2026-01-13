"use client";

import { useQuery } from "@tanstack/react-query";
import { getAnalytics, getDashboardStats, getWasteReport } from "@/modules/analytics/analytics.service";

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: getAnalytics,
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["analytics", "dashboard"],
    queryFn: getDashboardStats,
  });
}

export function useWasteReport(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ["analytics", "waste", startDate, endDate],
    queryFn: () => getWasteReport(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
}

