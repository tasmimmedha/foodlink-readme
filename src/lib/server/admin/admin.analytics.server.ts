import { db } from "../db";
import { delay } from "../helpers";

export interface SystemStats {
  totalUsers: number;
  totalFoodItems: number;
  totalInventoryItems: number;
  totalConsumptionLogs: number;
  totalMealPlans: number;
  totalShoppingLists: number;
  totalBadges: number;
  totalResources: number;
  totalCommunityPosts: number;
  totalRestaurantInventory: number;
  totalShopInventory: number;
  totalNGOOffers: number;
}

export interface UserAnalytics {
  activeUsers: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  newRegistrations: {
    last7Days: number;
    last30Days: number;
  };
  userGrowth: Array<{
    date: string;
    count: number;
  }>;
  roleDistribution: Array<{
    role: string;
    count: number;
  }>;
  engagement: {
    avgInventoryItems: number;
    avgConsumptionLogs: number;
    avgMealPlans: number;
    avgBadges: number;
  };
}

export interface FoodAnalytics {
  popularFoods: Array<{
    name: string;
    category: string;
    usageCount: number;
    wasteRate: number;
  }>;
  mostWastedFoods: Array<{
    name: string;
    category: string;
    wasteCount: number;
    wasteRate: number;
  }>;
  categoryTrends: Array<{
    category: string;
    consumptionCount: number;
    wasteCount: number;
  }>;
  expiryPatterns: Array<{
    category: string;
    avgExpiryDays: number;
    typicalExpiryDays: number;
  }>;
}

export interface NutritionAnalytics {
  avgNutritionScore: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  nutrientGaps: Array<{
    nutrient: string;
    deficiencyCount: number;
    avgIntake: number;
    recommendedIntake: number;
  }>;
  macroDistribution: {
    avgProtein: number;
    avgCarbs: number;
    avgFats: number;
  };
  vitaminTrends: Array<{
    vitamin: string;
    avgIntake: number;
    recommendedIntake: number;
    deficiencyRate: number;
  }>;
}

export interface WasteAnalytics {
  totalWastePrevented: number; // kg
  wasteByCategory: Array<{
    category: string;
    wasteKg: number;
    wasteCount: number;
  }>;
  wasteReductionTrends: Array<{
    month: string;
    wasteKg: number;
    wasteReduction: number; // percentage
  }>;
  communityImpact: {
    totalSurplusShared: number; // kg
    totalMealsProvided: number;
    co2Prevented: number; // kg
    waterSaved: number; // liters
  };
}

export interface BusinessAnalytics {
  restaurants: {
    activeCount: number;
    totalDonations: number;
    totalSurplusItems: number;
  };
  shops: {
    activeCount: number;
    totalDiscountSuggestions: number;
    totalSurplusRedirected: number;
  };
  ngos: {
    activeCount: number;
    totalPickups: number;
    totalMealsProvided: number;
    totalPartners: number;
  };
}

/**
 * Get system statistics
 */
export async function getSystemStats(): Promise<SystemStats> {
  await delay(200);

  const [
    totalUsers,
    totalFoodItems,
    totalInventoryItems,
    totalConsumptionLogs,
    totalMealPlans,
    totalShoppingLists,
    totalBadges,
    totalResources,
    totalCommunityPosts,
    totalRestaurantInventory,
    totalShopInventory,
    totalNGOOffers,
  ] = await Promise.all([
    db.users.count(),
    db.foodItems.count(),
    db.inventory.count(),
    db.logs.count(),
    db.mealPlans.count(),
    db.shoppingList.count(),
    db.badges.count(),
    db.resources.count(),
    db.communitySurplusPosts.count(),
    db.restaurantInventory.count(),
    db.shopInventory.count(),
    db.ngoOffers.count(),
  ]);

  return {
    totalUsers,
    totalFoodItems,
    totalInventoryItems,
    totalConsumptionLogs,
    totalMealPlans,
    totalShoppingLists,
    totalBadges,
    totalResources,
    totalCommunityPosts,
    totalRestaurantInventory,
    totalShopInventory,
    totalNGOOffers,
  };
}

/**
 * Get user analytics
 */
export async function getUserAnalytics(): Promise<UserAnalytics> {
  await delay(300);

  const users = await db.users.toArray();
  const logs = await db.logs.toArray();
  const inventory = await db.inventory.toArray();
  const mealPlans = await db.mealPlans.toArray();
  const badges = await db.badges.toArray();

  const now = new Date();
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Active users
  const dailyActive = new Set(
    logs
      .filter((log) => new Date(log.consumedAt) >= new Date(now.getTime() - 24 * 60 * 60 * 1000))
      .map((log) => log.userId)
  ).size;

  const weeklyActive = new Set(
    logs
      .filter((log) => new Date(log.consumedAt) >= last7Days)
      .map((log) => log.userId)
  ).size;

  const monthlyActive = new Set(
    logs.filter((log) => new Date(log.consumedAt) >= last30Days).map((log) => log.userId)
  ).size;

  // New registrations
  const newRegistrations7Days = users.filter(
    (user) => new Date(user.createdAt) >= last7Days
  ).length;
  const newRegistrations30Days = users.filter(
    (user) => new Date(user.createdAt) >= last30Days
  ).length;

  // User growth (last 30 days, grouped by day)
  const growthData: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split("T")[0];
    growthData[dateStr] = users.filter(
      (user) => new Date(user.createdAt).toISOString().split("T")[0] <= dateStr
    ).length;
  }

  const userGrowth = Object.entries(growthData).map(([date, count]) => ({
    date,
    count,
  }));

  // Role distribution (simplified - all users are "family" by default in current system)
  const roleDistribution = [
    { role: "family", count: users.length },
    { role: "restaurant", count: 0 },
    { role: "shop", count: 0 },
    { role: "ngo", count: 0 },
    { role: "admin", count: 0 },
  ];

  // Engagement metrics
  const userIds = new Set(users.map((u) => u.id));
  const avgInventoryItems = inventory.length / (userIds.size || 1);
  const avgConsumptionLogs = logs.length / (userIds.size || 1);
  const avgMealPlans = mealPlans.length / (userIds.size || 1);
  const avgBadges = badges.length / (userIds.size || 1);

  return {
    activeUsers: {
      daily: dailyActive,
      weekly: weeklyActive,
      monthly: monthlyActive,
    },
    newRegistrations: {
      last7Days: newRegistrations7Days,
      last30Days: newRegistrations30Days,
    },
    userGrowth,
    roleDistribution,
    engagement: {
      avgInventoryItems: Math.round(avgInventoryItems * 10) / 10,
      avgConsumptionLogs: Math.round(avgConsumptionLogs * 10) / 10,
      avgMealPlans: Math.round(avgMealPlans * 10) / 10,
      avgBadges: Math.round(avgBadges * 10) / 10,
    },
  };
}

/**
 * Get food analytics
 */
export async function getFoodAnalytics(): Promise<FoodAnalytics> {
  await delay(300);

  const foodItems = await db.foodItems.toArray();
  const inventory = await db.inventory.toArray();
  const logs = await db.logs.toArray();

  // Popular foods (by inventory usage)
  const foodUsageCount: Record<string, number> = {};
  inventory.forEach((item) => {
    if (item.foodItemId) {
      foodUsageCount[item.foodItemId] = (foodUsageCount[item.foodItemId] || 0) + 1;
    }
  });

  // Waste rates
  const foodWasteCount: Record<string, number> = {};
  const foodTotalCount: Record<string, number> = {};
  logs.forEach((log) => {
    const foodItem = foodItems.find((f) => f.name.toLowerCase() === log.foodName.toLowerCase());
    if (foodItem) {
      foodTotalCount[foodItem.id] = (foodTotalCount[foodItem.id] || 0) + 1;
      if (log.wasWasted) {
        foodWasteCount[foodItem.id] = (foodWasteCount[foodItem.id] || 0) + 1;
      }
    }
  });

  const popularFoods = foodItems
    .map((food) => ({
      name: food.name,
      category: food.category,
      usageCount: foodUsageCount[food.id] || 0,
      wasteRate:
        foodTotalCount[food.id] > 0
          ? (foodWasteCount[food.id] || 0) / foodTotalCount[food.id]
          : 0,
    }))
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 10);

  const mostWastedFoods = foodItems
    .map((food) => ({
      name: food.name,
      category: food.category,
      wasteCount: foodWasteCount[food.id] || 0,
      wasteRate:
        foodTotalCount[food.id] > 0
          ? (foodWasteCount[food.id] || 0) / foodTotalCount[food.id]
          : 0,
    }))
    .filter((food) => food.wasteCount > 0)
    .sort((a, b) => b.wasteCount - a.wasteCount)
    .slice(0, 10);

  // Category trends
  const categoryConsumption: Record<string, number> = {};
  const categoryWaste: Record<string, number> = {};
  logs.forEach((log) => {
    if (log.category) {
      categoryConsumption[log.category] = (categoryConsumption[log.category] || 0) + 1;
      if (log.wasWasted) {
        categoryWaste[log.category] = (categoryWaste[log.category] || 0) + 1;
      }
    }
  });

  const categoryTrends = Object.keys(categoryConsumption).map((category) => ({
    category,
    consumptionCount: categoryConsumption[category],
    wasteCount: categoryWaste[category] || 0,
  }));

  // Expiry patterns
  const expiryPatterns = foodItems.map((food) => {
    const items = inventory.filter((item) => item.foodItemId === food.id && item.expiryDate);
    const avgExpiryDays = items.length > 0
      ? items.reduce((sum, item) => {
          const days = Math.ceil(
            (new Date(item.expiryDate!).getTime() - new Date().getTime()) /
              (24 * 60 * 60 * 1000)
          );
          return sum + days;
        }, 0) / items.length
      : food.typicalExpiryDays;

    return {
      category: food.category,
      avgExpiryDays: Math.round(avgExpiryDays),
      typicalExpiryDays: food.typicalExpiryDays,
    };
  });

  return {
    popularFoods,
    mostWastedFoods,
    categoryTrends,
    expiryPatterns,
  };
}

/**
 * Get nutrition analytics
 */
export async function getNutritionAnalytics(): Promise<NutritionAnalytics> {
  await delay(300);

  const nutritionData = await db.nutritionData.toArray();
  const now = new Date();
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const dailyData = nutritionData.filter(
    (data) => new Date(data.date) >= new Date(now.getTime() - 24 * 60 * 60 * 1000)
  );
  const weeklyData = nutritionData.filter((data) => new Date(data.date) >= last7Days);
  const monthlyData = nutritionData.filter((data) => new Date(data.date) >= last30Days);

  const avgScore = (data: typeof nutritionData) =>
    data.length > 0
      ? data.reduce((sum, d) => sum + (d.nutritionScore || 0), 0) / data.length
      : 0;

  // Nutrient gaps (simplified analysis)
  const avgProtein = monthlyData.length > 0
    ? monthlyData.reduce((sum, d) => sum + d.protein, 0) / monthlyData.length
    : 0;
  const avgCarbs = monthlyData.length > 0
    ? monthlyData.reduce((sum, d) => sum + d.carbs, 0) / monthlyData.length
    : 0;
  const avgFats = monthlyData.length > 0
    ? monthlyData.reduce((sum, d) => sum + d.fats, 0) / monthlyData.length
    : 0;

  const nutrientGaps = [
    {
      nutrient: "Protein",
      deficiencyCount: monthlyData.filter((d) => d.protein < 50).length,
      avgIntake: avgProtein,
      recommendedIntake: 50,
    },
    {
      nutrient: "Fiber",
      deficiencyCount: monthlyData.filter((d) => d.fiber < 25).length,
      avgIntake:
        monthlyData.length > 0
          ? monthlyData.reduce((sum, d) => sum + d.fiber, 0) / monthlyData.length
          : 0,
      recommendedIntake: 25,
    },
    {
      nutrient: "Iron",
      deficiencyCount: monthlyData.filter((d) => d.iron < 15).length,
      avgIntake:
        monthlyData.length > 0
          ? monthlyData.reduce((sum, d) => sum + d.iron, 0) / monthlyData.length
          : 0,
      recommendedIntake: 15,
    },
  ];

  const vitaminTrends = [
    {
      vitamin: "Vitamin D",
      avgIntake:
        monthlyData.length > 0
          ? monthlyData.reduce((sum, d) => sum + d.vitaminD, 0) / monthlyData.length
          : 0,
      recommendedIntake: 400,
      deficiencyRate:
        monthlyData.length > 0
          ? monthlyData.filter((d) => d.vitaminD < 400).length / monthlyData.length
          : 0,
    },
    {
      vitamin: "Vitamin C",
      avgIntake:
        monthlyData.length > 0
          ? monthlyData.reduce((sum, d) => sum + d.vitaminC, 0) / monthlyData.length
          : 0,
      recommendedIntake: 60,
      deficiencyRate:
        monthlyData.length > 0
          ? monthlyData.filter((d) => d.vitaminC < 60).length / monthlyData.length
          : 0,
    },
    {
      vitamin: "Calcium",
      avgIntake:
        monthlyData.length > 0
          ? monthlyData.reduce((sum, d) => sum + d.calcium, 0) / monthlyData.length
          : 0,
      recommendedIntake: 1000,
      deficiencyRate:
        monthlyData.length > 0
          ? monthlyData.filter((d) => d.calcium < 1000).length / monthlyData.length
          : 0,
    },
  ];

  return {
    avgNutritionScore: {
      daily: Math.round(avgScore(dailyData)),
      weekly: Math.round(avgScore(weeklyData)),
      monthly: Math.round(avgScore(monthlyData)),
    },
    nutrientGaps,
    macroDistribution: {
      avgProtein: Math.round(avgProtein * 10) / 10,
      avgCarbs: Math.round(avgCarbs * 10) / 10,
      avgFats: Math.round(avgFats * 10) / 10,
    },
    vitaminTrends,
  };
}

/**
 * Get waste analytics
 */
export async function getWasteAnalytics(): Promise<WasteAnalytics> {
  await delay(300);

  const logs = await db.logs.toArray();
  const communityImpact = await db.communityImpact.toArray();
  const restaurantImpact = await db.restaurantImpact.toArray();

  // Calculate waste prevented (items not wasted)
  const totalWastePrevented = logs
    .filter((log) => !log.wasWasted)
    .reduce((sum, log) => sum + (log.quantity || 0), 0) / 1000; // Convert to kg

  // Waste by category
  const wasteByCategory: Record<string, { wasteKg: number; wasteCount: number }> = {};
  logs
    .filter((log) => log.wasWasted && log.category)
    .forEach((log) => {
      if (!wasteByCategory[log.category!]) {
        wasteByCategory[log.category!] = { wasteKg: 0, wasteCount: 0 };
      }
      wasteByCategory[log.category!].wasteKg += (log.quantity || 0) / 1000;
      wasteByCategory[log.category!].wasteCount += 1;
    });

  // Community impact
  const totalImpact = communityImpact[0] || {
    totalSurplusKg: 0,
    donations: 0,
    co2PreventedKg: 0,
    waterSavedLiters: 0,
    mealsProvided: 0,
  };

  const restaurantTotal = restaurantImpact[0] || {
    wastePreventedKg: 0,
    co2PreventedKg: 0,
    waterSavedLiters: 0,
  };

  return {
    totalWastePrevented: Math.round(totalWastePrevented * 10) / 10,
    wasteByCategory: Object.entries(wasteByCategory).map(([category, data]) => ({
      category,
      wasteKg: Math.round(data.wasteKg * 10) / 10,
      wasteCount: data.wasteCount,
    })),
    wasteReductionTrends: [], // Would need historical data
    communityImpact: {
      totalSurplusShared: totalImpact.totalSurplusKg || 0,
      totalMealsProvided: totalImpact.mealsProvided || 0,
      co2Prevented:
        (totalImpact.co2PreventedKg || 0) + (restaurantTotal.co2PreventedKg || 0),
      waterSaved:
        (totalImpact.waterSavedLiters || 0) + (restaurantTotal.waterSavedLiters || 0),
    },
  };
}

/**
 * Get business analytics (restaurants, shops, NGOs)
 */
export async function getBusinessAnalytics(): Promise<BusinessAnalytics> {
  await delay(200);

  const restaurantDonations = await db.restaurantDonations.toArray();
  const restaurantSurplus = await db.restaurantSurplus.toArray();
  const shopSurplus = await db.shopSurplus.toArray();
  const ngoPickups = await db.ngoPickups.toArray();
  const ngoPartners = await db.ngoPartners.toArray();
  const ngoHistory = await db.ngoHistory.toArray();

  return {
    restaurants: {
      activeCount: 1, // Simplified - would need restaurant user tracking
      totalDonations: restaurantDonations.length,
      totalSurplusItems: restaurantSurplus.length,
    },
    shops: {
      activeCount: 1, // Simplified
      totalDiscountSuggestions: 0, // Would need discount suggestions table
      totalSurplusRedirected: shopSurplus.length,
    },
    ngos: {
      activeCount: 1, // Simplified
      totalPickups: ngoPickups.length,
      totalMealsProvided: ngoHistory.reduce(
        (sum, h) => sum + (h.mealsProvided || 0),
        0
      ),
      totalPartners: ngoPartners.length,
    },
  };
}

