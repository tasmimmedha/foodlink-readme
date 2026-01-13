import { db, RestaurantInventoryItem } from "./db";
import { delay, generateId, getTimestamp } from "./helpers";
import { ensureRestaurantSeeded } from "./restaurant.seed";

const NETWORK_DELAY = 150;

export async function getRestaurantInventory(): Promise<RestaurantInventoryItem[]> {
  await delay(NETWORK_DELAY);
  await ensureRestaurantSeeded();
  const items = await db.restaurantInventory.toArray();
  return items.sort((a, b) => a.expiryDate.localeCompare(b.expiryDate));
}

export async function addStockItem(
  input: Omit<RestaurantInventoryItem, "id" | "createdAt" | "updatedAt">
): Promise<RestaurantInventoryItem> {
  await delay(NETWORK_DELAY);
  await ensureRestaurantSeeded();
  const now = getTimestamp();
  const item: RestaurantInventoryItem = {
    id: generateId(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  await db.restaurantInventory.add(item);
  return item;
}

export async function updateStockItem(
  id: string,
  updates: Partial<RestaurantInventoryItem>
): Promise<RestaurantInventoryItem | null> {
  await delay(NETWORK_DELAY);
  await ensureRestaurantSeeded();
  const existing = await db.restaurantInventory.get(id);
  if (!existing) return null;
  const updated: RestaurantInventoryItem = {
    ...existing,
    ...updates,
    updatedAt: getTimestamp(),
  };
  await db.restaurantInventory.put(updated);
  return updated;
}

export async function deleteStockItem(id: string): Promise<void> {
  await delay(NETWORK_DELAY);
  await ensureRestaurantSeeded();
  await db.restaurantInventory.delete(id);
}

export async function getExpiringItems(): Promise<RestaurantInventoryItem[]> {
  await delay(NETWORK_DELAY);
  await ensureRestaurantSeeded();
  const today = new Date();
  const items = await db.restaurantInventory.toArray();
  return items.filter((item) => new Date(item.expiryDate).getTime() - today.getTime() <= 3 * 24 * 60 * 60 * 1000);
}

