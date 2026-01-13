import { db, RestaurantPreferences } from "./db";
import { delay, getTimestamp } from "./helpers";
import { ensureRestaurantSeeded } from "./restaurant.seed";

const NETWORK_DELAY = 150;

export async function getRestaurantPreferences(): Promise<RestaurantPreferences | null> {
  await delay(NETWORK_DELAY);
  await ensureRestaurantSeeded();
  const prefs = await db.restaurantPreferences.toArray();
  return prefs[0] ?? null;
}

export async function updateRestaurantPreferences(
  updates: Partial<RestaurantPreferences>
): Promise<RestaurantPreferences | null> {
  await delay(NETWORK_DELAY);
  await ensureRestaurantSeeded();
  const existing = await getRestaurantPreferences();
  if (!existing) return null;
  const updated: RestaurantPreferences = {
    ...existing,
    ...updates,
    updatedAt: getTimestamp(),
  };
  await db.restaurantPreferences.put(updated);
  return updated;
}

