import { db, ConsumptionLog, UserXP } from "./db";
import { generateId, getTimestamp, delay } from "./helpers";
import { getCurrentUser } from "./auth.server";

export interface ImpactMetrics {
  wastePrevented: number; // kg
  co2Saved: number; // kg
  waterSaved: number; // liters
  mealsDonated: number;
  familyGreenScore: number; // 0-100
  totalXP: number;
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
}

export interface ImpactTrend {
  date: string;
  wastePrevented: number;
  co2Saved: number;
  waterSaved: number;
}

/**
 * Calculate CO2 saved from waste prevented (kg waste * 2.5 kg CO2 per kg)
 */
function calculateCO2(wasteKg: number): number {
  return Number((wasteKg * 2.5).toFixed(2));
}

/**
 * Calculate water saved from waste prevented (kg waste * 1000 liters per kg)
 */
function calculateWater(wasteKg: number): number {
  return Number((wasteKg * 1000).toFixed(0));
}

/**
 * Get impact metrics for a user
 */
export async function getImpactMetrics(
  token: string
): Promise<ImpactMetrics> {
  await delay(50);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const logs = await db.logs
    .where("userId")
    .equals(currentUser.id)
    .toArray();

  // If no logs exist, use demo data
  const hasData = logs.length > 0;
  const wastePrevented = hasData
    ? logs
        .filter((log) => !log.wasWasted)
        .reduce((sum, log) => sum + (log.quantity || 0), 0) / 1000
    : 12.5; // Demo: 12.5 kg waste prevented

  const co2Saved = calculateCO2(wastePrevented);
  const waterSaved = calculateWater(wastePrevented);

  // Count meals donated (logs with notes containing "donated" or "shared")
  const mealsDonated = hasData
    ? logs.filter(
        (log) =>
          log.notes?.toLowerCase().includes("donated") ||
          log.notes?.toLowerCase().includes("shared")
      ).length
    : 5; // Demo: 5 meals donated

  // Calculate green score (0-100)
  const totalItems = hasData ? logs.length : 50;
  const wastedItems = hasData ? logs.filter((log) => log.wasWasted).length : 3;
  const wasteRate = totalItems > 0 ? wastedItems / totalItems : 0.06;
  const familyGreenScore = Math.max(0, Math.round((1 - wasteRate) * 100));

  // Get or generate XP data dynamically
  let xpData = await db.userXP.where("userId").equals(currentUser.id).first();
  
  // If no XP data exists, calculate from logs and create it
  if (!xpData) {
    const baseXP = hasData ? logs.length * 10 : 500; // 10 XP per log entry or demo 500
    const wastePreventedXP = hasData 
      ? logs.filter(l => !l.wasWasted).length * 15 
      : 47 * 15; // 15 XP for preventing waste
    const sharedXP = hasData
      ? logs.filter(l => 
          l.notes?.toLowerCase().includes("shared") || 
          l.notes?.toLowerCase().includes("donated")
        ).length * 20
      : 5 * 20; // 20 XP for sharing
    
    const calculatedXP = baseXP + wastePreventedXP + sharedXP;
    const calculatedLevel = Math.floor(calculatedXP / 500) + 1;
    const levelXP = calculatedXP % 500;
    const nextLevel = (calculatedLevel * 500);
    
    xpData = {
      id: generateId(),
      userId: currentUser.id,
      totalXP: calculatedXP,
      level: calculatedLevel,
      currentLevelXP: levelXP,
      nextLevelXP: nextLevel,
      updatedAt: getTimestamp(),
    };
    await db.userXP.add(xpData);
  }
  
  const totalXP = xpData.totalXP;
  const level = xpData.level;
  const currentLevelXP = xpData.currentLevelXP;
  const nextLevelXP = xpData.nextLevelXP;

  return {
    wastePrevented: Number(wastePrevented.toFixed(2)),
    co2Saved,
    waterSaved,
    mealsDonated,
    familyGreenScore,
    totalXP,
    level,
    currentLevelXP,
    nextLevelXP,
  };
}

/**
 * Get family green score
 */
export async function getFamilyGreenScore(token: string): Promise<number> {
  await delay(50);

  const metrics = await getImpactMetrics(token);
  return metrics.familyGreenScore;
}

/**
 * Get impact trends (last 30 days)
 */
export async function getImpactTrends(
  token: string
): Promise<ImpactTrend[]> {
  await delay(50);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const logs = await db.logs
    .where("userId")
    .equals(currentUser.id)
    .filter((log) => new Date(log.consumedAt) >= thirtyDaysAgo)
    .toArray();

  const hasData = logs.length > 0;
  const trendsMap = new Map<string, { waste: number; co2: number; water: number }>();

  // If no data, generate demo trends
  if (!hasData) {
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      // Generate realistic demo data with some variation
      const baseWaste = 0.4 + (Math.random() * 0.3); // 0.4-0.7 kg per day
      trendsMap.set(dateStr, {
        waste: baseWaste,
        co2: calculateCO2(baseWaste),
        water: calculateWater(baseWaste),
      });
    }
  } else {
    logs.forEach((log) => {
    const date = new Date(log.consumedAt).toISOString().split("T")[0];
    if (!trendsMap.has(date)) {
      trendsMap.set(date, { waste: 0, co2: 0, water: 0 });
    }

    const dayData = trendsMap.get(date)!;
    if (!log.wasWasted) {
      const wasteKg = (log.quantity || 0) / 1000;
      dayData.waste += wasteKg;
      dayData.co2 += calculateCO2(wasteKg);
      dayData.water += calculateWater(wasteKg);
    }
  });
  }

  let trends: ImpactTrend[] = Array.from(trendsMap.entries())
    .map(([date, data]) => ({
      date,
      wastePrevented: Number(data.waste.toFixed(2)),
      co2Saved: Number(data.co2.toFixed(2)),
      waterSaved: Number(data.water.toFixed(0)),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // If we have less than 7 days of data, fill in with calculated trends
  if (trends.length < 7) {
    const today = new Date();
    const filledTrends: ImpactTrend[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      
      const existing = trends.find(t => t.date === dateStr);
      if (existing) {
        filledTrends.push(existing);
      } else {
        // Generate trend data based on average
        const avgWaste = trends.length > 0 
          ? trends.reduce((sum, t) => sum + t.wastePrevented, 0) / trends.length 
          : 0.5;
        const variation = 0.7 + (Math.random() * 0.6); // 70-130% variation
        const waste = avgWaste * variation;
        
        filledTrends.push({
          date: dateStr,
          wastePrevented: Number(waste.toFixed(2)),
          co2Saved: Number(calculateCO2(waste).toFixed(2)),
          waterSaved: Number(calculateWater(waste).toFixed(0)),
        });
      }
    }
    
    trends = filledTrends;
  }

  return trends.slice(-30); // Return last 30 days
}

/**
 * Add XP to user
 */
export async function addXP(
  token: string,
  amount: number,
  reason?: string
): Promise<UserXP> {
  await delay(50);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  let xpData = await db.userXP.where("userId").equals(currentUser.id).first();

  if (!xpData) {
    xpData = {
      id: generateId(),
      userId: currentUser.id,
      totalXP: 0,
      level: 1,
      currentLevelXP: 0,
      nextLevelXP: 100,
      updatedAt: getTimestamp(),
    };
    await db.userXP.add(xpData);
  }

  const newTotalXP = xpData.totalXP + amount;
  let newLevel = xpData.level;
  let newCurrentLevelXP = xpData.currentLevelXP + amount;
  let newNextLevelXP = xpData.nextLevelXP;

  // Level up calculation
  while (newCurrentLevelXP >= newNextLevelXP) {
    newCurrentLevelXP -= newNextLevelXP;
    newLevel += 1;
    newNextLevelXP = newLevel * 100;
  }

  const updated: UserXP = {
    ...xpData,
    totalXP: newTotalXP,
    level: newLevel,
    currentLevelXP: newCurrentLevelXP,
    nextLevelXP: newNextLevelXP,
    updatedAt: getTimestamp(),
  };

  await db.userXP.update(xpData.id, updated);
  return updated;
}

