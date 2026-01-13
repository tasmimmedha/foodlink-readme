import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/lib/api-client";
import { InventoryItem } from "@/store/inventory.store";

export interface CreateInventoryItemDto {
  name: string;
  quantity: number;
  unit?: string;
  expiryDate?: string;
  category?: string;
  location?: string;
}

export interface UpdateInventoryItemDto extends Partial<CreateInventoryItemDto> {}

export async function getInventoryItems(): Promise<InventoryItem[]> {
  return apiGet<InventoryItem[]>("/inventory");
}

export async function getInventoryItem(id: string): Promise<InventoryItem> {
  return apiGet<InventoryItem>(`/inventory/${id}`);
}

export async function createInventoryItem(data: CreateInventoryItemDto): Promise<InventoryItem> {
  return apiPost<InventoryItem, CreateInventoryItemDto>("/inventory", data);
}

export async function updateInventoryItem(
  id: string,
  data: UpdateInventoryItemDto
): Promise<InventoryItem> {
  return apiPatch<InventoryItem, UpdateInventoryItemDto>(`/inventory/${id}`, data);
}

export async function deleteInventoryItem(id: string): Promise<void> {
  return apiDelete<void>(`/inventory/${id}`);
}

