import { db, ShopSurplusItem } from "./db";
import { delay, generateId, getTimestamp } from "./helpers";
import { ensureShopSeedData } from "./shop.seed";

const MIN_LATENCY = 150;
const MAX_LATENCY = 240;

export interface AddSurplusInput {
  skuName: string;
  quantity: number;
  unit: string;
  expiryWindowStart: string;
  expiryWindowEnd: string;
  condition: "fresh" | "near-expiry";
  imageData?: string;
}

export interface AssignSurplusInput {
  destinationType: "ngo" | "community-kitchen";
  destinationName: string;
  pickupTime: string;
}

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

export async function getSurplusQueue(): Promise<ShopSurplusItem[]> {
  return withSeededData(async () => {
    await simulateLatency();
    const queue = await db.shopSurplus.orderBy("createdAt").reverse().toArray();
    return queue;
  });
}

export async function addSurplusItem(input: AddSurplusInput): Promise<ShopSurplusItem> {
  return withSeededData(async () => {
    await simulateLatency();
    const now = getTimestamp();
    const entry: ShopSurplusItem = {
      id: generateId(),
      skuName: input.skuName,
      quantity: input.quantity,
      unit: input.unit,
      expiryWindowStart: input.expiryWindowStart,
      expiryWindowEnd: input.expiryWindowEnd,
      condition: input.condition,
      destinationType: undefined,
      destinationName: undefined,
      status: "pending",
      pickupTime: undefined,
      reminderSent: false,
      imageData: input.imageData,
      createdAt: now,
      updatedAt: now,
    };
    await db.shopSurplus.add(entry);
    return entry;
  });
}

export async function assignSurplusToNGO(
  surplusId: string,
  assignment: AssignSurplusInput
): Promise<ShopSurplusItem> {
  return withSeededData(async () => {
    await simulateLatency();
    const record = await db.shopSurplus.get(surplusId);
    if (!record) {
      throw new Error("Surplus record not found");
    }
    const updated: ShopSurplusItem = {
      ...record,
      destinationType: assignment.destinationType,
      destinationName: assignment.destinationName,
      pickupTime: assignment.pickupTime,
      updatedAt: getTimestamp(),
    };
    await db.shopSurplus.put(updated);
    return updated;
  });
}

export async function updateSurplusStatus(
  surplusId: string,
  status: ShopSurplusItem["status"]
): Promise<ShopSurplusItem> {
  return withSeededData(async () => {
    await simulateLatency();
    const record = await db.shopSurplus.get(surplusId);
    if (!record) {
      throw new Error("Surplus record not found");
    }
    const updated: ShopSurplusItem = {
      ...record,
      status,
      updatedAt: getTimestamp(),
    };
    await db.shopSurplus.put(updated);
    return updated;
  });
}


