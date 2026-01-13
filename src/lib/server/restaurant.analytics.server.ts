import { db, RestaurantImpactMetrics } from "./db";
import { delay } from "./helpers";
import { ensureRestaurantSeeded } from "./restaurant.seed";

const NETWORK_DELAY = 170;

export async function getRestaurantImpact(): Promise<RestaurantImpactMetrics | null> {
  await delay(NETWORK_DELAY);
  await ensureRestaurantSeeded();
  const impact = await db.restaurantImpact.toArray();
  return impact[0] ?? null;
}

export async function getWasteReductionTrends(): Promise<RestaurantImpactMetrics["weeklyTrend"]> {
  const impact = await getRestaurantImpact();
  return impact?.weeklyTrend ?? [];
}

export async function getCategoryWasteBreakdown(): Promise<
  RestaurantImpactMetrics["categoryBreakdown"]
> {
  const impact = await getRestaurantImpact();
  return impact?.categoryBreakdown ?? [];
}

