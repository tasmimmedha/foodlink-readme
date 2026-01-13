import { db, ShopPriceMapEntry, ShopDiscountSuggestion, ShopInventoryItem } from "./db";
import { delay, generateId, getTimestamp } from "./helpers";
import { ensureShopSeedData } from "./shop.seed";

const MIN_LATENCY = 150;
const MAX_LATENCY = 240;

export interface UpdatePriceInput {
  skuId: string;
  newPrice: number;
  method: "percentage" | "fixed";
  changeValue: number;
  notes?: string;
  scheduledBy?: string;
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

export async function getPriceMap(): Promise<ShopPriceMapEntry[]> {
  return withSeededData(async () => {
    await simulateLatency();
    const entries = await db.shopPriceMap.orderBy("effectiveAt").reverse().toArray();
    return entries;
  });
}

export async function updatePrice(input: UpdatePriceInput): Promise<ShopPriceMapEntry> {
  return withSeededData(async () => {
    await simulateLatency();
    const sku = await db.shopInventory.get(input.skuId);
    if (!sku) {
      throw new Error("SKU not found");
    }

    const now = getTimestamp();
    const entry: ShopPriceMapEntry = {
      id: generateId(),
      skuId: sku.id,
      skuName: sku.name,
      oldPrice: sku.price,
      newPrice: input.newPrice,
      method: input.method,
      changeValue: input.changeValue,
      effectiveAt: now,
      scheduledBy: input.scheduledBy ?? "Store Manager",
      notes: input.notes,
      createdAt: now,
    };

    const updatedSku: ShopInventoryItem = {
      ...sku,
      price: input.newPrice,
      markdownStatus: input.newPrice < sku.price ? "active" : "none",
      updatedAt: now,
    };

    await db.transaction("rw", db.shopInventory, db.shopPriceMap, async () => {
      await db.shopInventory.put(updatedSku);
      await db.shopPriceMap.add(entry);
    });

    return entry;
  });
}

export async function generateDiscountSuggestions(): Promise<ShopDiscountSuggestion[]> {
  return withSeededData(async () => {
    await simulateLatency();
    const now = Date.now();
    const suggestions = await db.shopDiscountSuggestions.toArray();
    const filtered = suggestions.filter(
      (suggestion) => new Date(suggestion.expiresAt).getTime() >= now
    );
    if (filtered.length !== suggestions.length) {
      const expiredIds = suggestions
        .filter((suggestion) => new Date(suggestion.expiresAt).getTime() < now)
        .map((item) => item.id);
      await db.shopDiscountSuggestions.bulkDelete(expiredIds);
    }
    return filtered.sort((a, b) => b.suggestedDiscountPct - a.suggestedDiscountPct);
  });
}


