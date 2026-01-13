import { db, NGOImpactStory, NGODonationHistoryEntry } from "./db";
import { delay } from "./helpers";
import { ensureNgoSeedData } from "./ngo.seed";

const MIN_LATENCY = 120;
const MAX_LATENCY = 220;

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

export interface ImpactInsights {
  kpis: {
    meals: number;
    kilograms: number;
    co2: number;
    partners: number;
  };
  timeSeries: { label: string; kg: number; meals: number }[];
  donationTypeBreakdown: { name: string; value: number }[];
  stories: NGOImpactStory[];
}

export async function getNgoImpactInsights(): Promise<ImpactInsights> {
  return withSeededData(async () => {
    await simulateLatency();
    const history: NGODonationHistoryEntry[] = await db.ngoHistory.toArray();
    const stories = await db.ngoImpactStories.toArray();

    const meals = history.reduce((sum, entry) => sum + entry.mealsProvided, 0);
    const kilograms = history.reduce((sum, entry) => sum + entry.weightKg, 0);
    const co2 = history.reduce((sum, entry) => sum + entry.co2PreventedKg, 0);
    const partners = await db.ngoPartners.count();

    const typeBuckets: Record<string, number> = {};
    history.forEach((entry) => {
      entry.tags.forEach((tag) => {
        typeBuckets[tag] = (typeBuckets[tag] ?? 0) + entry.weightKg / entry.tags.length;
      });
    });

    const groupedByMonth = new Map<string, { kg: number; meals: number }>();
    history.forEach((entry) => {
      const key = new Date(entry.pickupTime).toLocaleString("en-US", { month: "short" });
      const current = groupedByMonth.get(key) ?? { kg: 0, meals: 0 };
      current.kg += entry.weightKg;
      current.meals += entry.mealsProvided;
      groupedByMonth.set(key, current);
    });

    return {
      kpis: {
        meals,
        kilograms,
        co2,
        partners,
      },
      timeSeries: Array.from(groupedByMonth.entries()).map(([label, value]) => ({
        label,
        kg: value.kg,
        meals: value.meals,
      })),
      donationTypeBreakdown: Object.entries(typeBuckets).map(([name, value]) => ({
        name,
        value: Number(value.toFixed(1)),
      })),
      stories,
    };
  });
}


