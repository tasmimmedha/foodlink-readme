import { db, FamilyPreferences } from "./db";
import { generateId, getTimestamp, delay } from "./helpers";
import { getCurrentUser } from "./auth.server";

export interface UpdateFamilyPreferencesInput {
  // Household
  householdSize?: number;
  ageGroups?: {
    child?: number;
    adult?: number;
    senior?: number;
  };
  cookingFrequency?: "daily" | "few-times-week" | "weekly" | "occasional";
  eatingSchedule?: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  };
  // Diet & Restrictions
  dietaryType?: "vegan" | "vegetarian" | "halal" | "keto" | "low-sodium" | "general";
  dietaryRestrictions?: string[];
  allergies?: string[];
  healthConditions?: string[];
  // Budget & Shopping
  weeklyBudget?: number;
  budgetRange?: {
    min: number;
    max: number;
  };
  preferredStores?: string[];
  priceSensitivity?: "low" | "medium" | "high";
  // Culinary
  preferredCuisines?: string[];
  mealPrepPreference?: "quick" | "diverse" | "budget" | "high-protein";
  // Sustainability
  wasteSensitivityLevel?: "low" | "medium" | "high";
  sustainabilityPreference?: "minimal" | "moderate" | "high";
  leftoverComfortLevel?: "low" | "medium" | "high";
  // Nutrition Goals
  dailyCalories?: number;
  macroGoal?: {
    protein?: number;
    carbs?: number;
    fats?: number;
  };
  vitaminsFocus?: string[];
  avoidExcess?: string[];
}

/**
 * Get family preferences
 */
export async function getFamilyPreferences(
  token: string
): Promise<FamilyPreferences | null> {
  await delay(50);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  if (!currentUser.householdId) {
    return null;
  }

  return db.familyPreferences
    .where("householdId")
    .equals(currentUser.householdId)
    .first();
}

/**
 * Update or create family preferences
 */
export async function updateFamilyPreferences(
  token: string,
  input: UpdateFamilyPreferencesInput
): Promise<FamilyPreferences> {
  await delay(50);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  if (!currentUser.householdId) {
    throw new Error("User is not part of a household");
  }

  const existing = await db.familyPreferences
    .where("householdId")
    .equals(currentUser.householdId)
    .first();

  const now = getTimestamp();

  if (existing) {
    const updated: FamilyPreferences = {
      ...existing,
      ...input,
      updatedAt: now,
    };
    await db.familyPreferences.update(existing.id, updated);
    return updated;
  } else {
    const newPrefs: FamilyPreferences = {
      id: generateId(),
      householdId: currentUser.householdId,
      householdSize: input.householdSize || 1,
      ageGroups: input.ageGroups,
      cookingFrequency: input.cookingFrequency,
      eatingSchedule: input.eatingSchedule,
      dietaryType: input.dietaryType || "general",
      dietaryRestrictions: input.dietaryRestrictions || [],
      allergies: input.allergies || [],
      healthConditions: input.healthConditions || [],
      weeklyBudget: input.weeklyBudget,
      budgetRange: input.budgetRange || { min: 0, max: 1000 },
      preferredStores: input.preferredStores || [],
      priceSensitivity: input.priceSensitivity,
      preferredCuisines: input.preferredCuisines || [],
      mealPrepPreference: input.mealPrepPreference,
      wasteSensitivityLevel: input.wasteSensitivityLevel,
      sustainabilityPreference: input.sustainabilityPreference,
      leftoverComfortLevel: input.leftoverComfortLevel,
      dailyCalories: input.dailyCalories,
      macroGoal: input.macroGoal,
      vitaminsFocus: input.vitaminsFocus || [],
      avoidExcess: input.avoidExcess || [],
      createdAt: now,
      updatedAt: now,
    };
    await db.familyPreferences.add(newPrefs);
    return newPrefs;
  }
}

