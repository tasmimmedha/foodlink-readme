import { db, NGOCapacitySettings, NGODonationOffer, NGOPartnerProfile } from "./db";
import { delay, getTimestamp } from "./helpers";
import { ensureNgoSeedData } from "./ngo.seed";

const MIN_LATENCY = 120;
const MAX_LATENCY = 250;

function randomLatency() {
  return MIN_LATENCY + Math.random() * (MAX_LATENCY - MIN_LATENCY);
}

async function simulateLatency() {
  await delay(randomLatency());
}

async function withSeededData<T>(fn: () => Promise<T>): Promise<T> {
  await ensureNgoSeedData();
  return fn();
}

export type CapacityPreferencesInput = Partial<
  Omit<NGOCapacitySettings, "id" | "updatedAt" | "xpPoints" | "level" | "levelProgressPct">
>;

export interface CapacityCheckResult {
  decision: "accept" | "partial" | "refer";
  reason: string;
  suggestedKg?: number;
  referPartner?: NGOPartnerProfile;
}

export async function getCapacity(): Promise<NGOCapacitySettings | null> {
  return withSeededData(async () => {
    await simulateLatency();
    return (await db.ngoCapacity.toCollection().first()) ?? null;
  });
}

export async function setCapacity(input: CapacityPreferencesInput): Promise<NGOCapacitySettings> {
  return withSeededData(async () => {
    await simulateLatency();
    const existing = await db.ngoCapacity.toCollection().first();
    if (!existing) {
      throw new Error("Capacity profile missing");
    }
    const updated: NGOCapacitySettings = {
      ...existing,
      ...input,
      updatedAt: getTimestamp(),
    };
    await db.ngoCapacity.put(updated);
    return updated;
  });
}

export async function checkCapacityForOffer(offer: Pick<NGODonationOffer, "weightKg" | "items">): Promise<CapacityCheckResult> {
  return withSeededData(async () => {
    await simulateLatency();
    const capacity = await db.ngoCapacity.toCollection().first();
    if (!capacity) {
      return {
        decision: "refer",
        reason: "Capacity profile missing",
      };
    }

    const remaining = capacity.dailyCapacityKg - capacity.currentUtilizationKg;

    if (remaining <= 0) {
      const partner = await db.ngoPartners.orderBy("acceptanceRate").reverse().first();
      return {
        decision: "refer",
        reason: "Daily capacity already reached",
        referPartner: partner ?? undefined,
      };
    }

    if (offer.weightKg <= remaining) {
      return {
        decision: "accept",
        reason: `Capacity available for ${remaining.toFixed(1)} kg`,
      };
    }

    const partner = await db.ngoPartners.filter((p) => p.storageCapabilities.includes("refrigerated")).first();

    return {
      decision: "partial",
      reason: `Offer exceeds capacity by ${(offer.weightKg - remaining).toFixed(1)} kg`,
      suggestedKg: remaining,
      referPartner: partner ?? undefined,
    };
  });
}


