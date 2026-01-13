import { db, NGODonationHistoryEntry } from "./db";
import { delay } from "./helpers";
import { ensureNgoSeedData } from "./ngo.seed";

const MIN_LATENCY = 130;
const MAX_LATENCY = 260;

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

export interface HistoryFilters {
  status?: NGODonationHistoryEntry["status"];
  from?: string;
  to?: string;
  search?: string;
}

export interface DonationHistoryResponse {
  entries: NGODonationHistoryEntry[];
  summary: {
    totalMeals: number;
    totalKg: number;
    totalCo2: number;
    beneficiaries: number;
    monthlyTrend: { label: string; meals: number; kg: number }[];
  };
}

export async function getDonationHistory(filters?: HistoryFilters): Promise<DonationHistoryResponse> {
  return withSeededData(async () => {
    await simulateLatency();
    let entries = await db.ngoHistory.toArray();

    if (filters?.status) {
      entries = entries.filter((entry) => entry.status === filters.status);
    }
    if (filters?.from) {
      const fromTs = new Date(filters.from).getTime();
      entries = entries.filter((entry) => new Date(entry.pickupTime).getTime() >= fromTs);
    }
    if (filters?.to) {
      const toTs = new Date(filters.to).getTime();
      entries = entries.filter((entry) => new Date(entry.pickupTime).getTime() <= toTs);
    }
    if (filters?.search) {
      const term = filters.search.toLowerCase();
      entries = entries.filter(
        (entry) =>
          entry.donorName.toLowerCase().includes(term) ||
          entry.itemsSummary.toLowerCase().includes(term)
      );
    }

    entries.sort((a, b) => new Date(b.pickupTime).getTime() - new Date(a.pickupTime).getTime());

    const totalMeals = entries.reduce((sum, entry) => sum + entry.mealsProvided, 0);
    const totalKg = entries.reduce((sum, entry) => sum + entry.weightKg, 0);
    const totalCo2 = entries.reduce((sum, entry) => sum + entry.co2PreventedKg, 0);
    const beneficiaries = entries.reduce((sum, entry) => sum + entry.beneficiaries, 0);

    const monthly = new Map<string, { meals: number; kg: number }>();
    entries.forEach((entry) => {
      const monthKey = new Date(entry.pickupTime).toLocaleString("en-US", {
        month: "short",
      });
      const existing = monthly.get(monthKey) ?? { meals: 0, kg: 0 };
      existing.meals += entry.mealsProvided;
      existing.kg += entry.weightKg;
      monthly.set(monthKey, existing);
    });

    const monthlyTrend = Array.from(monthly.entries()).map(([label, value]) => ({
      label,
      meals: value.meals,
      kg: value.kg,
    }));

    return {
      entries,
      summary: {
        totalMeals,
        totalKg,
        totalCo2,
        beneficiaries,
        monthlyTrend,
      },
    };
  });
}

export async function exportHistoryCSV(filters?: HistoryFilters): Promise<string> {
  const { entries } = await getDonationHistory(filters);
  const header = [
    "Donor",
    "Items",
    "Weight (kg)",
    "Meals",
    "CO2 Prevented (kg)",
    "Beneficiaries",
    "Pickup Time",
    "Status",
  ];

  const rows = entries.map((entry) => [
    entry.donorName,
    entry.itemsSummary.replace(/,/g, ";"),
    entry.weightKg.toString(),
    entry.mealsProvided.toString(),
    entry.co2PreventedKg.toString(),
    entry.beneficiaries.toString(),
    new Date(entry.pickupTime).toLocaleString(),
    entry.status,
  ]);

  return [header, ...rows]
    .map((cols) => cols.map((value) => `"${value}"`).join(","))
    .join("\n");
}


