"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getInventory as getShopInventory,
  addSKU,
  updateSKU,
  deleteSKU,
  getExpiringItems,
  getMarkdownCandidates,
} from "@/lib/server/shop.inventory.server";
import { getPriceMap, updatePrice, generateDiscountSuggestions } from "@/lib/server/shop.pricing.server";
import {
  getSurplusQueue,
  addSurplusItem,
  assignSurplusToNGO,
  updateSurplusStatus,
} from "@/lib/server/shop.surplus.server";
import {
  getWasteTrends,
  getMarkdownRecovery,
  getCategoryWasteBreakdown,
  getRetailImpactKPIs,
} from "@/lib/server/shop.analytics.server";
import {
  getStaff,
  getStaffTasks,
  addTask,
  toggleTask,
  getShifts,
  updateShift,
} from "@/lib/server/shop.staff.server";
import { getShopProfile, updateShopProfile } from "@/lib/server/shop.profile.server";
import type {
  ShopPriceMapEntry,
  ShopDiscountSuggestion,
  ShopSurplusItem,
  ShopStaffMember,
  ShopStaffTask,
  ShopShift,
  ShopProfile,
} from "@/lib/server";
import type {
  AddSKUInput,
  UpdateSKUInput,
} from "@/lib/server/shop.inventory.server";
import type { UpdatePriceInput } from "@/lib/server/shop.pricing.server";
import type {
  AddSurplusInput,
  AssignSurplusInput,
} from "@/lib/server/shop.surplus.server";
import type { AddTaskInput, UpdateShiftInput } from "@/lib/server/shop.staff.server";

// Inventory hooks

export function useShopInventory(
  filters?: Parameters<typeof getShopInventory>[0],
  options?: { enabled?: boolean }
) {
  const query = useQuery({
    queryKey: ["shop", "inventory", filters],
    queryFn: () => getShopInventory(filters),
    enabled: options?.enabled !== false,
  });

  // Listen for inventory updates
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleUpdate = () => query.refetch();
    window.addEventListener("shopInventoryUpdated", handleUpdate);
    return () => window.removeEventListener("shopInventoryUpdated", handleUpdate);
  }, [query]);

  return query;
}

export function useAddSKU() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AddSKUInput) => addSKU(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop", "inventory"] });
      queryClient.invalidateQueries({ queryKey: ["shop", "inventory", "expiring"] });
      queryClient.refetchQueries({ queryKey: ["shop", "inventory"] });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('shopInventoryUpdated'));
      }
    },
  });
}

export function useUpdateSKU() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSKUInput }) => updateSKU(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop", "inventory"] });
      queryClient.invalidateQueries({ queryKey: ["shop", "inventory", "markdown"] });
      queryClient.refetchQueries({ queryKey: ["shop", "inventory"] });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('shopInventoryUpdated'));
      }
    },
  });
}

export function useDeleteSKU() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSKU(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop", "inventory"] });
      queryClient.refetchQueries({ queryKey: ["shop", "inventory"] });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('shopInventoryUpdated'));
      }
    },
  });
}

export function useExpiringItems(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryKey: ["shop", "inventory", "expiring"],
    queryFn: getExpiringItems,
    enabled: options?.enabled !== false,
  });

  // Listen for inventory updates
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleUpdate = () => query.refetch();
    window.addEventListener("shopInventoryUpdated", handleUpdate);
    return () => window.removeEventListener("shopInventoryUpdated", handleUpdate);
  }, [query]);

  return query;
}

export function useMarkdownCandidates(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["shop", "inventory", "markdown"],
    queryFn: getMarkdownCandidates,
    enabled: options?.enabled !== false,
  });
}

// Pricing hooks

export function usePriceMap() {
  return useQuery<ShopPriceMapEntry[]>({
    queryKey: ["shop", "pricing", "map"],
    queryFn: getPriceMap,
  });
}

export function useUpdatePrice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdatePriceInput) => updatePrice(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop", "pricing", "map"] });
      queryClient.invalidateQueries({ queryKey: ["shop", "inventory"] });
      queryClient.invalidateQueries({ queryKey: ["shop", "inventory", "markdown"] });
      queryClient.refetchQueries({ queryKey: ["shop", "pricing", "map"] });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('shopPricingUpdated'));
        window.dispatchEvent(new CustomEvent('shopInventoryUpdated'));
      }
    },
  });
}

export function useDiscountSuggestions() {
  return useQuery<ShopDiscountSuggestion[]>({
    queryKey: ["shop", "pricing", "suggestions"],
    queryFn: generateDiscountSuggestions,
  });
}

// Surplus hooks

export function useSurplusQueue(options?: { enabled?: boolean }) {
  const query = useQuery<ShopSurplusItem[]>({
    queryKey: ["shop", "surplus", "queue"],
    queryFn: getSurplusQueue,
    enabled: options?.enabled !== false,
  });

  // Listen for surplus updates
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleUpdate = () => query.refetch();
    window.addEventListener("shopSurplusUpdated", handleUpdate);
    return () => window.removeEventListener("shopSurplusUpdated", handleUpdate);
  }, [query]);

  return query;
}

export function useAddSurplusItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AddSurplusInput) => addSurplusItem(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop", "surplus", "queue"] });
      queryClient.refetchQueries({ queryKey: ["shop", "surplus", "queue"] });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('shopSurplusUpdated'));
      }
    },
  });
}

export function useAssignSurplus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, assignment }: { id: string; assignment: AssignSurplusInput }) =>
      assignSurplusToNGO(id, assignment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop", "surplus", "queue"] });
      queryClient.refetchQueries({ queryKey: ["shop", "surplus", "queue"] });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('shopSurplusUpdated'));
      }
    },
  });
}

export function useUpdateSurplusStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ShopSurplusItem["status"] }) =>
      updateSurplusStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop", "surplus", "queue"] });
      queryClient.refetchQueries({ queryKey: ["shop", "surplus", "queue"] });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('shopSurplusUpdated'));
      }
    },
  });
}

// Analytics hooks

export function useWasteTrends(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["shop", "analytics", "wasteTrend"],
    queryFn: getWasteTrends,
    enabled: options?.enabled !== false,
  });
}

export function useMarkdownRecoveryTrend(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["shop", "analytics", "markdownRecovery"],
    queryFn: getMarkdownRecovery,
    enabled: options?.enabled !== false,
  });
}

export function useWasteBreakdowns() {
  return useQuery({
    queryKey: ["shop", "analytics", "breakdown"],
    queryFn: getCategoryWasteBreakdown,
  });
}

export function useRetailImpactKPIs() {
  return useQuery({
    queryKey: ["shop", "analytics", "kpis"],
    queryFn: getRetailImpactKPIs,
  });
}

// Staff hooks

export function useShopStaff() {
  return useQuery<ShopStaffMember[]>({
    queryKey: ["shop", "staff", "list"],
    queryFn: getStaff,
  });
}

export function useStaffTasks() {
  return useQuery<ShopStaffTask[]>({
    queryKey: ["shop", "staff", "tasks"],
    queryFn: getStaffTasks,
  });
}

export function useAddStaffTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AddTaskInput) => addTask(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop", "staff", "tasks"] });
      queryClient.refetchQueries({ queryKey: ["shop", "staff", "tasks"] });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('shopStaffTasksUpdated'));
      }
    },
  });
}

export function useToggleStaffTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => toggleTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop", "staff", "tasks"] });
      queryClient.refetchQueries({ queryKey: ["shop", "staff", "tasks"] });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('shopStaffTasksUpdated'));
      }
    },
  });
}

export function useShopShifts() {
  return useQuery<ShopShift[]>({
    queryKey: ["shop", "staff", "shifts"],
    queryFn: getShifts,
  });
}

export function useUpdateShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateShiftInput }) =>
      updateShift(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop", "staff", "shifts"] });
      queryClient.refetchQueries({ queryKey: ["shop", "staff", "shifts"] });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('shopShiftsUpdated'));
      }
    },
  });
}

// Profile hooks

export function useShopProfile(options?: { enabled?: boolean }) {
  return useQuery<ShopProfile | null>({
    queryKey: ["shop", "profile"],
    queryFn: getShopProfile,
    enabled: options?.enabled !== false,
  });
}

export function useUpdateShopProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ShopProfile>) => updateShopProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop", "profile"] });
      queryClient.refetchQueries({ queryKey: ["shop", "profile"] });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('shopProfileUpdated'));
      }
    },
  });
}
