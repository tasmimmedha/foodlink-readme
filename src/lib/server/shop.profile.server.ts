import { db, ShopProfile } from "./db";
import { delay, getTimestamp } from "./helpers";
import { ensureShopSeedData } from "./shop.seed";

const MIN_LATENCY = 150;
const MAX_LATENCY = 220;

function randomLatency() {
  return MIN_LATENCY + Math.random() * (MAX_LATENCY - MIN_LATENCY);
}

async function simulateLatency() {
  await delay(randomLatency());
}

async function withSeededData<T>(fn: () => Promise<T>): Promise<T> {
  await ensureShopSeedData();
  return fn();
}

export async function getShopProfile(): Promise<ShopProfile | null> {
  return withSeededData(async () => {
    await simulateLatency();
    return db.shopProfile.toCollection().first();
  });
}

export async function updateShopProfile(
  updates: Partial<ShopProfile>
): Promise<ShopProfile> {
  return withSeededData(async () => {
    await simulateLatency();
    const existing = await db.shopProfile.toCollection().first();
    if (!existing) {
      throw new Error("Profile not initialized");
    }
    const updated: ShopProfile = {
      ...existing,
      ...updates,
      notificationPreferences: {
        ...existing.notificationPreferences,
        ...(updates.notificationPreferences ?? {}),
      },
      donationPreferences: updates.donationPreferences ?? existing.donationPreferences,
      categoryPriority: updates.categoryPriority ?? existing.categoryPriority,
      barcodePrefix: updates.barcodePrefix ?? existing.barcodePrefix,
      updatedAt: getTimestamp(),
    };
    await db.shopProfile.put(updated);
    return updated;
  });
}


