import { db, ShopInventoryItem } from "./db";
import { delay, generateId, getTimestamp } from "./helpers";
import { ensureShopSeedData } from "./shop.seed";

const MIN_LATENCY = 150;
const MAX_LATENCY = 250;

type InventoryFilters = {
  search?: string;
  category?: string;
  storageType?: ShopInventoryItem["storageType"];
};

export interface AddSKUInput {
  name: string;
  category: string;
  barcode: string;
  stockQuantity: number;
  unit: string;
  price: number;
  cost: number;
  expiryDate: string;
  storageType: ShopInventoryItem["storageType"];
  shelfLocation?: string;
  imageData?: string;
}

export interface UpdateSKUInput extends Partial<AddSKUInput> {
  markdownStatus?: ShopInventoryItem["markdownStatus"];
  surplusEligible?: boolean;
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

export async function getInventory(filters?: InventoryFilters): Promise<ShopInventoryItem[]> {
  return withSeededData(async () => {
    await simulateLatency();
    let items = await db.shopInventory.toArray();

    if (filters?.search) {
      const term = filters.search.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.barcode.toLowerCase().includes(term) ||
          item.category.toLowerCase().includes(term)
      );
    }

    if (filters?.category) {
      items = items.filter((item) => item.category === filters.category);
    }

    if (filters?.storageType) {
      items = items.filter((item) => item.storageType === filters.storageType);
    }

    return items.sort((a, b) => a.name.localeCompare(b.name));
  });
}

export async function addSKU(input: AddSKUInput): Promise<ShopInventoryItem> {
  return withSeededData(async () => {
    await simulateLatency();
    const now = getTimestamp();
    const record: ShopInventoryItem = {
      id: generateId(),
      name: input.name,
      category: input.category,
      barcode: input.barcode,
      stockQuantity: input.stockQuantity,
      unit: input.unit,
      price: input.price,
      cost: input.cost,
      expiryDate: input.expiryDate,
      storageType: input.storageType,
      shelfLocation: input.shelfLocation,
      imageData: input.imageData,
      markdownStatus: "none",
      surplusEligible: true,
      createdAt: now,
      updatedAt: now,
    };
    await db.shopInventory.add(record);
    return record;
  });
}

export async function updateSKU(id: string, updates: UpdateSKUInput): Promise<ShopInventoryItem> {
  return withSeededData(async () => {
    await simulateLatency();
    const existing = await db.shopInventory.get(id);
    if (!existing) {
      throw new Error("SKU not found");
    }
    const updated: ShopInventoryItem = {
      ...existing,
      ...updates,
      price: updates.price ?? existing.price,
      cost: updates.cost ?? existing.cost,
      stockQuantity: updates.stockQuantity ?? existing.stockQuantity,
      expiryDate: updates.expiryDate ?? existing.expiryDate,
      storageType: updates.storageType ?? existing.storageType,
      shelfLocation: updates.shelfLocation ?? existing.shelfLocation,
      imageData: updates.imageData ?? existing.imageData,
      markdownStatus: updates.markdownStatus ?? existing.markdownStatus,
      surplusEligible: updates.surplusEligible ?? existing.surplusEligible,
      updatedAt: getTimestamp(),
    };
    await db.shopInventory.put(updated);
    return updated;
  });
}

export async function deleteSKU(id: string): Promise<void> {
  return withSeededData(async () => {
    await simulateLatency();
    await db.shopInventory.delete(id);
  });
}

export type ExpiringBuckets = {
  today: ShopInventoryItem[];
  twoDays: ShopInventoryItem[];
  threeToFive: ShopInventoryItem[];
};

export async function getExpiringItems(): Promise<ExpiringBuckets> {
  return withSeededData(async () => {
    await simulateLatency();
    const items = await db.shopInventory.toArray();
    const today: ShopInventoryItem[] = [];
    const twoDays: ShopInventoryItem[] = [];
    const threeToFive: ShopInventoryItem[] = [];

    items.forEach((item) => {
      const diff = Math.floor(
        (new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      if (diff <= 0) {
        today.push(item);
      } else if (diff === 1) {
        twoDays.push(item);
      } else if (diff >= 2 && diff <= 5) {
        threeToFive.push(item);
      }
    });

    return { today, twoDays, threeToFive };
  });
}

export async function getMarkdownCandidates(): Promise<ShopInventoryItem[]> {
  return withSeededData(async () => {
    await simulateLatency();
    const items = await db.shopInventory.toArray();
    const soon = items.filter((item) => {
      const diff =
        (new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      return diff <= 2 || item.markdownStatus !== "none";
    });
    return soon.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
  });
}


