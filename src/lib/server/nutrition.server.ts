import { db, NutritionData } from "./db";
import { generateId, getTimestamp, delay } from "./helpers";
import { getCurrentUser } from "./auth.server";

export interface DailyNutrition {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  sugar: number;
  sodium: number;
  vitaminA: number;
  vitaminB: number;
  vitaminC: number;
  vitaminD: number;
  iron: number;
  calcium: number;
  nutritionScore: number;
}

export interface NutritionWarning {
  type: "high" | "low" | "missing";
  nutrient: string;
  message: string;
  severity: "info" | "warning" | "critical";
  currentValue: number;
  recommendedValue: number;
}

export interface NutritionSuggestion {
  type: "increase" | "decrease" | "add";
  nutrient: string;
  message: string;
  suggestion: string;
  priority: "low" | "medium" | "high";
}

export interface HealthyPlateStatus {
  protein: number; // percentage
  carbs: number;
  vegetables: number;
  fruits: number;
  grains: number;
  score: number; // 0-100
}

export interface WeeklyNutritionScore {
  date: string;
  score: number;
}

/**
 * Get daily nutrition data for a specific date
 */
export async function getDailyNutrition(
  token: string,
  date?: string
): Promise<DailyNutrition | null> {
  await delay(150);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const targetDate = date || new Date().toISOString().split("T")[0];
  
  const nutrition = await db.nutritionData
    .where("[userId+date]")
    .equals([currentUser.id, targetDate])
    .first();

  if (nutrition) {
    return {
      date: nutrition.date,
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fats: nutrition.fats,
      fiber: nutrition.fiber,
      sugar: nutrition.sugar,
      sodium: nutrition.sodium,
      vitaminA: nutrition.vitaminA,
      vitaminB: nutrition.vitaminB,
      vitaminC: nutrition.vitaminC,
      vitaminD: nutrition.vitaminD,
      iron: nutrition.iron,
      calcium: nutrition.calcium,
      nutritionScore: nutrition.nutritionScore || 75,
    };
  }

  return null;
}

/**
 * Get weekly nutrition data (last 7 days)
 */
export async function getWeeklyNutrition(
  token: string
): Promise<DailyNutrition[]> {
  await delay(150);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const nutritionData = await db.nutritionData
    .where("userId")
    .equals(currentUser.id)
    .filter((data) => {
      const dataDate = new Date(data.date);
      return dataDate >= sevenDaysAgo && dataDate <= today;
    })
    .toArray();

  // Sort by date
  nutritionData.sort((a, b) => a.date.localeCompare(b.date));

  return nutritionData.map((data) => ({
    date: data.date,
    calories: data.calories,
    protein: data.protein,
    carbs: data.carbs,
    fats: data.fats,
    fiber: data.fiber,
    sugar: data.sugar,
    sodium: data.sodium,
    vitaminA: data.vitaminA,
    vitaminB: data.vitaminB,
    vitaminC: data.vitaminC,
    vitaminD: data.vitaminD,
    iron: data.iron,
    calcium: data.calcium,
    nutritionScore: data.nutritionScore || 75,
  }));
}

/**
 * Get nutrition warnings for today
 */
export async function getNutritionWarnings(
  token: string
): Promise<NutritionWarning[]> {
  await delay(150);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const today = new Date().toISOString().split("T")[0];
  const nutrition = await getDailyNutrition(token, today);

  if (!nutrition) {
    return [];
  }

  const warnings: NutritionWarning[] = [];
  const preferences = await db.familyPreferences
    .where("householdId")
    .equals(currentUser.householdId || "")
    .first();

  // Check daily calories
  const targetCalories = preferences?.dailyCalories || 2000;
  if (nutrition.calories > targetCalories * 1.2) {
    warnings.push({
      type: "high",
      nutrient: "Calories",
      message: `High calorie intake: ${Math.round(nutrition.calories)} (target: ${targetCalories})`,
      severity: "warning",
      currentValue: nutrition.calories,
      recommendedValue: targetCalories,
    });
  } else if (nutrition.calories < targetCalories * 0.8) {
    warnings.push({
      type: "low",
      nutrient: "Calories",
      message: `Low calorie intake: ${Math.round(nutrition.calories)} (target: ${targetCalories})`,
      severity: "info",
      currentValue: nutrition.calories,
      recommendedValue: targetCalories,
    });
  }

  // Check protein (recommended: 0.8g per kg body weight, assume 70kg = 56g minimum)
  const minProtein = 56;
  const maxProtein = 150;
  if (nutrition.protein < minProtein) {
    warnings.push({
      type: "low",
      nutrient: "Protein",
      message: `Low protein: ${Math.round(nutrition.protein)}g (recommended: ${minProtein}-${maxProtein}g)`,
      severity: "warning",
      currentValue: nutrition.protein,
      recommendedValue: minProtein,
    });
  } else if (nutrition.protein > maxProtein) {
    warnings.push({
      type: "high",
      nutrient: "Protein",
      message: `Very high protein: ${Math.round(nutrition.protein)}g`,
      severity: "info",
      currentValue: nutrition.protein,
      recommendedValue: maxProtein,
    });
  }

  // Check sugar (recommended: <50g per day)
  if (nutrition.sugar > 50) {
    warnings.push({
      type: "high",
      nutrient: "Sugar",
      message: `High sugar intake: ${Math.round(nutrition.sugar)}g (recommended: <50g)`,
      severity: "warning",
      currentValue: nutrition.sugar,
      recommendedValue: 50,
    });
  }

  // Check sodium (recommended: <2300mg per day)
  if (nutrition.sodium > 2300) {
    warnings.push({
      type: "high",
      nutrient: "Sodium",
      message: `High sodium: ${Math.round(nutrition.sodium)}mg (recommended: <2300mg)`,
      severity: "critical",
      currentValue: nutrition.sodium,
      recommendedValue: 2300,
    });
  }

  // Check fiber (recommended: 25-30g per day)
  if (nutrition.fiber < 25) {
    warnings.push({
      type: "low",
      nutrient: "Fiber",
      message: `Low fiber: ${Math.round(nutrition.fiber)}g (recommended: 25-30g)`,
      severity: "info",
      currentValue: nutrition.fiber,
      recommendedValue: 25,
    });
  }

  // Check iron (recommended: 18mg for adults)
  if (nutrition.iron < 15) {
    warnings.push({
      type: "low",
      nutrient: "Iron",
      message: `Low iron: ${Math.round(nutrition.iron)}mg (recommended: 18mg)`,
      severity: "warning",
      currentValue: nutrition.iron,
      recommendedValue: 18,
    });
  }

  // Check vitamin D (recommended: 600-800 IU)
  if (nutrition.vitaminD < 400) {
    warnings.push({
      type: "low",
      nutrient: "Vitamin D",
      message: `Low vitamin D: ${Math.round(nutrition.vitaminD)} IU (recommended: 600-800 IU)`,
      severity: "info",
      currentValue: nutrition.vitaminD,
      recommendedValue: 600,
    });
  }

  return warnings;
}

/**
 * Get nutrition suggestions
 */
export async function getNutritionSuggestions(
  token: string
): Promise<NutritionSuggestion[]> {
  await delay(150);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const today = new Date().toISOString().split("T")[0];
  const nutrition = await getDailyNutrition(token, today);
  const warnings = await getNutritionWarnings(token);

  if (!nutrition) {
    return [
      {
        type: "add",
        nutrient: "All Nutrients",
        message: "Start logging your meals to track nutrition",
        suggestion: "Add meals to your meal planner and log consumption",
        priority: "high",
      },
    ];
  }

  const suggestions: NutritionSuggestion[] = [];

  // Generate suggestions based on warnings
  warnings.forEach((warning) => {
    if (warning.type === "low") {
      suggestions.push({
        type: "increase",
        nutrient: warning.nutrient,
        message: `Increase ${warning.nutrient} intake`,
        suggestion: getSuggestionForNutrient(warning.nutrient, "increase"),
        priority: warning.severity === "critical" ? "high" : warning.severity === "warning" ? "medium" : "low",
      });
    } else if (warning.type === "high") {
      suggestions.push({
        type: "decrease",
        nutrient: warning.nutrient,
        message: `Reduce ${warning.nutrient} intake`,
        suggestion: getSuggestionForNutrient(warning.nutrient, "decrease"),
        priority: warning.severity === "critical" ? "high" : warning.severity === "warning" ? "medium" : "low",
      });
    }
  });

  // Add general suggestions
  if (nutrition.fiber < 25) {
    suggestions.push({
      type: "increase",
      nutrient: "Fiber",
      message: "Add more fiber-rich foods",
      suggestion: "Include whole grains, fruits, and vegetables in your meals",
      priority: "medium",
    });
  }

  if (nutrition.vitaminC < 75) {
    suggestions.push({
      type: "increase",
      nutrient: "Vitamin C",
      message: "Boost your vitamin C intake",
      suggestion: "Add citrus fruits, bell peppers, or broccoli to your meals",
      priority: "low",
    });
  }

  return suggestions.slice(0, 5); // Limit to 5 suggestions
}

function getSuggestionForNutrient(nutrient: string, action: "increase" | "decrease"): string {
  const suggestions: Record<string, Record<string, string>> = {
    Protein: {
      increase: "Add lean meats, eggs, legumes, or dairy products to your meals",
      decrease: "Reduce portion sizes of protein-rich foods",
    },
    Calories: {
      increase: "Add healthy snacks like nuts, fruits, or yogurt between meals",
      decrease: "Reduce portion sizes and choose lower-calorie options",
    },
    Sugar: {
      increase: "",
      decrease: "Limit processed foods, sweets, and sugary drinks. Choose whole fruits instead",
    },
    Sodium: {
      increase: "",
      decrease: "Reduce salt in cooking, avoid processed foods, and read food labels",
    },
    Fiber: {
      increase: "Add whole grains, fruits, vegetables, and legumes to your diet",
      decrease: "",
    },
    Iron: {
      increase: "Include lean meats, spinach, lentils, and fortified cereals",
      decrease: "",
    },
    "Vitamin D": {
      increase: "Get sunlight exposure, eat fatty fish, or consider fortified foods",
      decrease: "",
    },
  };

  return suggestions[nutrient]?.[action] || "Consult with a nutritionist for personalized advice";
}

/**
 * Calculate nutrition score (0-100)
 */
export async function getNutritionScore(
  token: string,
  date?: string
): Promise<number> {
  await delay(150);

  const nutrition = await getDailyNutrition(token, date);
  if (!nutrition) {
    return 0;
  }

  let score = 100;

  // Deduct points for issues
  const targetCalories = 2000;
  const calorieDiff = Math.abs(nutrition.calories - targetCalories) / targetCalories;
  score -= Math.min(calorieDiff * 20, 20);

  if (nutrition.protein < 56) {
    score -= 15;
  } else if (nutrition.protein > 150) {
    score -= 5;
  }

  if (nutrition.sugar > 50) {
    score -= 10;
  }

  if (nutrition.sodium > 2300) {
    score -= 15;
  }

  if (nutrition.fiber < 25) {
    score -= 10;
  }

  if (nutrition.iron < 15) {
    score -= 10;
  }

  if (nutrition.vitaminD < 400) {
    score -= 5;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Get healthy plate status
 */
export async function getHealthyPlateStatus(
  token: string
): Promise<HealthyPlateStatus> {
  await delay(150);

  const nutrition = await getDailyNutrition(token);
  if (!nutrition) {
    return {
      protein: 0,
      carbs: 0,
      vegetables: 0,
      fruits: 0,
      grains: 0,
      score: 0,
    };
  }

  // Calculate percentages based on recommended plate model
  // Ideal: 25% protein, 25% grains, 30% vegetables, 10% fruits, 10% dairy/other
  const totalCalories = nutrition.calories || 2000;
  const proteinCalories = nutrition.protein * 4;
  const carbCalories = nutrition.carbs * 4;
  
  const proteinPercent = Math.min(100, (proteinCalories / totalCalories) * 100);
  const carbsPercent = Math.min(100, (carbCalories / totalCalories) * 100);
  
  // Estimate vegetables and fruits from fiber and vitamins
  const vegetablesPercent = Math.min(30, (nutrition.fiber / 30) * 30);
  const fruitsPercent = Math.min(10, (nutrition.vitaminC / 90) * 10);
  const grainsPercent = Math.max(0, carbsPercent - vegetablesPercent - fruitsPercent);

  // Calculate score based on how close to ideal
  let score = 100;
  score -= Math.abs(proteinPercent - 25) * 0.5;
  score -= Math.abs(carbsPercent - 35) * 0.3;
  score -= Math.abs(vegetablesPercent - 30) * 0.4;
  score -= Math.abs(fruitsPercent - 10) * 0.3;
  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    protein: Math.round(proteinPercent),
    carbs: Math.round(carbsPercent),
    vegetables: Math.round(vegetablesPercent),
    fruits: Math.round(fruitsPercent),
    grains: Math.round(grainsPercent),
    score,
  };
}

/**
 * Get weekly nutrition scores
 */
export async function getWeeklyNutritionScores(
  token: string
): Promise<WeeklyNutritionScore[]> {
  await delay(150);

  const weeklyNutrition = await getWeeklyNutrition(token);
  
  return weeklyNutrition.map((day) => ({
    date: day.date,
    score: day.nutritionScore,
  }));
}

/**
 * Get nutrition badges
 */
export async function getNutritionBadges(
  token: string
): Promise<Array<{ badgeId: string; name: string; description: string; unlocked: boolean; progress: number }>> {
  await delay(150);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const weeklyNutrition = await getWeeklyNutrition(token);
  const unlockedBadges = await db.badges
    .where("userId")
    .equals(currentUser.id)
    .toArray();

  const unlockedIds = new Set(unlockedBadges.map((b) => b.badgeId));

  const nutritionBadges = [
    {
      badgeId: "healthy-streak",
      name: "Healthy Streak",
      description: "7 days of balanced nutrition",
      unlocked: unlockedIds.has("healthy-streak"),
      progress: weeklyNutrition.filter((d) => d.nutritionScore >= 70).length / 7 * 100,
    },
    {
      badgeId: "balanced-week",
      name: "Balanced Week",
      description: "Maintained balanced macros for 7 days",
      unlocked: unlockedIds.has("balanced-week"),
      progress: weeklyNutrition.filter((d) => {
        const proteinPercent = (d.protein * 4 / d.calories) * 100;
        return proteinPercent >= 20 && proteinPercent <= 30;
      }).length / 7 * 100,
    },
    {
      badgeId: "high-protein-day",
      name: "High Protein Day",
      description: "Achieved 100g+ protein in a day",
      unlocked: unlockedIds.has("high-protein-day"),
      progress: weeklyNutrition.some((d) => d.protein >= 100) ? 100 : 0,
    },
    {
      badgeId: "low-sugar-week",
      name: "Low Sugar Week",
      description: "Kept sugar under 50g for 7 days",
      unlocked: unlockedIds.has("low-sugar-week"),
      progress: weeklyNutrition.filter((d) => d.sugar < 50).length / 7 * 100,
    },
    {
      badgeId: "vitamin-champion",
      name: "Vitamin Champion",
      description: "Met all vitamin targets for a week",
      unlocked: unlockedIds.has("vitamin-champion"),
      progress: weeklyNutrition.filter((d) => 
        d.vitaminA >= 5000 && d.vitaminC >= 75 && d.vitaminD >= 600
      ).length / 7 * 100,
    },
  ];

  return nutritionBadges;
}

