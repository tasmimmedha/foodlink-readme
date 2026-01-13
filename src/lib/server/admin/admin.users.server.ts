import { db, User } from "../db";
import { generateId, getTimestamp, delay } from "../helpers";

export interface UserWithStats {
  id: string;
  name: string;
  email: string;
  householdId?: string;
  createdAt: string;
  updatedAt: string;
  stats: {
    inventoryCount: number;
    consumptionLogsCount: number;
    mealPlansCount: number;
    shoppingListCount: number;
    badgesCount: number;
    xpLevel: number;
    totalXP: number;
    wastePrevented: number; // kg
    surplusShared: number; // kg
    lastActive?: string;
  };
}

export interface UpdateUserData {
  name?: string;
  email?: string;
}

/**
 * Get all users with optional filters
 */
export async function getUsers(filters?: {
  search?: string;
  role?: string;
}): Promise<User[]> {
  await delay(200);

  let users = await db.users.toArray();

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    users = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
    );
  }

  // Role filtering would need role field in User model
  // For now, all users are treated as "family" role

  return users.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get user by ID
 */
export async function getUserById(id: string): Promise<User | null> {
  await delay(100);
  return db.users.get(id) || null;
}

/**
 * Get users with statistics
 */
export async function getUsersWithStats(): Promise<UserWithStats[]> {
  await delay(300);

  const users = await db.users.toArray();
  const inventory = await db.inventory.toArray();
  const logs = await db.logs.toArray();
  const mealPlans = await db.mealPlans.toArray();
  const shoppingList = await db.shoppingList.toArray();
  const badges = await db.badges.toArray();
  const userXP = await db.userXP.toArray();
  const communitySurplus = await db.communitySurplusPosts.toArray();
  const leftoverItems = await db.leftoverItems.toArray();

  // Calculate last active date from logs
  const lastActiveMap: Record<string, string> = {};
  logs.forEach((log) => {
    const existing = lastActiveMap[log.userId];
    if (!existing || log.consumedAt > existing) {
      lastActiveMap[log.userId] = log.consumedAt;
    }
  });

  // Calculate waste prevented (items not wasted)
  const wastePreventedMap: Record<string, number> = {};
  logs
    .filter((log) => !log.wasWasted)
    .forEach((log) => {
      wastePreventedMap[log.userId] =
        (wastePreventedMap[log.userId] || 0) + (log.quantity || 0) / 1000; // Convert to kg
    });

  // Calculate surplus shared
  const surplusSharedMap: Record<string, number> = {};
  communitySurplus.forEach((post) => {
    surplusSharedMap[post.userId] =
      (surplusSharedMap[post.userId] || 0) + (post.quantity || 0);
  });
  leftoverItems.forEach((item) => {
    surplusSharedMap[item.userId] = (surplusSharedMap[item.userId] || 0) + (item.portions || 0);
  });

  return users.map((user) => {
    const stats = {
      inventoryCount: inventory.filter((item) => item.userId === user.id).length,
      consumptionLogsCount: logs.filter((log) => log.userId === user.id).length,
      mealPlansCount: mealPlans.filter((plan) => plan.userId === user.id).length,
      shoppingListCount: shoppingList.filter((item) => item.userId === user.id).length,
      badgesCount: badges.filter((badge) => badge.userId === user.id).length,
      xpLevel: userXP.find((xp) => xp.userId === user.id)?.level || 0,
      totalXP: userXP.find((xp) => xp.userId === user.id)?.totalXP || 0,
      wastePrevented: Math.round((wastePreventedMap[user.id] || 0) * 10) / 10,
      surplusShared: Math.round((surplusSharedMap[user.id] || 0) * 10) / 10,
      lastActive: lastActiveMap[user.id],
    };

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      householdId: user.householdId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      stats,
    };
  });
}

/**
 * Get user with detailed statistics
 */
export async function getUserWithDetailedStats(userId: string): Promise<UserWithStats | null> {
  await delay(200);

  const user = await db.users.get(userId);
  if (!user) {
    return null;
  }

  const usersWithStats = await getUsersWithStats();
  return usersWithStats.find((u) => u.id === userId) || null;
}

/**
 * Update user
 */
export async function updateUser(userId: string, data: UpdateUserData): Promise<User> {
  await delay(200);

  const user = await db.users.get(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Check email uniqueness if email is being changed
  if (data.email && data.email !== user.email) {
    const existing = await db.users.where("email").equals(data.email.toLowerCase()).first();
    if (existing) {
      throw new Error("Email already in use");
    }
  }

  const updates: Partial<User> = {
    ...data,
    updatedAt: getTimestamp(),
  };

  if (data.email) {
    updates.email = data.email.toLowerCase().trim();
  }
  if (data.name) {
    updates.name = data.name.trim();
  }

  await db.users.update(userId, updates);

  const updated = await db.users.get(userId);
  if (!updated) {
    throw new Error("Failed to update user");
  }

  return updated;
}

/**
 * Delete user and all associated data
 */
export async function deleteUser(userId: string): Promise<void> {
  await delay(300);

  const user = await db.users.get(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Delete all user-associated data
  await Promise.all([
    db.inventory.where("userId").equals(userId).delete(),
    db.logs.where("userId").equals(userId).delete(),
    db.mealPlans.where("userId").equals(userId).delete(),
    db.shoppingList.where("userId").equals(userId).delete(),
    db.badges.where("userId").equals(userId).delete(),
    db.userXP.where("userId").equals(userId).delete(),
    db.nutritionData.where("userId").equals(userId).delete(),
    db.familyPreferences.where("householdId").equals(user.householdId || "").delete(),
    db.communitySurplusPosts.where("userId").equals(userId).delete(),
    db.leftoverItems.where("userId").equals(userId).delete(),
    db.communityProfiles.where("userId").equals(userId).delete(),
  ]);

  // Delete user
  await db.users.delete(userId);
}

/**
 * Reset user data (clear all user data but keep account)
 */
export async function resetUserData(userId: string): Promise<void> {
  await delay(300);

  const user = await db.users.get(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Clear all user-associated data
  await Promise.all([
    db.inventory.where("userId").equals(userId).delete(),
    db.logs.where("userId").equals(userId).delete(),
    db.mealPlans.where("userId").equals(userId).delete(),
    db.shoppingList.where("userId").equals(userId).delete(),
    db.badges.where("userId").equals(userId).delete(),
    db.userXP.where("userId").equals(userId).delete(),
    db.nutritionData.where("userId").equals(userId).delete(),
  ]);
}

