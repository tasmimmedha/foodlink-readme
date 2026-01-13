"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getInventoryItems,
  getExpiringSoon,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getWeeklyMeals,
  updateMealSlot,
  deleteMealSlot,
  getShoppingList,
  computeMissingItems,
  addShoppingItem,
  updateShoppingItem,
  deleteShoppingItem,
  getPriceComparisons,
  getImpactMetrics,
  getImpactTrends,
  getUnlockedBadges,
  getNextBadges,
  checkAndUnlockBadges,
  getFamilyPreferences,
  updateFamilyPreferences,
  getRecentLogs,
  getWasteAnalytics,
  getBulkBuyOpportunities,
  joinBulkBuy,
  createLog,
  updateLog,
  deleteLog,
  getDailyNutrition,
  getWeeklyNutrition,
  getNutritionWarnings,
  getNutritionSuggestions,
  getNutritionScore,
  getHealthyPlateStatus,
  getWeeklyNutritionScores,
  getNutritionBadges,
} from "@/lib/server";
import type {
  CreateInventoryItemInput,
  UpdateInventoryItemInput,
  CreateMealPlanInput,
  CreateShoppingItemInput,
  UpdateShoppingItemInput,
  UpdateFamilyPreferencesInput,
  CreateLogInput,
  UpdateLogInput,
} from "@/lib/server";

function getToken(): string {
  if (typeof window === "undefined") return "";
  // Check both token keys for compatibility
  return localStorage.getItem("auth_token") || localStorage.getItem("token") || "";
}

// Query configuration for real-time sync
const QUERY_CONFIG = {
  staleTime: 30 * 1000, // 30 seconds - data is considered fresh for 30s
  cacheTime: 5 * 60 * 1000, // 5 minutes - keep in cache for 5 minutes
  refetchOnMount: true, // Refetch when component mounts
  refetchOnWindowFocus: true, // Refetch when window regains focus
  refetchOnReconnect: true, // Refetch when network reconnects
  retry: 2, // Retry failed requests twice
};

// Inventory hooks
export function useInventory(filter?: { category?: string; expiringSoon?: boolean }) {
  const query = useQuery({
    queryKey: ["inventory", filter],
    queryFn: () => getInventoryItems(getToken(), filter),
    ...QUERY_CONFIG,
  });

  // Listen for inventory updates
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleUpdate = () => {
      query.refetch();
    };

    window.addEventListener("inventoryUpdated", handleUpdate);
    window.addEventListener("logUpdated", handleUpdate); // Logs can affect inventory

    return () => {
      window.removeEventListener("inventoryUpdated", handleUpdate);
      window.removeEventListener("logUpdated", handleUpdate);
    };
  }, [query]);

  return query;
}

export function useInventorySummary() {
  const inventoryQuery = useInventory();
  const expiringQuery = useExpiringSoon();

  const query = useQuery({
    queryKey: ["inventory", "summary"],
    queryFn: async () => {
      // Use cached data instead of refetching
      const items = inventoryQuery.data || [];
      const expiringItems = expiringQuery.data || [];

      return {
        totalItems: items.length,
        expiringSoon: expiringItems.length,
        expired: items.filter((item) => item.isExpired).length,
        expiringItems: expiringItems.map((item) => {
          const expiryDate = item.expiryDate ? new Date(item.expiryDate) : null;
          const daysUntilExpiry = expiryDate
            ? Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            : null;
          return {
            ...item,
            daysUntilExpiry: daysUntilExpiry ?? 999,
          };
        }),
      };
    },
    // Don't wait for both queries - show data as soon as we have inventory
    enabled: inventoryQuery.isSuccess,
    ...QUERY_CONFIG,
  });

  // Listen for inventory updates
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleUpdate = () => {
      query.refetch();
    };

    window.addEventListener("inventoryUpdated", handleUpdate);

    return () => {
      window.removeEventListener("inventoryUpdated", handleUpdate);
    };
  }, [query]);

  return query;
}

export function useExpiringSoon() {
  const query = useQuery({
    queryKey: ["inventory", "expiring-soon"],
    queryFn: () => getExpiringSoon(getToken()),
    ...QUERY_CONFIG,
  });

  // Listen for inventory updates
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleUpdate = () => {
      query.refetch();
    };

    window.addEventListener("inventoryUpdated", handleUpdate);

    return () => {
      window.removeEventListener("inventoryUpdated", handleUpdate);
    };
  }, [query]);

  return query;
}

export function useCreateInventoryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateInventoryItemInput) => createInventoryItem(getToken(), input),
    onSuccess: () => {
      // Invalidate and refetch all related queries for real-time sync
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["waste-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["impact-metrics"] });
      queryClient.invalidateQueries({ queryKey: ["logs"] });
      queryClient.refetchQueries({ queryKey: ["inventory"] });
      queryClient.refetchQueries({ queryKey: ["waste-analytics"] });
      queryClient.refetchQueries({ queryKey: ["impact-metrics"] });
      // Trigger custom event for cross-tab sync
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('inventoryUpdated'));
      }
    },
  });
}

export function useUpdateInventoryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateInventoryItemInput }) =>
      updateInventoryItem(getToken(), id, input),
    onSuccess: () => {
      // Invalidate and refetch all related queries for real-time sync
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["waste-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["impact-metrics"] });
      queryClient.invalidateQueries({ queryKey: ["logs"] });
      queryClient.refetchQueries({ queryKey: ["inventory"] });
      queryClient.refetchQueries({ queryKey: ["waste-analytics"] });
      queryClient.refetchQueries({ queryKey: ["impact-metrics"] });
      // Trigger custom event for cross-tab sync
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('inventoryUpdated'));
      }
    },
  });
}

export function useDeleteInventoryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteInventoryItem(getToken(), id),
    onSuccess: () => {
      // Invalidate and refetch all related queries for real-time sync
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["waste-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["impact-metrics"] });
      queryClient.invalidateQueries({ queryKey: ["logs"] });
      queryClient.refetchQueries({ queryKey: ["inventory"] });
      queryClient.refetchQueries({ queryKey: ["waste-analytics"] });
      queryClient.refetchQueries({ queryKey: ["impact-metrics"] });
      // Trigger custom event for cross-tab sync
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('inventoryUpdated'));
      }
    },
  });
}

// Meal planner hooks
export function useWeeklyMeals(startDate?: string) {
  const query = useQuery({
    queryKey: ["meal-plans", startDate],
    queryFn: () => getWeeklyMeals(getToken(), startDate),
    ...QUERY_CONFIG,
  });

  // Listen for meal plan updates
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleUpdate = () => {
      query.refetch();
    };

    window.addEventListener("mealPlanUpdated", handleUpdate);

    return () => {
      window.removeEventListener("mealPlanUpdated", handleUpdate);
    };
  }, [query]);

  return query;
}

export function useMealPlan() {
  const { data: weeklyMeals, ...rest } = useWeeklyMeals();
  
  // Transform WeeklyMealPlan to the format expected by MealPlannerWidget
  const transformedData = weeklyMeals ? {
    week: Object.keys(weeklyMeals)[0] || new Date().toISOString(),
    meals: Object.entries(weeklyMeals).map(([date, meals]) => ({
      date,
      breakfast: meals.breakfast?.name,
      lunch: meals.lunch?.name,
      dinner: meals.dinner?.name,
    })),
  } : undefined;

  return {
    ...rest,
    data: transformedData,
  };
}

export function useUpdateMealSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateMealPlanInput) => updateMealSlot(getToken(), input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-plans"] });
      queryClient.invalidateQueries({ queryKey: ["shopping-list"] });
      queryClient.invalidateQueries({ queryKey: ["nutrition"] });
      queryClient.refetchQueries({ queryKey: ["meal-plans"] });
      queryClient.refetchQueries({ queryKey: ["shopping-list"] });
      // Trigger custom event for cross-tab sync
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('mealPlanUpdated'));
      }
    },
  });
}

export function useDeleteMealSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mealId: string) => deleteMealSlot(getToken(), mealId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-plans"] });
      queryClient.invalidateQueries({ queryKey: ["shopping-list"] });
      queryClient.invalidateQueries({ queryKey: ["nutrition"] });
      queryClient.refetchQueries({ queryKey: ["meal-plans"] });
      queryClient.refetchQueries({ queryKey: ["shopping-list"] });
      // Trigger custom event for cross-tab sync
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('mealPlanUpdated'));
      }
    },
  });
}

// Shopping list hooks
export function useShoppingList(includePurchased = false) {
  const query = useQuery({
    queryKey: ["shopping-list", includePurchased],
    queryFn: () => getShoppingList(getToken(), includePurchased),
    ...QUERY_CONFIG,
  });

  // Listen for shopping list updates
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleUpdate = () => {
      query.refetch();
    };

    window.addEventListener("shoppingListUpdated", handleUpdate);
    window.addEventListener("mealPlanUpdated", handleUpdate); // Meal plans can affect shopping list

    return () => {
      window.removeEventListener("shoppingListUpdated", handleUpdate);
      window.removeEventListener("mealPlanUpdated", handleUpdate);
    };
  }, [query]);

  return query;
}

export function useSmartShoppingList() {
  const shoppingListQuery = useShoppingList(false);
  
  // Transform shopping list - show basic data first, price comparisons load separately
  return useQuery({
    queryKey: ["smart-shopping-list", shoppingListQuery.data],
    queryFn: async () => {
      const items = shoppingListQuery.data || [];
      
      // Calculate total estimated cost
      const totalEstimatedCost = items.reduce(
        (sum, item) => sum + (item.estimatedPrice || 0),
        0
      );

      // Return items without price comparisons initially for faster load
      // Price comparisons can be loaded on-demand or in background
      const itemsWithStores = items.map((item) => ({
        ...item,
        stores: [], // Will be populated separately if needed
      }));

      // Calculate savings estimate (simplified - 10% of total)
      const savings = totalEstimatedCost * 0.1;
      const bestStore = "FreshMart"; // Default store name

      return {
        items: itemsWithStores,
        totalEstimatedCost,
        bestStore,
        savings: Number(savings.toFixed(2)),
      };
    },
    enabled: !shoppingListQuery.isLoading && !!shoppingListQuery.data,
    ...QUERY_CONFIG,
  });
}

export function useComputeMissingItems() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => computeMissingItems(getToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-list"] });
      queryClient.invalidateQueries({ queryKey: ["smart-shopping-list"] });
      queryClient.refetchQueries({ queryKey: ["shopping-list"] });
      queryClient.refetchQueries({ queryKey: ["smart-shopping-list"] });
      // Trigger custom event for cross-tab sync
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('shoppingListUpdated'));
      }
    },
  });
}

export function useAddShoppingItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateShoppingItemInput) => addShoppingItem(getToken(), input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-list"] });
      queryClient.invalidateQueries({ queryKey: ["smart-shopping-list"] });
      queryClient.refetchQueries({ queryKey: ["shopping-list"] });
      queryClient.refetchQueries({ queryKey: ["smart-shopping-list"] });
      // Trigger custom event for cross-tab sync
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('shoppingListUpdated'));
      }
    },
  });
}

export function useUpdateShoppingItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateShoppingItemInput }) =>
      updateShoppingItem(getToken(), id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-list"] });
      queryClient.invalidateQueries({ queryKey: ["smart-shopping-list"] });
      queryClient.refetchQueries({ queryKey: ["shopping-list"] });
      queryClient.refetchQueries({ queryKey: ["smart-shopping-list"] });
      // Trigger custom event for cross-tab sync
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('shoppingListUpdated'));
      }
    },
  });
}

export function useDeleteShoppingItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteShoppingItem(getToken(), id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-list"] });
      queryClient.invalidateQueries({ queryKey: ["smart-shopping-list"] });
      queryClient.refetchQueries({ queryKey: ["shopping-list"] });
      queryClient.refetchQueries({ queryKey: ["smart-shopping-list"] });
      // Trigger custom event for cross-tab sync
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('shoppingListUpdated'));
      }
    },
  });
}

export function usePriceComparisons(itemName: string) {
  return useQuery({
    queryKey: ["price-comparisons", itemName],
    queryFn: () => getPriceComparisons(getToken(), itemName),
    enabled: !!itemName,
    ...QUERY_CONFIG,
  });
}

// Impact hooks
export function useImpactMetrics() {
  const query = useQuery({
    queryKey: ["impact-metrics"],
    queryFn: () => getImpactMetrics(getToken()),
    ...QUERY_CONFIG,
  });

  // Listen for updates that affect impact metrics
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleUpdate = () => {
      query.refetch();
    };

    window.addEventListener("inventoryUpdated", handleUpdate);
    window.addEventListener("logUpdated", handleUpdate);
    window.addEventListener("badgesUpdated", handleUpdate);

    return () => {
      window.removeEventListener("inventoryUpdated", handleUpdate);
      window.removeEventListener("logUpdated", handleUpdate);
      window.removeEventListener("badgesUpdated", handleUpdate);
    };
  }, [query]);

  return query;
}

export function useEnvironmentalImpact() {
  const { data: metrics, ...rest } = useImpactMetrics();
  
  return {
    ...rest,
    data: metrics ? {
      ...metrics,
      // Map property names to match component expectations
      co2Prevented: metrics.co2Saved,
      wasteReduced: metrics.wastePrevented,
      waterSaved: metrics.waterSaved,
      xpProgress: metrics.nextLevelXP > 0 
        ? (metrics.currentLevelXP / metrics.nextLevelXP) * 100 
        : 0,
      xpPoints: metrics.totalXP,
      level: metrics.level,
    } : undefined,
  };
}

export function useImpactTrends() {
  return useQuery({
    queryKey: ["impact-trends"],
    queryFn: () => getImpactTrends(getToken()),
    ...QUERY_CONFIG,
  });
}

// Badges hooks
export function useUnlockedBadges() {
  return useQuery({
    queryKey: ["badges", "unlocked"],
    queryFn: () => getUnlockedBadges(getToken()),
    ...QUERY_CONFIG,
  });
}

export function useNextBadges() {
  return useQuery({
    queryKey: ["badges", "next"],
    queryFn: () => getNextBadges(getToken()),
    ...QUERY_CONFIG,
  });
}

export function useCheckAndUnlockBadges() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => checkAndUnlockBadges(getToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["badges"] });
      queryClient.invalidateQueries({ queryKey: ["impact-metrics"] });
      queryClient.refetchQueries({ queryKey: ["badges"] });
      queryClient.refetchQueries({ queryKey: ["impact-metrics"] });
      // Trigger custom event for cross-tab sync
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('badgesUpdated'));
      }
    },
  });
}

// Family preferences hooks
export function useFamilyPreferences() {
  return useQuery({
    queryKey: ["family-preferences"],
    queryFn: () => getFamilyPreferences(getToken()),
    ...QUERY_CONFIG,
  });
}

export function useUpdateFamilyPreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateFamilyPreferencesInput) =>
      updateFamilyPreferences(getToken(), input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["family-preferences"] });
      queryClient.refetchQueries({ queryKey: ["family-preferences"] });
      // Trigger custom event for cross-tab sync
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('preferencesUpdated'));
      }
    },
  });
}

// Logs hooks
export function useRecentLogs(days = 7) {
  const query = useQuery({
    queryKey: ["logs", "recent", days],
    queryFn: () => getRecentLogs(getToken(), days),
    ...QUERY_CONFIG,
  });

  // Listen for log updates
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleLogUpdate = () => {
      query.refetch();
    };

    window.addEventListener("logUpdated", handleLogUpdate);
    window.addEventListener("inventoryUpdated", handleLogUpdate); // Logs depend on inventory

    return () => {
      window.removeEventListener("logUpdated", handleLogUpdate);
      window.removeEventListener("inventoryUpdated", handleLogUpdate);
    };
  }, [query]);

  return query;
}

export function useCreateLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateLogInput) => createLog(getToken(), input),
    onSuccess: () => {
      // Invalidate and refetch all related queries
      queryClient.invalidateQueries({ queryKey: ["logs"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["waste-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["impact-metrics"] });
      queryClient.refetchQueries({ queryKey: ["logs"] });
      queryClient.refetchQueries({ queryKey: ["inventory"] });
      queryClient.refetchQueries({ queryKey: ["waste-analytics"] });
      queryClient.refetchQueries({ queryKey: ["impact-metrics"] });
      // Trigger custom event for cross-tab sync
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('logUpdated'));
        window.dispatchEvent(new CustomEvent('inventoryUpdated'));
      }
    },
  });
}

export function useUpdateLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateLogInput }) =>
      updateLog(getToken(), id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logs"] });
      queryClient.invalidateQueries({ queryKey: ["waste-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["impact-metrics"] });
      queryClient.refetchQueries({ queryKey: ["logs"] });
      queryClient.refetchQueries({ queryKey: ["waste-analytics"] });
      queryClient.refetchQueries({ queryKey: ["impact-metrics"] });
      // Trigger custom event for cross-tab sync
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('logUpdated'));
      }
    },
  });
}

export function useDeleteLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteLog(getToken(), id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logs"] });
      queryClient.invalidateQueries({ queryKey: ["waste-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["impact-metrics"] });
      queryClient.refetchQueries({ queryKey: ["logs"] });
      queryClient.refetchQueries({ queryKey: ["waste-analytics"] });
      queryClient.refetchQueries({ queryKey: ["impact-metrics"] });
      // Trigger custom event for cross-tab sync
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('logUpdated'));
      }
    },
  });
}

export function useWasteAnalytics() {
  const query = useQuery({
    queryKey: ["waste-analytics"],
    queryFn: () => getWasteAnalytics(getToken()),
    ...QUERY_CONFIG,
  });

  // Listen for updates that affect waste analytics
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleUpdate = () => {
      query.refetch();
    };

    window.addEventListener("inventoryUpdated", handleUpdate);
    window.addEventListener("logUpdated", handleUpdate);

    return () => {
      window.removeEventListener("inventoryUpdated", handleUpdate);
      window.removeEventListener("logUpdated", handleUpdate);
    };
  }, [query]);

  return query;
}

// Bulk Buy Opportunities hooks
export function useBulkBuyOpportunities() {
  const query = useQuery({
    queryKey: ["bulk-buy-opportunities"],
    queryFn: () => getBulkBuyOpportunities(getToken()),
    ...QUERY_CONFIG,
  });

  // Listen for storage events to sync across tabs/pages
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith("bulk_buy_")) {
        // Refetch when bulk buy participation changes
        query.refetch();
      }
    };

    const handleCustomEvent = () => {
      // Refetch when bulk buy is updated in same tab
      query.refetch();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("bulkBuyUpdated", handleCustomEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("bulkBuyUpdated", handleCustomEvent);
    };
  }, [query]);

  return query;
}

export function useJoinBulkBuy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (opportunityId: string) => joinBulkBuy(getToken(), opportunityId),
    onSuccess: () => {
      // Invalidate and refetch bulk buy opportunities immediately
      queryClient.invalidateQueries({ queryKey: ["bulk-buy-opportunities"] });
      queryClient.refetchQueries({ queryKey: ["bulk-buy-opportunities"] });
    },
  });
}

// Nutrition hooks
export function useDailyNutrition(date?: string) {
  return useQuery({
    queryKey: ["nutrition", "daily", date],
    queryFn: () => getDailyNutrition(getToken(), date),
    ...QUERY_CONFIG,
  });
}

export function useWeeklyNutrition() {
  return useQuery({
    queryKey: ["nutrition", "weekly"],
    queryFn: () => getWeeklyNutrition(getToken()),
    ...QUERY_CONFIG,
  });
}

export function useNutritionWarnings() {
  return useQuery({
    queryKey: ["nutrition", "warnings"],
    queryFn: () => getNutritionWarnings(getToken()),
    ...QUERY_CONFIG,
  });
}

export function useNutritionSuggestions() {
  return useQuery({
    queryKey: ["nutrition", "suggestions"],
    queryFn: () => getNutritionSuggestions(getToken()),
    ...QUERY_CONFIG,
  });
}

export function useNutritionScore(date?: string) {
  return useQuery({
    queryKey: ["nutrition", "score", date],
    queryFn: () => getNutritionScore(getToken(), date),
    ...QUERY_CONFIG,
  });
}

export function useHealthyPlateStatus() {
  return useQuery({
    queryKey: ["nutrition", "healthy-plate"],
    queryFn: () => getHealthyPlateStatus(getToken()),
    ...QUERY_CONFIG,
  });
}

export function useWeeklyNutritionScores() {
  return useQuery({
    queryKey: ["nutrition", "weekly-scores"],
    queryFn: () => getWeeklyNutritionScores(getToken()),
    ...QUERY_CONFIG,
  });
}

export function useNutritionBadges() {
  return useQuery({
    queryKey: ["nutrition", "badges"],
    queryFn: () => getNutritionBadges(getToken()),
    ...QUERY_CONFIG,
  });
}
