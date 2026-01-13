import { db, InventoryItem, FoodItem } from "./db";
import { generateId, getTimestamp, delay, calculateExpiryDate, isExpiringSoon, isExpired } from "./helpers";
import { getCurrentUser } from "./auth.server";

export interface CreateInventoryItemInput {
  name: string;
  quantity: number;
  unit?: string;
  expiryDate?: string;
  category?: string;
  location?: string;
  foodItemId?: string;
}

export interface UpdateInventoryItemInput {
  name?: string;
  quantity?: number;
  unit?: string;
  expiryDate?: string;
  category?: string;
  location?: string;
  foodItemId?: string;
}

export interface InventoryItemResponse extends InventoryItem {
  isExpiringSoon?: boolean;
  isExpired?: boolean;
  typicalExpiryDays?: number;
}

export interface InventoryFilter {
  category?: string;
  location?: string;
  expiringSoon?: boolean;
  expired?: boolean;
  search?: string;
}

/**
 * Create a new inventory item
 */
export async function createInventoryItem(
  token: string,
  input: CreateInventoryItemInput
): Promise<InventoryItemResponse> {
  await delay(50);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  let expiryDate = input.expiryDate;
  let typicalExpiryDays: number | undefined;

  // If foodItemId is provided, calculate expiry date if not provided
  if (input.foodItemId && !expiryDate) {
    const foodItem = await db.foodItems.get(input.foodItemId);
    if (foodItem) {
      typicalExpiryDays = foodItem.typicalExpiryDays;
      expiryDate = calculateExpiryDate(foodItem.typicalExpiryDays);
    }
  }

  const now = getTimestamp();
  const item: InventoryItem = {
    id: generateId(),
    userId: currentUser.id,
    name: input.name,
    quantity: input.quantity,
    unit: input.unit,
    expiryDate,
    category: input.category,
    location: input.location,
    foodItemId: input.foodItemId,
    createdAt: now,
    updatedAt: now,
  };

  await db.inventory.add(item);

  const response: InventoryItemResponse = {
    ...item,
    typicalExpiryDays,
  };

  if (expiryDate) {
    response.isExpiringSoon = isExpiringSoon(expiryDate);
    response.isExpired = isExpired(expiryDate);
  }

  return response;
}

/**
 * Get all inventory items for the current user
 */
export async function getInventoryItems(
  token: string,
  filter?: InventoryFilter
): Promise<InventoryItemResponse[]> {
  await delay(50);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  let items = await db.inventory.where("userId").equals(currentUser.id).toArray();

  // If no items exist, return demo data
  if (items.length === 0) {
    const now = new Date();
    const demoItems: InventoryItem[] = [
      {
        id: generateId(),
        userId: currentUser.id,
        name: "Organic Tomatoes",
        quantity: 2,
        unit: "lb",
        category: "vegetables",
        location: "refrigerator",
        expiryDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days
        createdAt: getTimestamp(),
        updatedAt: getTimestamp(),
      },
      {
        id: generateId(),
        userId: currentUser.id,
        name: "Fresh Spinach",
        quantity: 1,
        unit: "bunch",
        category: "vegetables",
        location: "refrigerator",
        expiryDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day
        createdAt: getTimestamp(),
        updatedAt: getTimestamp(),
      },
      {
        id: generateId(),
        userId: currentUser.id,
        name: "Free-Range Eggs",
        quantity: 12,
        unit: "eggs",
        category: "dairy",
        location: "refrigerator",
        expiryDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days
        createdAt: getTimestamp(),
        updatedAt: getTimestamp(),
      },
      {
        id: generateId(),
        userId: currentUser.id,
        name: "Whole Wheat Bread",
        quantity: 1,
        unit: "loaf",
        category: "bakery",
        location: "pantry",
        expiryDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days
        createdAt: getTimestamp(),
        updatedAt: getTimestamp(),
      },
      {
        id: generateId(),
        userId: currentUser.id,
        name: "Greek Yogurt",
        quantity: 2,
        unit: "containers",
        category: "dairy",
        location: "refrigerator",
        expiryDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        createdAt: getTimestamp(),
        updatedAt: getTimestamp(),
      },
      {
        id: generateId(),
        userId: currentUser.id,
        name: "Bananas",
        quantity: 6,
        unit: "pieces",
        category: "fruits",
        location: "counter",
        expiryDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days
        createdAt: getTimestamp(),
        updatedAt: getTimestamp(),
      },
      {
        id: generateId(),
        userId: currentUser.id,
        name: "Chicken Breast",
        quantity: 1.5,
        unit: "lb",
        category: "meat",
        location: "freezer",
        expiryDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days
        createdAt: getTimestamp(),
        updatedAt: getTimestamp(),
      },
      {
        id: generateId(),
        userId: currentUser.id,
        name: "Milk",
        quantity: 1,
        unit: "gallon",
        category: "dairy",
        location: "refrigerator",
        expiryDate: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days
        createdAt: getTimestamp(),
        updatedAt: getTimestamp(),
      },
    ];
    items = demoItems;
  }

  // Apply filters
  if (filter) {
    if (filter.category) {
      items = items.filter((item) => item.category === filter.category);
    }
    if (filter.location) {
      items = items.filter((item) => item.location === filter.location);
    }
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      items = items.filter((item) => item.name.toLowerCase().includes(searchLower));
    }
    if (filter.expiringSoon !== undefined) {
      items = items.filter((item) => {
        if (!item.expiryDate) return false;
        return filter.expiringSoon ? isExpiringSoon(item.expiryDate) : !isExpiringSoon(item.expiryDate);
      });
    }
    if (filter.expired !== undefined) {
      items = items.filter((item) => {
        if (!item.expiryDate) return false;
        return filter.expired ? isExpired(item.expiryDate) : !isExpired(item.expiryDate);
      });
    }
  }

  // Enrich with expiry status and food item data
  const enrichedItems = await Promise.all(
    items.map(async (item) => {
      const response: InventoryItemResponse = { ...item };
      
      if (item.foodItemId) {
        const foodItem = await db.foodItems.get(item.foodItemId);
        if (foodItem) {
          response.typicalExpiryDays = foodItem.typicalExpiryDays;
        }
      }

      if (item.expiryDate) {
        response.isExpiringSoon = isExpiringSoon(item.expiryDate);
        response.isExpired = isExpired(item.expiryDate);
      }

      return response;
    })
  );

  return enrichedItems;
}

/**
 * Get a single inventory item by ID
 */
export async function getInventoryItem(
  token: string,
  id: string
): Promise<InventoryItemResponse | null> {
  await delay(50);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const item = await db.inventory.get(id);
  if (!item || item.userId !== currentUser.id) {
    return null;
  }

  const response: InventoryItemResponse = { ...item };

  if (item.foodItemId) {
    const foodItem = await db.foodItems.get(item.foodItemId);
    if (foodItem) {
      response.typicalExpiryDays = foodItem.typicalExpiryDays;
    }
  }

  if (item.expiryDate) {
    response.isExpiringSoon = isExpiringSoon(item.expiryDate);
    response.isExpired = isExpired(item.expiryDate);
  }

  return response;
}

/**
 * Update an inventory item
 */
export async function updateInventoryItem(
  token: string,
  id: string,
  input: UpdateInventoryItemInput
): Promise<InventoryItemResponse> {
  await delay(50);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const item = await db.inventory.get(id);
  if (!item || item.userId !== currentUser.id) {
    throw new Error("Inventory item not found");
  }

  const updates: Partial<InventoryItem> = {
    ...input,
    updatedAt: getTimestamp(),
  };

  await db.inventory.update(id, updates);

  const updatedItem = await db.inventory.get(id);
  if (!updatedItem) {
    throw new Error("Inventory item not found");
  }

  const response: InventoryItemResponse = { ...updatedItem };

  if (updatedItem.foodItemId) {
    const foodItem = await db.foodItems.get(updatedItem.foodItemId);
    if (foodItem) {
      response.typicalExpiryDays = foodItem.typicalExpiryDays;
    }
  }

  if (updatedItem.expiryDate) {
    response.isExpiringSoon = isExpiringSoon(updatedItem.expiryDate);
    response.isExpired = isExpired(updatedItem.expiryDate);
  }

  return response;
}

/**
 * Delete an inventory item
 */
export async function deleteInventoryItem(token: string, id: string): Promise<void> {
  await delay(50);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const item = await db.inventory.get(id);
  if (!item || item.userId !== currentUser.id) {
    throw new Error("Inventory item not found");
  }

  await db.inventory.delete(id);
}

/**
 * Get food items (for autocomplete/selection)
 */
export async function getFoodItems(category?: string): Promise<FoodItem[]> {
  await delay(50);

  if (category) {
    return db.foodItems.where("category").equals(category).toArray();
  }
  return db.foodItems.toArray();
}

/**
 * Search food items by name
 */
export async function searchFoodItems(query: string): Promise<FoodItem[]> {
  await delay(50);

  const allItems = await db.foodItems.toArray();
  const queryLower = query.toLowerCase();
  return allItems.filter((item) => item.name.toLowerCase().includes(queryLower));
}

/**
 * Get expiring soon items
 */
export async function getExpiringSoon(
  token: string,
  days = 3
): Promise<InventoryItemResponse[]> {
  await delay(50);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  let items = await db.inventory
    .where("userId")
    .equals(currentUser.id)
    .toArray();

  // If no items exist, return demo expiring items
  if (items.length === 0) {
    const now = new Date();
    items = [
      {
        id: generateId(),
        userId: currentUser.id,
        name: "Organic Tomatoes",
        quantity: 2,
        unit: "lb",
        category: "vegetables",
        location: "refrigerator",
        expiryDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: getTimestamp(),
        updatedAt: getTimestamp(),
      },
      {
        id: generateId(),
        userId: currentUser.id,
        name: "Fresh Spinach",
        quantity: 1,
        unit: "bunch",
        category: "vegetables",
        location: "refrigerator",
        expiryDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: getTimestamp(),
        updatedAt: getTimestamp(),
      },
      {
        id: generateId(),
        userId: currentUser.id,
        name: "Whole Wheat Bread",
        quantity: 1,
        unit: "loaf",
        category: "bakery",
        location: "pantry",
        expiryDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: getTimestamp(),
        updatedAt: getTimestamp(),
      },
    ];
  }

  const now = new Date();
  const threshold = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  const expiringItems = items.filter((item) => {
    if (!item.expiryDate) return false;
    const expiryDate = new Date(item.expiryDate);
    return expiryDate <= threshold && expiryDate >= now;
  });

  const enrichedItems = await Promise.all(
    expiringItems.map(async (item) => {
      const response: InventoryItemResponse = { ...item, isExpiringSoon: true };
      
      if (item.foodItemId) {
        const foodItem = await db.foodItems.get(item.foodItemId);
        if (foodItem) {
          response.typicalExpiryDays = foodItem.typicalExpiryDays;
        }
      }

      if (item.expiryDate) {
        response.isExpired = isExpired(item.expiryDate);
      }

      return response;
    })
  );

  return enrichedItems.sort((a, b) => {
    if (!a.expiryDate || !b.expiryDate) return 0;
    return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
  });
}

