import { db, ShoppingListItem, InventoryItem, PriceComparison } from "./db";
import { generateId, getTimestamp, delay } from "./helpers";
import { getCurrentUser } from "./auth.server";

export interface CreateShoppingItemInput {
  name: string;
  quantity: number;
  unit?: string;
  category?: string;
  priority?: "low" | "medium" | "high";
  estimatedPrice?: number;
}

export interface UpdateShoppingItemInput {
  name?: string;
  quantity?: number;
  unit?: string;
  category?: string;
  priority?: "low" | "medium" | "high";
  purchased?: boolean;
  estimatedPrice?: number;
}

/**
 * Get shopping list for a user
 */
export async function getShoppingList(
  token: string,
  includePurchased = false
): Promise<ShoppingListItem[]> {
  await delay(50);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  let query = db.shoppingList.where("userId").equals(currentUser.id);

  if (!includePurchased) {
    query = query.filter((item) => !item.purchased);
  }

  let items = await query.toArray();

  // If no items exist, return demo data
  if (items.length === 0 && !includePurchased) {
    const now = getTimestamp();
    items = [
      {
        id: generateId(),
        userId: currentUser.id,
        householdId: currentUser.householdId,
        name: "Organic Carrots",
        quantity: 2,
        unit: "lb",
        category: "vegetables",
        priority: "high",
        purchased: false,
        estimatedPrice: 3.99,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        userId: currentUser.id,
        householdId: currentUser.householdId,
        name: "Fresh Salmon",
        quantity: 1,
        unit: "lb",
        category: "seafood",
        priority: "medium",
        purchased: false,
        estimatedPrice: 12.99,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        userId: currentUser.id,
        householdId: currentUser.householdId,
        name: "Olive Oil",
        quantity: 1,
        unit: "bottle",
        category: "condiments",
        priority: "low",
        purchased: false,
        estimatedPrice: 8.99,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        userId: currentUser.id,
        householdId: currentUser.householdId,
        name: "Quinoa",
        quantity: 1,
        unit: "bag",
        category: "grains",
        priority: "medium",
        purchased: false,
        estimatedPrice: 4.99,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        userId: currentUser.id,
        householdId: currentUser.householdId,
        name: "Avocados",
        quantity: 4,
        unit: "pieces",
        category: "fruits",
        priority: "high",
        purchased: false,
        estimatedPrice: 5.99,
        createdAt: now,
        updatedAt: now,
      },
    ];
  }

  return items;
}

/**
 * Compute missing items from inventory
 */
export async function computeMissingItems(
  token: string
): Promise<ShoppingListItem[]> {
  await delay(50);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const inventory = await db.inventory
    .where("userId")
    .equals(currentUser.id)
    .toArray();

  const lowStockItems: InventoryItem[] = inventory.filter((item) => {
    const quantity = item.quantity || 0;
    return quantity < 1;
  });

  const existingShoppingList = await db.shoppingList
    .where("userId")
    .equals(currentUser.id)
    .filter((item) => !item.purchased)
    .toArray();

  const existingNames = new Set(
    existingShoppingList.map((item) => item.name.toLowerCase())
  );

  const missingItems: ShoppingListItem[] = [];
  const now = getTimestamp();

  for (const item of lowStockItems) {
    if (!existingNames.has(item.name.toLowerCase())) {
      missingItems.push({
        id: generateId(),
        userId: currentUser.id,
        householdId: currentUser.householdId,
        name: item.name,
        quantity: 1,
        unit: item.unit,
        category: item.category,
        priority: "medium",
        purchased: false,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  if (missingItems.length > 0) {
    await db.shoppingList.bulkAdd(missingItems);
  }

  return [...existingShoppingList, ...missingItems];
}

/**
 * Add item to shopping list
 */
export async function addShoppingItem(
  token: string,
  input: CreateShoppingItemInput
): Promise<ShoppingListItem> {
  await delay(50);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const now = getTimestamp();
  const newItem: ShoppingListItem = {
    id: generateId(),
    userId: currentUser.id,
    householdId: currentUser.householdId,
    name: input.name,
    quantity: input.quantity,
    unit: input.unit,
    category: input.category,
    priority: input.priority || "medium",
    purchased: false,
    estimatedPrice: input.estimatedPrice,
    createdAt: now,
    updatedAt: now,
  };

  await db.shoppingList.add(newItem);
  return newItem;
}

/**
 * Update shopping list item
 */
export async function updateShoppingItem(
  token: string,
  itemId: string,
  input: UpdateShoppingItemInput
): Promise<ShoppingListItem> {
  await delay(50);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const item = await db.shoppingList.get(itemId);
  if (!item || item.userId !== currentUser.id) {
    throw new Error("Item not found");
  }

  const updated: ShoppingListItem = {
    ...item,
    ...input,
    updatedAt: getTimestamp(),
    purchasedAt: input.purchased ? getTimestamp() : item.purchasedAt,
  };

  await db.shoppingList.update(itemId, updated);
  return updated;
}

/**
 * Delete shopping list item
 */
export async function deleteShoppingItem(
  token: string,
  itemId: string
): Promise<void> {
  await delay(50);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const item = await db.shoppingList.get(itemId);
  if (!item || item.userId !== currentUser.id) {
    throw new Error("Item not found");
  }

  await db.shoppingList.delete(itemId);
}

/**
 * Get price comparisons for an item - generates dynamic data directly
 */
export async function getPriceComparisons(
  token: string,
  itemName: string
): Promise<PriceComparison | null> {
  await delay(50);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  // Always generate fresh price comparison data dynamically
  // Base prices vary by item category and item name
  const categoryPrices: Record<string, number> = {
    fruits: 3.99,
    vegetables: 2.99,
    dairy: 4.99,
    meat: 8.99,
    seafood: 12.99,
    grains: 2.49,
    bakery: 3.49,
    condiments: 5.99,
  };

  // Item-specific price adjustments
  const itemPriceMap: Record<string, number> = {
    "bananas": 2.50,
    "onions": 1.50,
    "ground beef": 8.99,
    "garlic": 0.75,
    "broccoli": 3.50,
    "salmon": 12.99,
    "butter": 4.50,
    "pasta": 2.99,
    "olive oil": 8.99,
    "milk": 3.99,
    "eggs": 4.99,
    "tomatoes": 3.99,
    "spinach": 2.99,
    "chicken": 7.99,
    "bread": 3.49,
    "apples": 4.99,
    "yogurt": 3.99,
  };

  // Get item category from shopping list or inventory
  const shoppingItem = await db.shoppingList
    .where("userId")
    .equals(currentUser.id)
    .filter((item) => item.name.toLowerCase() === itemName.toLowerCase())
    .first();
  
  const inventoryItem = await db.inventory
    .where("userId")
    .equals(currentUser.id)
    .filter((item) => item.name.toLowerCase() === itemName.toLowerCase())
    .first();

  const category = shoppingItem?.category || inventoryItem?.category || "general";
  const itemNameLower = itemName.toLowerCase();
  const basePrice = itemPriceMap[itemNameLower] || categoryPrices[category] || 4.99;

  // Generate dynamic prices for 3 stores
  const stores = [
    { name: "FreshMart", multiplier: 1.0 },
    { name: "SuperSave", multiplier: 0.88 },
    { name: "Local Market", multiplier: 0.95 },
  ];

  const storePrices = stores.map((store, index) => {
    // Add some variation to make it realistic
    const variation = 0.85 + (Math.random() * 0.3); // 15% variation
    const price = basePrice * store.multiplier * variation;
    return {
      storeName: store.name,
      price: Number(price.toFixed(2)),
      unit: shoppingItem?.unit || inventoryItem?.unit || "unit",
      available: Math.random() > 0.15, // 85% availability
    };
  });

  // Find best available price
  const availableStores = storePrices.filter((s) => s.available);
  const bestPrice = availableStores.length > 0
    ? availableStores.sort((a, b) => a.price - b.price)[0]
    : storePrices[0];

  // Generate fresh comparison (don't save to DB, generate on-the-fly)
  const comparison: PriceComparison = {
    id: generateId(),
    itemName,
    category,
    stores: storePrices,
    bestPrice: {
      storeName: bestPrice.storeName,
      price: bestPrice.price,
    },
    updatedAt: getTimestamp(),
  };

  return comparison;
}

