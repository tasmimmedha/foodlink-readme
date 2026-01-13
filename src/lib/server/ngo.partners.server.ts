import { db, NGOPartnerProfile } from "./db";
import { delay, generateId, getTimestamp } from "./helpers";
import { ensureNgoSeedData } from "./ngo.seed";

const MIN_LATENCY = 130;
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

export interface PartnerInput
  extends Omit<
    NGOPartnerProfile,
    "id" | "createdAt" | "updatedAt" | "acceptanceRate" | "lastDonationAt"
  > {
  acceptanceRate?: number;
  lastDonationAt?: string;
}

export async function getPartners(): Promise<NGOPartnerProfile[]> {
  return withSeededData(async () => {
    await simulateLatency();
    return (await db.ngoPartners.toArray()).sort((a, b) => a.name.localeCompare(b.name));
  });
}

export async function addPartner(input: PartnerInput): Promise<NGOPartnerProfile> {
  return withSeededData(async () => {
    await simulateLatency();
    const now = getTimestamp();
    const partner: NGOPartnerProfile = {
      ...input,
      id: generateId(),
      acceptanceRate: input.acceptanceRate ?? 0.8,
      lastDonationAt: input.lastDonationAt ?? now,
      createdAt: now,
      updatedAt: now,
    };
    await db.ngoPartners.add(partner);
    return partner;
  });
}

export async function updatePartner(
  id: string,
  input: Partial<PartnerInput>
): Promise<NGOPartnerProfile> {
  return withSeededData(async () => {
    await simulateLatency();
    const existing = await db.ngoPartners.get(id);
    if (!existing) throw new Error("Partner not found");

    const updated: NGOPartnerProfile = {
      ...existing,
      ...input,
      acceptanceRate: input.acceptanceRate ?? existing.acceptanceRate,
      lastDonationAt: input.lastDonationAt ?? existing.lastDonationAt,
      updatedAt: getTimestamp(),
    };
    await db.ngoPartners.put(updated);
    return updated;
  });
}


