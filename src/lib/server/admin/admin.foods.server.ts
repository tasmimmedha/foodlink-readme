import { db, FoodItem } from "../db";
import { generateId, getTimestamp, delay } from "../helpers";

export interface CreateFoodItemData {
  name: string;
  category: string;
  typicalExpiryDays: number;
  storageTips?: string;
}

export interface UpdateFoodItemData {
  name?: string;
  category?: string;
  typicalExpiryDays?: number;
  storageTips?: string;
}

export interface FoodItemWithStats extends FoodItem {
  usageCount: number;
  wasteRate: number;
  avgConsumption: number;
}

/**
 * Get all food items with optional filters
 */
export async function getFoodItems(filters?: {
  category?: string;
  search?: string;
}): Promise<FoodItem[]> {
  await delay(150);

  let items = await db.foodItems.toArray();

  if (filters?.category) {
    items = items.filter((item) => item.category === filters.category);
  }

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    items = items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower)
    );
  }

  return items.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get food item by ID
 */
export async function getFoodItemById(id: string): Promise<FoodItem | null> {
  await delay(100);
  return db.foodItems.get(id) || null;
}

/**
 * Get food items with statistics
 */
export async function getFoodItemsWithStats(): Promise<FoodItemWithStats[]> {
  await delay(200);

  const foodItems = await db.foodItems.toArray();
  const inventory = await db.inventory.toArray();
  const logs = await db.logs.toArray();

  // Calculate usage and waste stats
  const foodUsageCount: Record<string, number> = {};
  const foodWasteCount: Record<string, number> = {};
  const foodTotalCount: Record<string, number> = {};
  const foodConsumptionTotal: Record<string, number> = {};

  inventory.forEach((item) => {
    if (item.foodItemId) {
      foodUsageCount[item.foodItemId] = (foodUsageCount[item.foodItemId] || 0) + 1;
    }
  });

  logs.forEach((log) => {
    const foodItem = foodItems.find((f) => f.name.toLowerCase() === log.foodName.toLowerCase());
    if (foodItem) {
      foodTotalCount[foodItem.id] = (foodTotalCount[foodItem.id] || 0) + 1;
      foodConsumptionTotal[foodItem.id] =
        (foodConsumptionTotal[foodItem.id] || 0) + (log.quantity || 0);
      if (log.wasWasted) {
        foodWasteCount[foodItem.id] = (foodWasteCount[foodItem.id] || 0) + 1;
      }
    }
  });

  return foodItems.map((item) => ({
    ...item,
    usageCount: foodUsageCount[item.id] || 0,
    wasteRate:
      foodTotalCount[item.id] > 0
        ? (foodWasteCount[item.id] || 0) / foodTotalCount[item.id]
        : 0,
    avgConsumption:
      foodTotalCount[item.id] > 0
        ? foodConsumptionTotal[item.id] / foodTotalCount[item.id]
        : 0,
  }));
}

/**
 * Create a new food item
 */
export async function createFoodItem(data: CreateFoodItemData): Promise<FoodItem> {
  await delay(200);

  // Check if food item with same name already exists
  const existing = await db.foodItems
    .where("name")
    .equals(data.name.toLowerCase())
    .first();

  if (existing) {
    throw new Error("Food item with this name already exists");
  }

  const now = getTimestamp();
  const foodItem: FoodItem = {
    id: generateId(),
    name: data.name.trim(),
    category: data.category.trim(),
    typicalExpiryDays: data.typicalExpiryDays,
    storageTips: data.storageTips?.trim(),
    createdAt: now,
    updatedAt: now,
  };

  await db.foodItems.add(foodItem);
  return foodItem;
}

/**
 * Update a food item
 */
export async function updateFoodItem(
  id: string,
  data: UpdateFoodItemData
): Promise<FoodItem> {
  await delay(200);

  const existing = await db.foodItems.get(id);
  if (!existing) {
    throw new Error("Food item not found");
  }

  // Check name uniqueness if name is being changed
  if (data.name && data.name !== existing.name) {
    const duplicate = await db.foodItems
      .where("name")
      .equals(data.name.toLowerCase())
      .first();
    if (duplicate) {
      throw new Error("Food item with this name already exists");
    }
  }

  const updates: Partial<FoodItem> = {
    ...data,
    updatedAt: getTimestamp(),
  };

  if (data.name) {
    updates.name = data.name.trim();
  }
  if (data.category) {
    updates.category = data.category.trim();
  }
  if (data.storageTips !== undefined) {
    updates.storageTips = data.storageTips?.trim();
  }

  await db.foodItems.update(id, updates);

  const updated = await db.foodItems.get(id);
  if (!updated) {
    throw new Error("Failed to update food item");
  }

  return updated;
}

/**
 * Delete a food item
 */
export async function deleteFoodItem(id: string): Promise<void> {
  await delay(200);

  const foodItem = await db.foodItems.get(id);
  if (!foodItem) {
    throw new Error("Food item not found");
  }

  // Check if food item is used in inventory
  const inventoryCount = await db.inventory.where("foodItemId").equals(id).count();
  if (inventoryCount > 0) {
    throw new Error(
      `Cannot delete food item: it is used in ${inventoryCount} inventory item(s). Please remove or update those items first.`
    );
  }

  await db.foodItems.delete(id);
}

/**
 * Bulk delete food items
 */
export async function bulkDeleteFoodItems(ids: string[]): Promise<void> {
  await delay(300);

  // Check for dependencies
  for (const id of ids) {
    const inventoryCount = await db.inventory.where("foodItemId").equals(id).count();
    if (inventoryCount > 0) {
      throw new Error(
        `Cannot delete food item ${id}: it is used in ${inventoryCount} inventory item(s).`
      );
    }
  }

  await db.foodItems.bulkDelete(ids);
}

/**
 * Get all unique categories
 */
export async function getCategories(): Promise<string[]> {
  await delay(100);
  const foodItems = await db.foodItems.toArray();
  const categories = new Set(foodItems.map((item) => item.category));
  return Array.from(categories).sort();
}

/**
 * Get category statistics
 */
export async function getCategoryStats(): Promise<
  Array<{
    category: string;
    itemCount: number;
    usageCount: number;
    wasteCount: number;
  }>
> {
  await delay(200);

  const foodItems = await db.foodItems.toArray();
  const inventory = await db.inventory.toArray();
  const logs = await db.logs.toArray();

  const categoryStats: Record<
    string,
    { itemCount: number; usageCount: number; wasteCount: number }
  > = {};

  // Count items per category
  foodItems.forEach((item) => {
    if (!categoryStats[item.category]) {
      categoryStats[item.category] = { itemCount: 0, usageCount: 0, wasteCount: 0 };
    }
    categoryStats[item.category].itemCount += 1;
  });

  // Count usage per category
  inventory.forEach((item) => {
    if (item.category && categoryStats[item.category]) {
      categoryStats[item.category].usageCount += 1;
    }
  });

  // Count waste per category
  logs.forEach((log) => {
    if (log.category && log.wasWasted && categoryStats[log.category]) {
      categoryStats[log.category].wasteCount += 1;
    }
  });

  return Object.entries(categoryStats)
    .map(([category, stats]) => ({
      category,
      ...stats,
    }))
    .sort((a, b) => a.category.localeCompare(b.category));
}

