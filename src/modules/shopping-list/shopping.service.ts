import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/lib/api-client";

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  unit?: string;
  category?: string;
  priority?: "low" | "medium" | "high";
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShoppingListItemDto {
  name: string;
  quantity: number;
  unit?: string;
  category?: string;
  priority?: "low" | "medium" | "high";
}

export interface UpdateShoppingListItemDto extends Partial<CreateShoppingListItemDto> {
  completed?: boolean;
}

export async function getShoppingListItems(): Promise<ShoppingListItem[]> {
  return apiGet<ShoppingListItem[]>("/shopping-list");
}

export async function getShoppingListItem(id: string): Promise<ShoppingListItem> {
  return apiGet<ShoppingListItem>(`/shopping-list/${id}`);
}

export async function createShoppingListItem(
  data: CreateShoppingListItemDto
): Promise<ShoppingListItem> {
  return apiPost<ShoppingListItem, CreateShoppingListItemDto>("/shopping-list", data);
}

export async function updateShoppingListItem(
  id: string,
  data: UpdateShoppingListItemDto
): Promise<ShoppingListItem> {
  return apiPatch<ShoppingListItem, UpdateShoppingListItemDto>(`/shopping-list/${id}`, data);
}

export async function deleteShoppingListItem(id: string): Promise<void> {
  return apiDelete<void>(`/shopping-list/${id}`);
}

export async function toggleShoppingListItem(id: string): Promise<ShoppingListItem> {
  return apiPatch<ShoppingListItem>(`/shopping-list/${id}/toggle`, {});
}

