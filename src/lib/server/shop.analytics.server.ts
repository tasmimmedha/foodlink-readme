import { db, ShopAnalyticsRecord } from "./db";
import { delay } from "./helpers";
import { ensureShopSeedData } from "./shop.seed";

const MIN_LATENCY = 150;
const MAX_LATENCY = 230;

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

async function getRecord(): Promise<ShopAnalyticsRecord> {
  const record = await db.shopAnalytics.toCollection().first();
  if (!record) {
    throw new Error("Analytics unavailable");
  }
  return record;
}

export async function getWasteTrends() {
  return withSeededData(async () => {
    await simulateLatency();
    const record = await getRecord();
    return record.wasteReductionTrend;
  });
}

export async function getMarkdownRecovery() {
  return withSeededData(async () => {
    await simulateLatency();
    const record = await getRecord();
    return record.markdownRecoveryTrend;
  });
}

export async function getCategoryWasteBreakdown() {
  return withSeededData(async () => {
    await simulateLatency();
    const record = await getRecord();
    return {
      wasteByCategory: record.wasteByCategory,
      surplusVsSold: record.surplusVsSold,
      expiredPerDay: record.expiredPerDay,
    };
  });
}

export async function getRetailImpactKPIs() {
  return withSeededData(async () => {
    await simulateLatency();
    const record = await getRecord();
    return {
      totalCo2Prevented: record.totalCo2Prevented,
      mealsDonated: record.mealsDonated,
      wasteReductionPercent: record.wasteReductionPercent,
      updatedAt: record.updatedAt,
    };
  });
}


