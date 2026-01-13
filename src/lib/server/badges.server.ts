import { db, Badge, UserXP } from "./db";
import { generateId, getTimestamp, delay } from "./helpers";
import { getCurrentUser } from "./auth.server";

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  requirement: {
    type: "waste_prevented" | "meals_planned" | "items_shared" | "xp_earned" | "days_streak";
    value: number;
  };
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: "leftover-master",
    name: "Leftover Master",
    description: "Eaten 10 leftover meals",
    icon: "🍽️",
    xpReward: 50,
    requirement: { type: "waste_prevented", value: 10 },
  },
  {
    id: "zero-waste-champion",
    name: "Zero Waste Champion",
    description: "Prevented 50kg of food waste",
    icon: "🌱",
    xpReward: 100,
    requirement: { type: "waste_prevented", value: 50 },
  },
  {
    id: "healthy-planner",
    name: "Healthy Planner",
    description: "Planned 30 meals",
    icon: "📅",
    xpReward: 75,
    requirement: { type: "meals_planned", value: 30 },
  },
  {
    id: "smart-shopper",
    name: "Smart Shopper",
    description: "Saved $100 through smart shopping",
    icon: "🛒",
    xpReward: 60,
    requirement: { type: "xp_earned", value: 500 },
  },
  {
    id: "community-helper",
    name: "Community Helper",
    description: "Shared 20 items with community",
    icon: "🤝",
    xpReward: 80,
    requirement: { type: "items_shared", value: 20 },
  },
];

/**
 * Get unlocked badges for a user
 */
export async function getUnlockedBadges(token: string): Promise<Badge[]> {
  await delay(50);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const badges = await db.badges.where("userId").equals(currentUser.id).toArray();

  // If no badges exist, return demo unlocked badges
  if (badges.length === 0) {
    const now = getTimestamp();
    const demoBadges: Badge[] = [
      {
        id: generateId(),
        userId: currentUser.id,
        badgeId: "leftover-master",
        name: "Leftover Master",
        description: "Eaten 10 leftover meals",
        icon: "🍽️",
        xpReward: 50,
        unlockedAt: now,
        createdAt: now,
      },
      {
        id: generateId(),
        userId: currentUser.id,
        badgeId: "healthy-planner",
        name: "Healthy Planner",
        description: "Planned 30 meals",
        icon: "📅",
        xpReward: 75,
        unlockedAt: now,
        createdAt: now,
      },
    ];
    return demoBadges;
  }

  return badges;
}

/**
 * Get next available badges
 */
export async function getNextBadges(
  token: string
): Promise<{ badge: BadgeDefinition; progress: number; unlocked: boolean }[]> {
  await delay(50);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const unlockedBadges = await getUnlockedBadges(token);
  const unlockedIds = new Set(unlockedBadges.map((b) => b.badgeId));

  // Calculate progress for each badge
  const logs = await db.logs
    .where("userId")
    .equals(currentUser.id)
    .toArray();

  const xpData = await db.userXP
    .where("userId")
    .equals(currentUser.id)
    .first();

  const mealPlans = await db.mealPlans
    .where("userId")
    .equals(currentUser.id)
    .toArray();

  const results = BADGE_DEFINITIONS.map((badge) => {
    const unlocked = unlockedIds.has(badge.id);
    let progress = 0;

    if (!unlocked) {
      switch (badge.requirement.type) {
        case "waste_prevented":
          const wastePrevented = logs
            .filter((log) => !log.wasWasted)
            .reduce((sum, log) => sum + (log.quantity || 0), 0) / 1000;
          progress = Math.min(100, (wastePrevented / badge.requirement.value) * 100);
          break;
        case "meals_planned":
          progress = Math.min(100, (mealPlans.length / badge.requirement.value) * 100);
          break;
        case "items_shared":
          const sharedCount = logs.filter(
            (log) => log.notes?.toLowerCase().includes("shared")
          ).length;
          progress = Math.min(100, (sharedCount / badge.requirement.value) * 100);
          break;
        case "xp_earned":
          const totalXP = xpData?.totalXP || 0;
          progress = Math.min(100, (totalXP / badge.requirement.value) * 100);
          break;
      }
    } else {
      progress = 100;
    }

    return { badge, progress: Math.round(progress), unlocked };
  });

  return results;
}

/**
 * Unlock a badge for a user
 */
export async function unlockBadge(
  token: string,
  badgeId: string
): Promise<Badge> {
  await delay(50);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const badgeDef = BADGE_DEFINITIONS.find((b) => b.id === badgeId);
  if (!badgeDef) {
    throw new Error("Badge definition not found");
  }

  const existing = await db.badges
    .where("[userId+badgeId]")
    .equals([currentUser.id, badgeId])
    .first();

  if (existing) {
    return existing;
  }

  const now = getTimestamp();
  const newBadge: Badge = {
    id: generateId(),
    userId: currentUser.id,
    badgeId,
    name: badgeDef.name,
    description: badgeDef.description,
    icon: badgeDef.icon,
    xpReward: badgeDef.xpReward,
    unlockedAt: now,
    createdAt: now,
  };

  await db.badges.add(newBadge);

  // Add XP reward
  const { addXP } = await import("./impact.server");
  await addXP(token, badgeDef.xpReward, `Badge unlocked: ${badgeDef.name}`);

  return newBadge;
}

/**
 * Check and unlock badges based on user progress
 */
export async function checkAndUnlockBadges(token: string): Promise<Badge[]> {
  await delay(50);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const unlockedBadges = await getUnlockedBadges(token);
  const unlockedIds = new Set(unlockedBadges.map((b) => b.badgeId));

  const logs = await db.logs
    .where("userId")
    .equals(currentUser.id)
    .toArray();

  const xpData = await db.userXP
    .where("userId")
    .equals(currentUser.id)
    .first();

  const mealPlans = await db.mealPlans
    .where("userId")
    .equals(currentUser.id)
    .toArray();

  const newlyUnlocked: Badge[] = [];

  for (const badgeDef of BADGE_DEFINITIONS) {
    if (unlockedIds.has(badgeDef.id)) continue;

    let shouldUnlock = false;

    switch (badgeDef.requirement.type) {
      case "waste_prevented":
        const wastePrevented = logs
          .filter((log) => !log.wasWasted)
          .reduce((sum, log) => sum + (log.quantity || 0), 0) / 1000;
        shouldUnlock = wastePrevented >= badgeDef.requirement.value;
        break;
      case "meals_planned":
        shouldUnlock = mealPlans.length >= badgeDef.requirement.value;
        break;
      case "items_shared":
        const sharedCount = logs.filter(
          (log) => log.notes?.toLowerCase().includes("shared")
        ).length;
        shouldUnlock = sharedCount >= badgeDef.requirement.value;
        break;
      case "xp_earned":
        const totalXP = xpData?.totalXP || 0;
        shouldUnlock = totalXP >= badgeDef.requirement.value;
        break;
    }

    if (shouldUnlock) {
      const badge = await unlockBadge(token, badgeDef.id);
      newlyUnlocked.push(badge);
    }
  }

  return newlyUnlocked;
}

