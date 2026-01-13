import { db, User } from "./db";
import { generateId, getTimestamp, delay } from "./helpers";
import { getCurrentUser } from "./auth.server";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  householdId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
}

/**
 * Get user profile by ID
 */
export async function getUserById(userId: string): Promise<UserProfile | null> {
  await delay(150);

  const user = await db.users.get(userId);
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    householdId: user.householdId,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

/**
 * Get user profile from token
 */
export async function getUserProfile(token: string): Promise<UserProfile | null> {
  await delay(100);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    return null;
  }

  return getUserById(currentUser.id);
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  token: string,
  data: UpdateUserData
): Promise<UserProfile> {
  await delay(200);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const user = await db.users.get(currentUser.id);
  if (!user) {
    throw new Error("User not found");
  }

  // Check if email is being changed and if it's already taken
  if (data.email && data.email !== user.email) {
    const existingUser = await db.users.where("email").equals(data.email).first();
    if (existingUser) {
      throw new Error("Email already in use");
    }
  }

  const updates: Partial<User> = {
    ...data,
    updatedAt: getTimestamp(),
  };

  await db.users.update(currentUser.id, updates);

  const updatedUser = await db.users.get(currentUser.id);
  if (!updatedUser) {
    throw new Error("User not found");
  }

  return {
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    householdId: updatedUser.householdId,
    createdAt: updatedUser.createdAt,
    updatedAt: updatedUser.updatedAt,
  };
}

/**
 * Get users in the same household
 */
export async function getHouseholdMembers(token: string): Promise<UserProfile[]> {
  await delay(150);

  const currentUser = await getCurrentUser(token);
  if (!currentUser || !currentUser.householdId) {
    return [];
  }

  const users = await db.users
    .where("householdId")
    .equals(currentUser.householdId)
    .toArray();

  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    householdId: user.householdId,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }));
}

