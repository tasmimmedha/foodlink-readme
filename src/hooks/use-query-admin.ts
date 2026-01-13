import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSystemStats,
  getUserAnalytics,
  getFoodAnalytics,
  getNutritionAnalytics,
  getWasteAnalytics,
  getBusinessAnalytics,
} from "@/lib/server/admin/admin.analytics.server";
import {
  getFoodItems,
  getFoodItemsWithStats,
  getFoodItemById,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
  bulkDeleteFoodItems,
  getCategories,
  getCategoryStats,
} from "@/lib/server/admin/admin.foods.server";
import {
  getUsers,
  getUsersWithStats,
  getUserById,
  getUserWithDetailedStats,
  updateUser,
  deleteUser,
  resetUserData,
} from "@/lib/server/admin/admin.users.server";

// Analytics hooks
export function useSystemStats() {
  return useQuery({
    queryKey: ["admin", "system-stats"],
    queryFn: getSystemStats,
  });
}

export function useUserAnalytics() {
  return useQuery({
    queryKey: ["admin", "user-analytics"],
    queryFn: getUserAnalytics,
  });
}

export function useFoodAnalytics() {
  return useQuery({
    queryKey: ["admin", "food-analytics"],
    queryFn: getFoodAnalytics,
  });
}

export function useNutritionAnalytics() {
  return useQuery({
    queryKey: ["admin", "nutrition-analytics"],
    queryFn: getNutritionAnalytics,
  });
}

export function useWasteAnalytics() {
  return useQuery({
    queryKey: ["admin", "waste-analytics"],
    queryFn: getWasteAnalytics,
  });
}

export function useBusinessAnalytics() {
  return useQuery({
    queryKey: ["admin", "business-analytics"],
    queryFn: getBusinessAnalytics,
  });
}

// Food items hooks
export function useFoodItems(filters?: { category?: string; search?: string }) {
  return useQuery({
    queryKey: ["admin", "food-items", filters],
    queryFn: () => getFoodItems(filters),
  });
}

export function useFoodItemsWithStats() {
  return useQuery({
    queryKey: ["admin", "food-items-stats"],
    queryFn: getFoodItemsWithStats,
  });
}

export function useFoodItem(id: string) {
  return useQuery({
    queryKey: ["admin", "food-item", id],
    queryFn: () => getFoodItemById(id),
    enabled: !!id,
  });
}

export function useCreateFoodItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFoodItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "food-items"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "food-items-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "food-analytics"] });
    },
  });
}

export function useUpdateFoodItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateFoodItem>[1] }) =>
      updateFoodItem(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "food-items"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "food-item", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "food-items-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "food-analytics"] });
    },
  });
}

export function useDeleteFoodItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFoodItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "food-items"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "food-items-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "food-analytics"] });
    },
  });
}

export function useBulkDeleteFoodItems() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkDeleteFoodItems,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "food-items"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "food-items-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "food-analytics"] });
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["admin", "categories"],
    queryFn: getCategories,
  });
}

export function useCategoryStats() {
  return useQuery({
    queryKey: ["admin", "category-stats"],
    queryFn: getCategoryStats,
  });
}

// Users hooks
export function useUsers(filters?: { search?: string; role?: string }) {
  return useQuery({
    queryKey: ["admin", "users", filters],
    queryFn: () => getUsers(filters),
  });
}

export function useUsersWithStats() {
  return useQuery({
    queryKey: ["admin", "users-stats"],
    queryFn: getUsersWithStats,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ["admin", "user", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
}

export function useUserWithStats(id: string) {
  return useQuery({
    queryKey: ["admin", "user-stats", id],
    queryFn: () => getUserWithDetailedStats(id),
    enabled: !!id,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateUser>[1] }) =>
      updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "user", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "user-stats", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "user-analytics"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "user-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "system-stats"] });
    },
  });
}

export function useResetUserData() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resetUserData,
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "user-stats", userId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users-stats"] });
    },
  });
}

