import { db, RestaurantDonationLog } from "./db";
import { delay, generateId, getTimestamp } from "./helpers";
import { ensureRestaurantSeeded } from "./restaurant.seed";

const NETWORK_DELAY = 150;

export async function getDonationHistory(): Promise<RestaurantDonationLog[]> {
  await delay(NETWORK_DELAY);
  await ensureRestaurantSeeded();
  const logs = await db.restaurantDonations.toArray();
  return logs.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function addDonationLog(
  input: Omit<RestaurantDonationLog, "id" | "createdAt">
): Promise<RestaurantDonationLog> {
  await delay(NETWORK_DELAY);
  await ensureRestaurantSeeded();
  const log: RestaurantDonationLog = {
    id: generateId(),
    ...input,
    createdAt: getTimestamp(),
  };
  await db.restaurantDonations.add(log);
  return log;
}

