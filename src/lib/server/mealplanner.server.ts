import { db, MealPlan } from "./db";
import { generateId, getTimestamp, delay } from "./helpers";
import { getCurrentUser } from "./auth.server";

export interface CreateMealPlanInput {
  date: string; // YYYY-MM-DD
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  name: string;
  description?: string;
  ingredients?: string[];
  servings?: number;
}

export interface UpdateMealPlanInput {
  name?: string;
  description?: string;
  ingredients?: string[];
  servings?: number;
}

export interface WeeklyMealPlan {
  [date: string]: {
    breakfast?: MealPlan;
    lunch?: MealPlan;
    dinner?: MealPlan;
    snack?: MealPlan;
  };
}

/**
 * Get weekly meal plan for a user
 */
export async function getWeeklyMeals(
  token: string,
  startDate?: string
): Promise<WeeklyMealPlan> {
  await delay(50);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const start = startDate
    ? new Date(startDate)
    : new Date(new Date().setDate(new Date().getDate() - new Date().getDay()));

  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  const meals = await db.mealPlans
    .where("userId")
    .equals(currentUser.id)
    .filter((meal) => {
      const mealDate = new Date(meal.date);
      return mealDate >= start && mealDate < end;
    })
    .toArray();

  const weeklyPlan: WeeklyMealPlan = {};

  meals.forEach((meal) => {
    if (!weeklyPlan[meal.date]) {
      weeklyPlan[meal.date] = {};
    }
    weeklyPlan[meal.date][meal.mealType] = meal;
  });

  // If no meals exist, generate dynamic meal suggestions for the week
  if (meals.length === 0) {
    const breakfastOptions = [
      { name: "Scrambled Eggs", description: "With toast and fresh fruit", servings: 4 },
      { name: "Oatmeal", description: "With bananas and honey", servings: 4 },
      { name: "Yogurt Parfait", description: "Greek yogurt with granola and berries", servings: 4 },
      { name: "Pancakes", description: "Whole wheat pancakes with maple syrup", servings: 4 },
      { name: "Avocado Toast", description: "Whole grain bread with avocado and eggs", servings: 4 },
      { name: "Smoothie Bowl", description: "Mixed fruits with yogurt and nuts", servings: 4 },
      { name: "Breakfast Burrito", description: "Eggs, cheese, and vegetables wrapped in tortilla", servings: 4 },
    ];

    const lunchOptions = [
      { name: "Chicken Salad", description: "Mixed greens with grilled chicken and vegetables", servings: 4 },
      { name: "Vegetable Soup", description: "Homemade soup with seasonal vegetables", servings: 4 },
      { name: "Rice Bowl", description: "Brown rice with vegetables and protein", servings: 4 },
      { name: "Sandwich", description: "Whole grain bread with fresh vegetables and protein", servings: 4 },
      { name: "Pasta Salad", description: "Cold pasta with vegetables and dressing", servings: 4 },
      { name: "Wrap", description: "Tortilla wrap with vegetables and hummus", servings: 4 },
      { name: "Quinoa Bowl", description: "Quinoa with roasted vegetables and tahini", servings: 4 },
    ];

    const dinnerOptions = [
      { name: "Pasta with Vegetables", description: "Whole wheat pasta with seasonal vegetables", servings: 4 },
      { name: "Grilled Chicken", description: "With roasted vegetables and rice", servings: 4 },
      { name: "Stir Fry", description: "Mixed vegetables with tofu and rice", servings: 4 },
      { name: "Salmon", description: "Baked salmon with steamed vegetables", servings: 4 },
      { name: "Vegetable Curry", description: "Curry with rice and naan", servings: 4 },
      { name: "Pizza", description: "Homemade pizza with fresh toppings", servings: 4 },
      { name: "Tacos", description: "Vegetable and bean tacos with salsa", servings: 4 },
    ];

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];

      weeklyPlan[dateStr] = {
        breakfast: {
          id: generateId(),
          userId: currentUser.id,
          householdId: currentUser.householdId,
          date: dateStr,
          mealType: "breakfast",
          ...breakfastOptions[i % breakfastOptions.length],
          createdAt: getTimestamp(),
          updatedAt: getTimestamp(),
        },
        lunch: {
          id: generateId(),
          userId: currentUser.id,
          householdId: currentUser.householdId,
          date: dateStr,
          mealType: "lunch",
          ...lunchOptions[i % lunchOptions.length],
          createdAt: getTimestamp(),
          updatedAt: getTimestamp(),
        },
        dinner: {
          id: generateId(),
          userId: currentUser.id,
          householdId: currentUser.householdId,
          date: dateStr,
          mealType: "dinner",
          ...dinnerOptions[i % dinnerOptions.length],
          createdAt: getTimestamp(),
          updatedAt: getTimestamp(),
        },
      };
    }
  }

  return weeklyPlan;
}

/**
 * Update or create a meal slot
 */
export async function updateMealSlot(
  token: string,
  input: CreateMealPlanInput
): Promise<MealPlan> {
  await delay(50);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const existing = await db.mealPlans
    .where("[userId+date+mealType]")
    .equals([currentUser.id, input.date, input.mealType])
    .first();

  const now = getTimestamp();

  if (existing) {
    const updated: MealPlan = {
      ...existing,
      name: input.name,
      description: input.description,
      ingredients: input.ingredients,
      servings: input.servings,
      updatedAt: now,
    };
    await db.mealPlans.update(existing.id, updated);
    return updated;
  } else {
    const newMeal: MealPlan = {
      id: generateId(),
      userId: currentUser.id,
      householdId: currentUser.householdId,
      date: input.date,
      mealType: input.mealType,
      name: input.name,
      description: input.description,
      ingredients: input.ingredients,
      servings: input.servings,
      createdAt: now,
      updatedAt: now,
    };
    await db.mealPlans.add(newMeal);
    return newMeal;
  }
}

/**
 * Delete a meal slot
 */
export async function deleteMealSlot(
  token: string,
  mealId: string
): Promise<void> {
  await delay(50);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const meal = await db.mealPlans.get(mealId);
  if (!meal || meal.userId !== currentUser.id) {
    throw new Error("Meal not found");
  }

  await db.mealPlans.delete(mealId);
}

