import { db, RestaurantSurplusItem } from "./db";
import { delay, generateId, getTimestamp } from "./helpers";
import { ensureRestaurantSeeded } from "./restaurant.seed";

const NETWORK_DELAY = 160;

export async function getSurplusItems(): Promise<RestaurantSurplusItem[]> {
  await delay(NETWORK_DELAY);
  await ensureRestaurantSeeded();
  return db.restaurantSurplus.toArray();
}

export async function addSurplusOffer(
  input: Omit<RestaurantSurplusItem, "id" | "status" | "createdAt" | "updatedAt">
): Promise<RestaurantSurplusItem> {
  await delay(NETWORK_DELAY);
  await ensureRestaurantSeeded();
  const now = getTimestamp();
  const item: RestaurantSurplusItem = {
    id: generateId(),
    status: "pending",
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  await db.restaurantSurplus.add(item);
  return item;
}

export async function updateSurplusStatus(
  surplusId: string,
  status: RestaurantSurplusItem["status"]
): Promise<RestaurantSurplusItem | null> {
  await delay(NETWORK_DELAY);
  await ensureRestaurantSeeded();
  const existing = await db.restaurantSurplus.get(surplusId);
  if (!existing) return null;
  const updated = { ...existing, status, updatedAt: getTimestamp() };
  await db.restaurantSurplus.put(updated);
  return updated;
}

export async function assignToNGO(
  surplusId: string,
  ngoName: string
): Promise<RestaurantSurplusItem | null> {
  await delay(NETWORK_DELAY);
  await ensureRestaurantSeeded();
  const existing = await db.restaurantSurplus.get(surplusId);
  if (!existing) return null;
  const updated = {
    ...existing,
    assignedTo: "ngo",
    recipientName: ngoName,
    updatedAt: getTimestamp(),
  };
  await db.restaurantSurplus.put(updated);
  return updated;
}

export async function assignToKitchen(
  surplusId: string,
  kitchenName: string
): Promise<RestaurantSurplusItem | null> {
  await delay(NETWORK_DELAY);
  await ensureRestaurantSeeded();
  const existing = await db.restaurantSurplus.get(surplusId);
  if (!existing) return null;
  const updated = {
    ...existing,
    assignedTo: "kitchen",
    recipientName: kitchenName,
    updatedAt: getTimestamp(),
  };
  await db.restaurantSurplus.put(updated);
  return updated;
}

