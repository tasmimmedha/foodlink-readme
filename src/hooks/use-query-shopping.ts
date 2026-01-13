"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getShoppingListItems,
  getShoppingListItem,
  createShoppingListItem,
  updateShoppingListItem,
  deleteShoppingListItem,
  toggleShoppingListItem,
  type CreateShoppingListItemDto,
  type UpdateShoppingListItemDto,
} from "@/modules/shopping-list/shopping.service";

export function useShoppingListItems() {
  return useQuery({
    queryKey: ["shopping-list"],
    queryFn: getShoppingListItems,
  });
}

export function useShoppingListItem(id: string) {
  return useQuery({
    queryKey: ["shopping-list", id],
    queryFn: () => getShoppingListItem(id),
    enabled: !!id,
  });
}

export function useCreateShoppingListItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createShoppingListItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-list"] });
    },
  });
}

export function useUpdateShoppingListItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateShoppingListItemDto }) =>
      updateShoppingListItem(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["shopping-list"] });
      queryClient.invalidateQueries({ queryKey: ["shopping-list", variables.id] });
    },
  });
}

export function useDeleteShoppingListItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteShoppingListItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-list"] });
    },
  });
}

export function useToggleShoppingListItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleShoppingListItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-list"] });
    },
  });
}

