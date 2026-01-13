import {
  db,
  FoodItem,
  Resource,
  InventoryItem,
  ConsumptionLog,
  MealPlan,
  ShoppingListItem,
  UserXP,
  Badge,
  FamilyPreferences,
  PriceComparison,
  NutritionData,
  CommunityLeaderboard,
  RestaurantInventoryItem,
  RestaurantMenuItem,
  RestaurantSurplusItem,
  RestaurantDonationLog,
  RestaurantImpactMetrics,
  StaffTask,
  ShiftScheduleEntry,
  RestaurantPreferences,
} from "./db";
import { generateId, getTimestamp, calculateExpiryDate, hashPassword } from "./helpers";

const SEED_MARKER_KEY = "foodflow_seeded";
const DEFAULT_DEMO_USER = {
  name: "Demo Family",
  email: "demo@foodflow.app",
  password: "password123",
};

/**
 * Check if database has been seeded
 */
export function isSeeded(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SEED_MARKER_KEY) === "true";
}

/**
 * Mark database as seeded
 */
function markAsSeeded(): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(SEED_MARKER_KEY, "true");
  }
}

/**
 * Seed food items
 */
async function seedFoodItems(): Promise<void> {
  const foodItems: Omit<FoodItem, "id" | "createdAt" | "updatedAt">[] = [
    { name: "Milk", category: "dairy", typicalExpiryDays: 7, storageTips: "Keep refrigerated at 4°C" },
    { name: "Eggs", category: "dairy", typicalExpiryDays: 30, storageTips: "Store in refrigerator, keep in original carton" },
    { name: "Cheese", category: "dairy", typicalExpiryDays: 14, storageTips: "Wrap tightly, store in refrigerator" },
    { name: "Yogurt", category: "dairy", typicalExpiryDays: 10, storageTips: "Keep refrigerated, consume within 7 days of opening" },
    { name: "Butter", category: "dairy", typicalExpiryDays: 90, storageTips: "Store in refrigerator, can be frozen" },
    { name: "Tomatoes", category: "vegetables", typicalExpiryDays: 7, storageTips: "Store at room temperature, avoid direct sunlight" },
    { name: "Lettuce", category: "vegetables", typicalExpiryDays: 5, storageTips: "Keep in refrigerator, wrap in paper towel" },
    { name: "Carrots", category: "vegetables", typicalExpiryDays: 21, storageTips: "Store in refrigerator, remove greens" },
    { name: "Broccoli", category: "vegetables", typicalExpiryDays: 7, storageTips: "Keep in refrigerator, store in perforated bag" },
    { name: "Spinach", category: "vegetables", typicalExpiryDays: 5, storageTips: "Keep in refrigerator, wash before storing" },
    { name: "Chicken Breast", category: "meat", typicalExpiryDays: 2, storageTips: "Keep refrigerated, cook within 1-2 days" },
    { name: "Ground Beef", category: "meat", typicalExpiryDays: 2, storageTips: "Keep refrigerated, cook or freeze within 1-2 days" },
    { name: "Salmon", category: "seafood", typicalExpiryDays: 2, storageTips: "Keep refrigerated, cook within 1-2 days" },
    { name: "Bread", category: "bakery", typicalExpiryDays: 5, storageTips: "Store at room temperature, can be frozen" },
    { name: "Bananas", category: "fruits", typicalExpiryDays: 5, storageTips: "Store at room temperature, refrigerate when ripe" },
    { name: "Apples", category: "fruits", typicalExpiryDays: 30, storageTips: "Store in refrigerator, keep away from other fruits" },
    { name: "Oranges", category: "fruits", typicalExpiryDays: 14, storageTips: "Store at room temperature or refrigerate" },
    { name: "Rice", category: "grains", typicalExpiryDays: 365, storageTips: "Store in airtight container in cool, dry place" },
    { name: "Pasta", category: "grains", typicalExpiryDays: 730, storageTips: "Store in airtight container in cool, dry place" },
    { name: "Olive Oil", category: "condiments", typicalExpiryDays: 730, storageTips: "Store in cool, dark place, away from light" },
    { name: "Lentils", category: "grains", typicalExpiryDays: 365, storageTips: "Store in airtight container in cool, dry place" },
    { name: "Onions", category: "vegetables", typicalExpiryDays: 30, storageTips: "Store in cool, dry, well-ventilated area" },
    { name: "Garlic", category: "vegetables", typicalExpiryDays: 90, storageTips: "Store in cool, dry place with good air circulation" },
  ];

  const now = getTimestamp();
  const itemsToInsert = foodItems.map((item) => ({
    ...item,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  }));

  await db.foodItems.bulkAdd(itemsToInsert);
}

/**
 * Seed sustainability resources
 */
async function seedResources(): Promise<void> {
  const resources: Omit<Resource, "id" | "createdAt" | "updatedAt">[] = [
    {
      title: "Dairy Storage Best Practices",
      description: "Learn how to properly store dairy products to maximize freshness and reduce waste.",
      category: "dairy",
      tags: ["storage", "dairy", "preservation"],
      url: "https://example.com/dairy-storage",
    },
    {
      title: "Understanding Dairy Expiration Dates",
      description: "A comprehensive guide to understanding and managing dairy product expiration dates.",
      category: "dairy",
      tags: ["expiration", "dairy", "food-safety"],
    },
    {
      title: "Vegetable Storage Guide",
      description: "Essential tips for storing vegetables to maintain freshness and nutritional value.",
      category: "vegetables",
      tags: ["storage", "vegetables", "freshness"],
      url: "https://example.com/vegetable-storage",
    },
    {
      title: "Meal Planning for Fresh Vegetables",
      description: "Strategies for meal planning to use vegetables before they expire.",
      category: "vegetables",
      tags: ["meal-planning", "vegetables", "prevention"],
    },
    {
      title: "Preventing Vegetable Waste",
      description: "Practical tips to reduce vegetable waste in your household.",
      category: "vegetables",
      tags: ["waste-reduction", "vegetables", "sustainability"],
    },
    {
      title: "Meat Storage and Safety",
      description: "Proper storage techniques for meat products to ensure food safety.",
      category: "meat",
      tags: ["storage", "meat", "food-safety"],
    },
    {
      title: "Seafood Handling Guidelines",
      description: "Best practices for storing and handling seafood products.",
      category: "seafood",
      tags: ["storage", "seafood", "food-safety"],
    },
    {
      title: "Fruit Ripening and Storage",
      description: "How to properly store fruits to control ripening and extend shelf life.",
      category: "fruits",
      tags: ["storage", "fruits", "ripening"],
    },
    {
      title: "Grain Storage Solutions",
      description: "Long-term storage solutions for grains and dry goods.",
      category: "grains",
      tags: ["storage", "grains", "long-term"],
    },
    {
      title: "Food Waste Reduction Strategies",
      description: "Comprehensive strategies to reduce food waste in your home.",
      category: "general",
      tags: ["waste-reduction", "sustainability", "tips"],
    },
    {
      title: "Composting Basics",
      description: "Learn how to start composting food scraps and reduce landfill waste.",
      category: "general",
      tags: ["composting", "sustainability", "recycling"],
    },
    {
      title: "Understanding Food Labels",
      description: "A guide to understanding expiration dates, best-by dates, and use-by dates.",
      category: "general",
      tags: ["labels", "expiration", "education"],
    },
    {
      title: "Meal Prep for Waste Reduction",
      description: "How meal preparation can help reduce food waste and save money.",
      category: "general",
      tags: ["meal-prep", "waste-reduction", "planning"],
    },
    {
      title: "Freezing Food Safely",
      description: "Best practices for freezing food to preserve quality and safety.",
      category: "general",
      tags: ["freezing", "preservation", "storage"],
    },
    {
      title: "Leftover Recipe Ideas",
      description: "Creative recipes to transform leftovers into delicious meals.",
      category: "general",
      tags: ["recipes", "leftovers", "cooking"],
    },
    {
      title: "Sustainable Shopping Habits",
      description: "How to shop more sustainably and reduce food waste from the start.",
      category: "general",
      tags: ["shopping", "sustainability", "planning"],
    },
    {
      title: "Food Donation Programs",
      description: "Information about local food donation programs and how to participate.",
      category: "general",
      tags: ["donation", "community", "charity"],
    },
    {
      title: "Smart Kitchen Organization",
      description: "Organize your kitchen to reduce food waste and improve efficiency.",
      category: "general",
      tags: ["organization", "kitchen", "tips"],
    },
    {
      title: "Seasonal Eating Guide",
      description: "Benefits of eating seasonally and how it reduces waste.",
      category: "general",
      tags: ["seasonal", "sustainability", "nutrition"],
    },
    {
      title: "Food Safety Temperature Guide",
      description: "Critical temperatures for food safety and storage.",
      category: "general",
      tags: ["food-safety", "temperature", "storage"],
    },
  ];

  const now = getTimestamp();
  const resourcesToInsert = resources.map((resource) => ({
    ...resource,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  }));

  await db.resources.bulkAdd(resourcesToInsert);
}

/**
 * Seed family inventory items with dynamic dates
 */
async function seedFamilyInventory(userId: string): Promise<void> {
  const foodItems = await db.foodItems.toArray();
  const now = getTimestamp();
  const today = new Date();
  
  // Create comprehensive inventory with varied expiry dates: some expiring soon, some fresh, some long-term
  const inventoryItems: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">[] = [
    // Expiring soon (1-3 days) - Urgent items
    { userId, name: "Milk", quantity: 0.5, unit: "liter", category: "dairy", expiryDate: calculateExpiryDate(1), location: "fridge" },
    { userId, name: "Spinach", quantity: 150, unit: "g", category: "vegetables", expiryDate: calculateExpiryDate(2), location: "fridge" },
    { userId, name: "Chicken Breast", quantity: 400, unit: "g", category: "meat", expiryDate: calculateExpiryDate(1), location: "fridge" },
    { userId, name: "Bread", quantity: 0.5, unit: "loaf", category: "bakery", expiryDate: calculateExpiryDate(2), location: "counter" },
    { userId, name: "Lettuce", quantity: 200, unit: "g", category: "vegetables", expiryDate: calculateExpiryDate(1), location: "fridge" },
    { userId, name: "Ground Beef", quantity: 300, unit: "g", category: "meat", expiryDate: calculateExpiryDate(1), location: "fridge" },
    
    // Expiring in 3-7 days - Need attention soon
    { userId, name: "Tomatoes", quantity: 800, unit: "g", category: "vegetables", expiryDate: calculateExpiryDate(4), location: "counter" },
    { userId, name: "Yogurt", quantity: 4, unit: "cups", category: "dairy", expiryDate: calculateExpiryDate(5), location: "fridge" },
    { userId, name: "Bananas", quantity: 4, unit: "pieces", category: "fruits", expiryDate: calculateExpiryDate(4), location: "counter" },
    { userId, name: "Broccoli", quantity: 300, unit: "g", category: "vegetables", expiryDate: calculateExpiryDate(5), location: "fridge" },
    { userId, name: "Salmon", quantity: 350, unit: "g", category: "seafood", expiryDate: calculateExpiryDate(2), location: "fridge" },
    
    // Fresh items (7-30 days) - Good for now
    { userId, name: "Eggs", quantity: 12, unit: "pieces", category: "dairy", expiryDate: calculateExpiryDate(25), location: "fridge" },
    { userId, name: "Apples", quantity: 8, unit: "pieces", category: "fruits", expiryDate: calculateExpiryDate(20), location: "fridge" },
    { userId, name: "Carrots", quantity: 500, unit: "g", category: "vegetables", expiryDate: calculateExpiryDate(15), location: "fridge" },
    { userId, name: "Cheese", quantity: 200, unit: "g", category: "dairy", expiryDate: calculateExpiryDate(10), location: "fridge" },
    { userId, name: "Oranges", quantity: 6, unit: "pieces", category: "fruits", expiryDate: calculateExpiryDate(12), location: "counter" },
    { userId, name: "Butter", quantity: 250, unit: "g", category: "dairy", expiryDate: calculateExpiryDate(85), location: "fridge" },
    { userId, name: "Onions", quantity: 3, unit: "pieces", category: "vegetables", expiryDate: calculateExpiryDate(25), location: "pantry" },
    { userId, name: "Garlic", quantity: 1, unit: "bulb", category: "vegetables", expiryDate: calculateExpiryDate(80), location: "pantry" },
    
    // Long-term items - Pantry staples
    { userId, name: "Rice", quantity: 2, unit: "kg", category: "grains", expiryDate: calculateExpiryDate(300), location: "pantry" },
    { userId, name: "Pasta", quantity: 500, unit: "g", category: "grains", expiryDate: calculateExpiryDate(600), location: "pantry" },
    { userId, name: "Olive Oil", quantity: 1, unit: "bottle", category: "condiments", expiryDate: calculateExpiryDate(500), location: "pantry" },
    { userId, name: "Lentils", quantity: 500, unit: "g", category: "grains", expiryDate: calculateExpiryDate(350), location: "pantry" },
  ];

  const itemsToInsert = inventoryItems.map((item) => {
    const foodItem = foodItems.find(f => f.name.toLowerCase() === item.name.toLowerCase());
    return {
      ...item,
      id: generateId(),
      foodItemId: foodItem?.id,
      createdAt: now,
      updatedAt: now,
    };
  });

  await db.inventory.bulkAdd(itemsToInsert);
}

/**
 * Seed consumption logs with dynamic dates and realistic data
 */
async function seedFamilyLogs(userId: string): Promise<void> {
  const now = getTimestamp();
  const today = new Date();
  
  // Generate comprehensive logs for the past 30 days with realistic patterns
  const logs: Omit<ConsumptionLog, "id" | "createdAt" | "updatedAt">[] = [];
  
  // Recent logs (last 7 days) - More detailed
  logs.push(
    { userId, foodName: "Fried Rice", quantity: 300, unit: "g", category: "grains", consumedAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), wasWasted: false, notes: "Leftover fried rice from yesterday - delicious!" },
    { userId, foodName: "Bread", quantity: 200, unit: "g", category: "bakery", consumedAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), wasWasted: false, notes: "Extra bread shared with neighbors" },
    { userId, foodName: "Apple", quantity: 150, unit: "g", category: "fruits", consumedAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), wasWasted: false },
    { userId, foodName: "Chicken Salad", quantity: 350, unit: "g", category: "meat", consumedAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), wasWasted: false, notes: "Used leftover chicken" },
    { userId, foodName: "Tomato Soup", quantity: 400, unit: "ml", category: "vegetables", consumedAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), wasWasted: false },
    { userId, foodName: "Spinach", quantity: 100, unit: "g", category: "vegetables", consumedAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), wasWasted: true, notes: "Spoiled spinach thrown - expired" },
    { userId, foodName: "Yogurt", quantity: 150, unit: "g", category: "dairy", consumedAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), wasWasted: false },
    { userId, foodName: "Pasta", quantity: 250, unit: "g", category: "grains", consumedAt: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(), wasWasted: false, notes: "Homemade pasta with vegetables" },
    { userId, foodName: "Milk", quantity: 200, unit: "ml", category: "dairy", consumedAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), wasWasted: false },
    { userId, foodName: "Lettuce", quantity: 80, unit: "g", category: "vegetables", consumedAt: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(), wasWasted: false, notes: "Fresh salad" },
    { userId, foodName: "Eggs", quantity: 4, unit: "pieces", category: "dairy", consumedAt: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(), wasWasted: false, notes: "Scrambled eggs for breakfast" },
    { userId, foodName: "Salmon", quantity: 300, unit: "g", category: "seafood", consumedAt: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), wasWasted: false, notes: "Baked salmon with vegetables" },
  );
  
  // Older logs (8-30 days ago) - More comprehensive variety
  const foodVariety = [
    { name: "Rice", quantity: 200, unit: "g", category: "grains", wasted: false, notes: "Leftover rice used in stir fry" },
    { name: "Chicken", quantity: 300, unit: "g", category: "meat", wasted: false, notes: "Grilled chicken breast" },
    { name: "Carrots", quantity: 150, unit: "g", category: "vegetables", wasted: false, notes: "Roasted carrots" },
    { name: "Bananas", quantity: 2, unit: "pieces", category: "fruits", wasted: false, notes: "Fresh bananas" },
    { name: "Cheese", quantity: 100, unit: "g", category: "dairy", wasted: false, notes: "Cheese on pasta" },
    { name: "Oranges", quantity: 2, unit: "pieces", category: "fruits", wasted: false, notes: "Fresh orange snack" },
    { name: "Broccoli", quantity: 200, unit: "g", category: "vegetables", wasted: false, notes: "Steamed broccoli" },
    { name: "Tomatoes", quantity: 300, unit: "g", category: "vegetables", wasted: false, notes: "Fresh tomatoes in salad" },
    { name: "Bread", quantity: 150, unit: "g", category: "bakery", wasted: false, notes: "Toast for breakfast" },
    { name: "Eggs", quantity: 3, unit: "pieces", category: "dairy", wasted: false, notes: "Omelette" },
    { name: "Milk", quantity: 250, unit: "ml", category: "dairy", wasted: false, notes: "Milk with cereal" },
    { name: "Pasta", quantity: 200, unit: "g", category: "grains", wasted: false, notes: "Pasta dinner" },
    { name: "Lettuce", quantity: 100, unit: "g", category: "vegetables", wasted: false, notes: "Salad greens" },
    { name: "Yogurt", quantity: 200, unit: "g", category: "dairy", wasted: false, notes: "Greek yogurt snack" },
    { name: "Apples", quantity: 2, unit: "pieces", category: "fruits", wasted: false, notes: "Fresh apples" },
    { name: "Onions", quantity: 100, unit: "g", category: "vegetables", wasted: false, notes: "Cooked in meal" },
    { name: "Butter", quantity: 50, unit: "g", category: "dairy", wasted: false, notes: "Used in cooking" },
    { name: "Olive Oil", quantity: 30, unit: "ml", category: "condiments", wasted: false, notes: "Cooking oil" },
    // Some wasted items for realistic data
    { name: "Bananas", quantity: 2, unit: "pieces", category: "fruits", wasted: true, notes: "Overripe bananas thrown away" },
    { name: "Lettuce", quantity: 100, unit: "g", category: "vegetables", wasted: true, notes: "Wilted lettuce expired" },
    { name: "Milk", quantity: 200, unit: "ml", category: "dairy", wasted: true, notes: "Spoiled milk" },
    { name: "Bread", quantity: 100, unit: "g", category: "bakery", wasted: true, notes: "Moldy bread" },
    // Shared/donated items
    { name: "Bread", quantity: 300, unit: "g", category: "bakery", wasted: false, notes: "Extra bread shared with community" },
    { name: "Apples", quantity: 5, unit: "pieces", category: "fruits", wasted: false, notes: "Apples donated to food bank" },
    { name: "Rice", quantity: 500, unit: "g", category: "grains", wasted: false, notes: "Leftover rice shared with neighbors" },
    ];
    
  // Generate logs for each day in the past 30 days
  for (let i = 8; i <= 30; i++) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    // Add 1-3 items per day for variety
    const itemsPerDay = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < itemsPerDay; j++) {
      const item = foodVariety[(i * 3 + j) % foodVariety.length];
    logs.push({
      userId,
      foodName: item.name,
      quantity: item.quantity,
      unit: item.unit,
      category: item.category,
      consumedAt: date.toISOString(),
      wasWasted: item.wasted,
        notes: item.notes,
    });
    }
  }

  const logsToInsert = logs.map((log) => ({
    ...log,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  }));

  await db.logs.bulkAdd(logsToInsert);
}

/**
 * Seed meal plans with variety and realistic meals - 2 weeks of plans
 */
async function seedMealPlans(userId: string, householdId?: string): Promise<void> {
  const now = getTimestamp();
  const today = new Date();
  const meals: Omit<MealPlan, "id" | "createdAt" | "updatedAt">[] = [];

  const breakfastOptions = [
    { name: "Scrambled Eggs", description: "With toast and fresh fruit", servings: 4 },
    { name: "Oatmeal", description: "With bananas and honey", servings: 4 },
    { name: "Yogurt Parfait", description: "Greek yogurt with granola and berries", servings: 4 },
    { name: "Pancakes", description: "Whole wheat pancakes with maple syrup", servings: 4 },
    { name: "Avocado Toast", description: "Whole grain bread with avocado and eggs", servings: 4 },
    { name: "Smoothie Bowl", description: "Mixed fruits with yogurt and nuts", servings: 4 },
    { name: "Breakfast Burrito", description: "Eggs, cheese, and vegetables wrapped in tortilla", servings: 4 },
    { name: "French Toast", description: "Whole grain bread with berries", servings: 4 },
    { name: "Cereal", description: "Whole grain cereal with milk and fruit", servings: 4 },
    { name: "Bagel", description: "Whole grain bagel with cream cheese and vegetables", servings: 4 },
  ];

  const lunchOptions = [
    { name: "Chicken Salad", description: "Mixed greens with grilled chicken and vegetables", servings: 4 },
    { name: "Vegetable Soup", description: "Homemade soup with seasonal vegetables", servings: 4 },
    { name: "Rice Bowl", description: "Brown rice with vegetables and protein", servings: 4 },
    { name: "Sandwich", description: "Whole grain bread with fresh vegetables and protein", servings: 4 },
    { name: "Pasta Salad", description: "Cold pasta with vegetables and dressing", servings: 4 },
    { name: "Wrap", description: "Tortilla wrap with vegetables and hummus", servings: 4 },
    { name: "Quinoa Bowl", description: "Quinoa with roasted vegetables and tahini", servings: 4 },
    { name: "Caesar Salad", description: "Romaine lettuce with chicken and croutons", servings: 4 },
    { name: "Burrito Bowl", description: "Rice, beans, vegetables, and protein", servings: 4 },
    { name: "Soup and Salad", description: "Vegetable soup with side salad", servings: 4 },
  ];

  const dinnerOptions = [
    { name: "Pasta with Vegetables", description: "Whole wheat pasta with seasonal vegetables", servings: 4 },
    { name: "Grilled Chicken", description: "With roasted vegetables and rice", servings: 4 },
    { name: "Stir Fry", description: "Mixed vegetables with tofu and rice", servings: 4 },
    { name: "Salmon", description: "Baked salmon with steamed vegetables", servings: 4 },
    { name: "Vegetable Curry", description: "Curry with rice and naan", servings: 4 },
    { name: "Pizza", description: "Homemade pizza with fresh toppings", servings: 4 },
    { name: "Tacos", description: "Vegetable and bean tacos with salsa", servings: 4 },
    { name: "Roast Chicken", description: "Whole roasted chicken with potatoes and vegetables", servings: 4 },
    { name: "Lasagna", description: "Vegetable lasagna with side salad", servings: 4 },
    { name: "Burger", description: "Homemade burgers with sweet potato fries", servings: 4 },
  ];

  // Generate 2 weeks of meal plans (14 days)
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];

    meals.push(
      { userId, householdId, date: dateStr, mealType: "breakfast", ...breakfastOptions[i % breakfastOptions.length] },
      { userId, householdId, date: dateStr, mealType: "lunch", ...lunchOptions[i % lunchOptions.length] },
      { userId, householdId, date: dateStr, mealType: "dinner", ...dinnerOptions[i % dinnerOptions.length] }
    );
  }

  const mealsToInsert = meals.map((meal) => ({
    ...meal,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  }));

  await db.mealPlans.bulkAdd(mealsToInsert);
}

/**
 * Seed shopping list with items that complement inventory
 */
async function seedShoppingList(userId: string, householdId?: string): Promise<void> {
  const now = getTimestamp();
  const today = new Date();
  const foodItems = await db.foodItems.toArray();
  
  const items: Omit<ShoppingListItem, "id" | "createdAt" | "updatedAt">[] = [
    // High priority - needed soon
    { userId, householdId, name: "Bananas", quantity: 6, unit: "pieces", category: "fruits", priority: "high", purchased: false, estimatedPrice: 2.50 },
    { userId, householdId, name: "Onions", quantity: 3, unit: "pieces", category: "vegetables", priority: "high", purchased: false, estimatedPrice: 1.50 },
    { userId, householdId, name: "Ground Beef", quantity: 500, unit: "g", category: "meat", priority: "high", purchased: false, estimatedPrice: 8.99 },
    { userId, householdId, name: "Milk", quantity: 1, unit: "liter", category: "dairy", priority: "high", purchased: false, estimatedPrice: 3.99 },
    { userId, householdId, name: "Spinach", quantity: 200, unit: "g", category: "vegetables", priority: "high", purchased: false, estimatedPrice: 2.99 },
    
    // Medium priority
    { userId, householdId, name: "Garlic", quantity: 1, unit: "bulb", category: "vegetables", priority: "medium", purchased: false, estimatedPrice: 0.75 },
    { userId, householdId, name: "Broccoli", quantity: 500, unit: "g", category: "vegetables", priority: "medium", purchased: false, estimatedPrice: 3.50 },
    { userId, householdId, name: "Salmon", quantity: 400, unit: "g", category: "seafood", priority: "medium", purchased: false, estimatedPrice: 12.99 },
    { userId, householdId, name: "Butter", quantity: 250, unit: "g", category: "dairy", priority: "medium", purchased: false, estimatedPrice: 4.50 },
    { userId, householdId, name: "Yogurt", quantity: 4, unit: "cups", category: "dairy", priority: "medium", purchased: false, estimatedPrice: 4.99 },
    { userId, householdId, name: "Tomatoes", quantity: 500, unit: "g", category: "vegetables", priority: "medium", purchased: false, estimatedPrice: 3.99 },
    { userId, householdId, name: "Cheese", quantity: 250, unit: "g", category: "dairy", priority: "medium", purchased: false, estimatedPrice: 5.99 },
    
    // Low priority - nice to have
    { userId, householdId, name: "Pasta", quantity: 500, unit: "g", category: "grains", priority: "low", purchased: false, estimatedPrice: 2.99 },
    { userId, householdId, name: "Olive Oil", quantity: 1, unit: "bottle", category: "condiments", priority: "low", purchased: false, estimatedPrice: 8.99 },
    { userId, householdId, name: "Lentils", quantity: 500, unit: "g", category: "grains", priority: "low", purchased: false, estimatedPrice: 3.49 },
    { userId, householdId, name: "Apples", quantity: 6, unit: "pieces", category: "fruits", priority: "low", purchased: false, estimatedPrice: 4.99 },
    
    // Some purchased items for history
    { userId, householdId, name: "Bread", quantity: 1, unit: "loaf", category: "bakery", priority: "high", purchased: true, estimatedPrice: 3.49, purchasedAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { userId, householdId, name: "Eggs", quantity: 12, unit: "pieces", category: "dairy", priority: "high", purchased: true, estimatedPrice: 4.99, purchasedAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  ];

  const itemsToInsert = items.map((item) => ({
    ...item,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  }));

  await db.shoppingList.bulkAdd(itemsToInsert);
}

/**
 * Seed user XP with realistic progression - calculated from logs
 */
async function seedUserXP(userId: string): Promise<void> {
  // Calculate XP from logs to make it realistic
  const logs = await db.logs.where("userId").equals(userId).toArray();
  const baseXP = logs.length * 10; // 10 XP per log entry
  const wastePreventedXP = logs.filter(l => !l.wasWasted).length * 15; // 15 XP for preventing waste
  const sharedXP = logs.filter(l => 
    l.notes?.toLowerCase().includes("shared") || 
    l.notes?.toLowerCase().includes("donated")
  ).length * 20; // 20 XP for sharing
  
  const totalXP = baseXP + wastePreventedXP + sharedXP;
  const level = Math.floor(totalXP / 500) + 1;
  const currentLevelXP = totalXP % 500;
  const nextLevelXP = level * 500;
  
  const xpData: UserXP = {
    id: generateId(),
    userId,
    totalXP: totalXP || 1250, // Fallback to demo value if no logs yet
    level: level || 3,
    currentLevelXP: currentLevelXP || 250,
    nextLevelXP: nextLevelXP || 500,
    updatedAt: getTimestamp(),
  };

  await db.userXP.add(xpData);
}

/**
 * Seed badges - unlock some badges based on user activity
 */
async function seedBadges(userId: string): Promise<void> {
  const now = getTimestamp();
  const logs = await db.logs.where("userId").equals(userId).toArray();
  const mealPlans = await db.mealPlans.where("userId").equals(userId).toArray();
  
  // Calculate if badges should be unlocked
  const wastePrevented = logs
    .filter((log) => !log.wasWasted)
    .reduce((sum, log) => sum + (log.quantity || 0), 0) / 1000; // Convert to kg
  
  const sharedCount = logs.filter(
    (log) => log.notes?.toLowerCase().includes("shared") || 
             log.notes?.toLowerCase().includes("donated")
  ).length;
  
  const badges: Omit<Badge, "id" | "createdAt">[] = [];
  
  // Leftover Master - 10 leftover meals (waste prevented)
  if (wastePrevented >= 10) {
    badges.push({
      userId,
      badgeId: "leftover-master",
      name: "Leftover Master",
      description: "Eaten 10 leftover meals",
      icon: "🍽️",
      unlockedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      xpReward: 50,
    });
  }
  
  // Healthy Planner - 30 meals planned
  if (mealPlans.length >= 30) {
    badges.push({
      userId,
      badgeId: "healthy-planner",
      name: "Healthy Planner",
      description: "Planned 30 meals",
      icon: "📅",
      unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      xpReward: 75,
    });
  }
  
  // Community Helper - 20 items shared
  if (sharedCount >= 20) {
    badges.push({
      userId,
      badgeId: "community-helper",
      name: "Community Helper",
      description: "Shared 20 items with community",
      icon: "🤝",
      unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      xpReward: 80,
    });
  }
  
  // Always add at least 2 demo badges if none qualify
  if (badges.length === 0) {
    badges.push(
    {
      userId,
      badgeId: "leftover-master",
      name: "Leftover Master",
      description: "Eaten 10 leftover meals",
      icon: "🍽️",
      unlockedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      xpReward: 50,
    },
    {
      userId,
      badgeId: "healthy-planner",
      name: "Healthy Planner",
      description: "Planned 30 meals",
      icon: "📅",
      unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      xpReward: 75,
      }
    );
  }

  const badgesToInsert = badges.map((badge) => ({
    ...badge,
    id: generateId(),
    createdAt: now,
  }));

  await db.badges.bulkAdd(badgesToInsert);
}

/**
 * Seed family preferences with complete fields
 */
async function seedFamilyPreferences(userId: string, householdId?: string): Promise<void> {
  if (!householdId) return;
  
  const now = getTimestamp();
  const preferences: FamilyPreferences = {
    id: generateId(),
    householdId,
    // Household
    householdSize: 4,
    ageGroups: {
      child: 1,
      adult: 2,
      senior: 1,
    },
    cookingFrequency: "daily",
    eatingSchedule: {
      breakfast: "07:30",
      lunch: "13:00",
      dinner: "19:00",
    },
    // Diet & Restrictions
    dietaryType: "general",
    dietaryRestrictions: [],
    allergies: ["Peanuts"],
    healthConditions: [],
    // Budget & Shopping
    weeklyBudget: 150,
    budgetRange: {
      min: 100,
      max: 200,
    },
    preferredStores: ["FreshMart", "SuperSave", "Local Market", "Agora"],
    priceSensitivity: "medium",
    // Culinary
    preferredCuisines: ["asian", "indian", "western"],
    mealPrepPreference: "diverse",
    // Sustainability
    wasteSensitivityLevel: "medium",
    sustainabilityPreference: "moderate",
    leftoverComfortLevel: "high",
    // Nutrition Goals
    dailyCalories: 2000,
    macroGoal: {
      protein: 25,
      carbs: 45,
      fats: 30,
    },
    vitaminsFocus: ["iron", "vitaminD", "calcium"],
    avoidExcess: ["sugar", "sodium"],
    createdAt: now,
    updatedAt: now,
  };

  await db.familyPreferences.add(preferences);
}

/**
 * Seed nutrition data for the past 7 days
 */
async function seedNutritionData(userId: string): Promise<void> {
  try {
    // Check if nutrition data already exists for this user
    const existingCount = await db.nutritionData.where("userId").equals(userId).count();
    if (existingCount > 0) {
      console.log(`   ⚠️ Nutrition data already exists (${existingCount} days), skipping...`);
      return;
    }

    const now = getTimestamp();
    const today = new Date();
    const nutritionData: Omit<NutritionData, "id" | "createdAt" | "updatedAt">[] = [];

    // Generate 7 days of nutrition data with realistic variation
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      // Base values with some variation
      const baseCalories = 2000;
      const variation = 0.85 + Math.random() * 0.3; // 85-115% variation
      const calories = Math.round(baseCalories * variation);

      // Macros (percentages: 25% protein, 45% carbs, 30% fats)
      const protein = Math.round((calories * 0.25) / 4); // 4 cal/g
      const carbs = Math.round((calories * 0.45) / 4);
      const fats = Math.round((calories * 0.30) / 9); // 9 cal/g
      const fiber = Math.round(20 + Math.random() * 15); // 20-35g
      const sugar = Math.round(30 + Math.random() * 30); // 30-60g
      const sodium = Math.round(1800 + Math.random() * 800); // 1800-2600mg

      // Vitamins and minerals
      const vitaminA = Math.round(5000 + Math.random() * 3000); // 5000-8000 IU
      const vitaminB = Math.round(1.2 + Math.random() * 0.8); // 1.2-2.0 mg
      const vitaminC = Math.round(60 + Math.random() * 40); // 60-100 mg
      const vitaminD = Math.round(400 + Math.random() * 400); // 400-800 IU
      const iron = Math.round(12 + Math.random() * 8); // 12-20 mg
      const calcium = Math.round(800 + Math.random() * 400); // 800-1200 mg

      // Calculate nutrition score
      let score = 100;
      if (calories > 2400) score -= 10;
      if (calories < 1600) score -= 10;
      if (protein < 50) score -= 15;
      if (sugar > 50) score -= 10;
      if (sodium > 2300) score -= 15;
      if (fiber < 25) score -= 10;
      if (iron < 15) score -= 10;
      if (vitaminD < 400) score -= 5;
      score = Math.max(0, Math.min(100, score));

      nutritionData.push({
        userId,
        date: dateStr,
        calories,
        protein,
        carbs,
        fats,
        fiber,
        sugar,
        sodium,
        vitaminA,
        vitaminB,
        vitaminC,
        vitaminD,
        iron,
        calcium,
        nutritionScore: score,
      });
    }

    const dataToInsert = nutritionData.map((data) => ({
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }));

    console.log(`   📊 Inserting ${dataToInsert.length} days of nutrition data...`);
    await db.nutritionData.bulkAdd(dataToInsert);
    console.log(`   ✅ Successfully inserted ${dataToInsert.length} days of nutrition data`);
  } catch (error) {
    console.error("❌ Error seeding nutrition data:", error);
    throw error;
  }
}

/**
 * Seed price comparisons for shopping items
 */
async function seedPriceComparisons(userId: string): Promise<void> {
  const now = getTimestamp();
  const shoppingItems = await db.shoppingList.where("userId").equals(userId).toArray();
  
  const priceComparisons: Omit<PriceComparison, "id">[] = [];

  for (const item of shoppingItems) {
    const stores = [
      { storeName: "FreshMart", price: (item.estimatedPrice || 5) * 0.95, available: true },
      { storeName: "SuperSave", price: (item.estimatedPrice || 5) * 0.90, available: true },
      { storeName: "Local Market", price: (item.estimatedPrice || 5) * 1.05, available: true },
    ];

    const bestPrice = stores.reduce((min, store) => 
      store.price < min.price ? store : min
    );

    priceComparisons.push({
      itemName: item.name,
      category: item.category,
      stores,
      bestPrice: {
        storeName: bestPrice.storeName,
        price: bestPrice.price,
      },
      updatedAt: now,
    });
  }

  const comparisonsToInsert = priceComparisons.map((comp) => ({
    ...comp,
    id: generateId(),
  }));

  await db.priceComparisons.bulkAdd(comparisonsToInsert);
}

async function seedCommunityModule(): Promise<void> {
  const communitySeeded =
    (await db.communitySurplusPosts.count()) > 0 &&
    (await db.leftoverItems.count()) > 0 &&
    (await db.communityKitchenEvents.count()) > 0 &&
    (await db.communityLeaderboard.count()) > 0 &&
    (await db.communityImpact.count()) > 0 &&
    (await db.notifications.count()) > 0 &&
    (await db.communityProfiles.count()) > 0;

  if (communitySeeded) {
    return;
  }

  const now = getTimestamp();
  const users = await db.users.toArray();
  const primaryUser = users[0];

  const communityMembers = [
    {
      userId: primaryUser?.id ?? generateId(),
      username: primaryUser?.name ?? "Demo Family",
      avatarUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=FoodFlow",
      communityRole: "member" as const,
      preferredItems: ["vegetables", "dairy", "baked goods"],
      avoidItems: ["fried food"],
      dietaryRestrictions: ["halal"],
      allergens: ["peanuts"],
    },
    {
      userId: generateId(),
      username: "Green Guardian",
      avatarUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=Guardian",
      communityRole: "champion" as const,
      preferredItems: ["produce", "grains", "meal kits"],
      avoidItems: ["high sugar"],
      dietaryRestrictions: ["low-sodium"],
      allergens: [],
    },
    {
      userId: generateId(),
      username: "Chef Lila",
      avatarUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=ChefLila",
      communityRole: "organizer" as const,
      preferredItems: ["spices", "fresh herbs"],
      avoidItems: [],
      dietaryRestrictions: ["vegetarian"],
      allergens: ["sesame"],
    },
    {
      userId: generateId(),
      username: "Zero Waste Duo",
      avatarUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=ZeroWaste",
      communityRole: "champion" as const,
      preferredItems: ["leftovers", "meal preps"],
      avoidItems: ["seafood"],
      dietaryRestrictions: [],
      allergens: [],
    },
  ];

  await db.communityProfiles.bulkAdd(
    communityMembers.map((member) => ({
      id: generateId(),
      ...member,
      bio: "Active contributor to the FoodFlow community.",
      acceptsHotMeals: true,
      distancePreference: "3km",
      visibility: "community",
      notificationsEnabled: true,
      notifyOnClaim: true,
      notifyOnMessages: true,
      createdAt: now,
      updatedAt: now,
    }))
  );

  const surplusPosts = [
    {
      title: "Extra Garden Tomatoes",
      description: "Freshly picked cherry tomatoes from today's harvest. Perfect for salads or sauces.",
      category: "produce",
      quantity: 3,
      unit: "kg",
      pickupWindow: { start: "17:00", end: "20:00" },
      pickupLocation: "Building A Lobby",
      tags: ["organic", "fresh"],
      distanceKm: 0.2,
      status: "available" as const,
      expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      title: "Milk expiring today",
      description: "Two bottles of fresh milk expiring tonight. Still sealed and refrigerated.",
      category: "dairy",
      quantity: 2,
      unit: "bottles",
      pickupWindow: { start: "12:00", end: "18:00" },
      pickupLocation: "Building C - Community Fridge",
      tags: ["refrigerated"],
      distanceKm: 0.6,
      status: "available" as const,
      expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      title: "Fresh Baked Bread Loaf",
      description: "Homemade sourdough loaf from this morning. Best enjoyed today.",
      category: "bakery",
      quantity: 1,
      unit: "loaf",
      pickupWindow: { start: "09:00", end: "13:00" },
      pickupLocation: "Building B, Apt 804",
      tags: ["homemade", "warm"],
      distanceKm: 0.4,
      status: "claimed" as const,
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    },
    {
      title: "Rice Bowls Ready",
      description: "Individual rice bowls with vegetables. Prepared for tonight's event, 4 extra portions.",
      category: "meals",
      quantity: 4,
      unit: "bowls",
      pickupWindow: { start: "18:00", end: "21:00" },
      pickupLocation: "Community Kitchen",
      tags: ["vegetarian"],
      distanceKm: 0.1,
      status: "available" as const,
      expiresAt: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      title: "Cooked Chicken Biryani",
      description: "Leftover weekend biryani, still freshly packed. Medium spice level.",
      category: "meals",
      quantity: 3,
      unit: "boxes",
      pickupWindow: { start: "14:00", end: "19:00" },
      pickupLocation: "Building D rooftop lounge",
      tags: ["halal", "spicy"],
      distanceKm: 0.8,
      status: "available" as const,
      expiresAt: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(),
    },
    {
      title: "Vegetable Basket Share",
      description: "Basket with lettuce, cucumbers, and bell peppers from weekly CSA box.",
      category: "produce",
      quantity: 1,
      unit: "basket",
      pickupWindow: { start: "10:00", end: "18:00" },
      pickupLocation: "Building A garden",
      tags: ["organic", "CSA"],
      distanceKm: 0.2,
      status: "available" as const,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  await db.communitySurplusPosts.bulkAdd(
    surplusPosts.map((post, index) => {
      const member = communityMembers[index % communityMembers.length];
      return {
        id: generateId(),
        userId: member.userId,
        userName: member.username,
        avatarUrl: member.avatarUrl,
        image: undefined,
        requests: [],
        comments: [],
        createdAt: now,
        updatedAt: now,
        ...post,
      };
    })
  );

  const leftoverItems = [
    {
      dishName: "Creamy Veggie Pasta",
      description: "Dinner leftovers with mushrooms and spinach. Contains dairy.",
      portions: 2,
      dietaryTags: ["vegetarian"],
      allergens: ["dairy", "gluten"],
      pickupWindow: "Tonight 7-9 PM",
      distanceKm: 0.3,
    },
    {
      dishName: "Extra Coconut Curry",
      description: "Mild curry with chickpeas and veggies. Vegan friendly.",
      portions: 3,
      dietaryTags: ["vegan", "gluten-free"],
      allergens: [],
      pickupWindow: "Tomorrow 11 AM - 2 PM",
      distanceKm: 0.5,
    },
    {
      dishName: "Homestyle Dal Portions",
      description: "Two portions of hearty dal, ready to reheat.",
      portions: 2,
      dietaryTags: ["vegetarian"],
      allergens: [],
      pickupWindow: "Today 1-5 PM",
      distanceKm: 0.4,
    },
  ];

  await db.leftoverItems.bulkAdd(
    leftoverItems.map((item, index) => {
      const owner = communityMembers[(index + 1) % communityMembers.length];
      return {
        id: generateId(),
        userId: owner.userId,
        userName: owner.username,
        avatarUrl: owner.avatarUrl,
        status: "available" as const,
        claims: [],
        image: undefined,
        createdAt: now,
        updatedAt: now,
        ...item,
      };
    })
  );

  const kitchenEvents = [
    {
      title: "Friday Night Shared Cooking",
      description: "Collaborative cooking session using surplus veggies. Need prep volunteers.",
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      time: "18:30",
      location: "Community Kitchen",
      tags: ["cooking", "volunteer"],
      volunteersNeeded: 8,
      volunteers: communityMembers.slice(0, 3).map((member, idx) => ({
        id: generateId(),
        userId: member.userId,
        name: member.username,
        role: ["Lead Cook", "Prep", "Logistics"][idx] || "Volunteer",
        avatarUrl: member.avatarUrl,
      })),
      foodSavedKg: 18,
      status: "upcoming" as const,
    },
    {
      title: "Sunday Breakfast for Neighbors",
      description: "Morning breakfast service for tenants. Need servers and beverage leads.",
      date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      time: "09:00",
      location: "Atrium Hall",
      tags: ["service", "breakfast"],
      volunteersNeeded: 10,
      volunteers: communityMembers.slice(1, 4).map((member, idx) => ({
        id: generateId(),
        userId: member.userId,
        name: member.username,
        role: ["Beverages", "Seating", "Check-in"][idx] || "Volunteer",
        avatarUrl: member.avatarUrl,
      })),
      foodSavedKg: 24,
      status: "upcoming" as const,
    },
    {
      title: "Zero Waste Lunch Potluck",
      description: "Potluck to use leftovers before weekend. Bring a dish or help plate servings.",
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      time: "13:00",
      location: "Sky Lounge",
      tags: ["potluck", "zero-waste"],
      volunteersNeeded: 6,
      volunteers: communityMembers.slice(0, 2).map((member) => ({
        id: generateId(),
        userId: member.userId,
        name: member.username,
        role: "Coordinator",
        avatarUrl: member.avatarUrl,
      })),
      foodSavedKg: 32,
      status: "completed" as const,
    },
    {
      title: "Volunteer Day – Cutting & Prep Session",
      description: "Help cut and prep vegetables for this week's surplus redistribution.",
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      time: "16:00",
      location: "Community Kitchen Prep Zone",
      tags: ["volunteer", "prep"],
      volunteersNeeded: 12,
      volunteers: communityMembers.slice(0, 1).map((member) => ({
        id: generateId(),
        userId: member.userId,
        name: member.username,
        role: "Lead Volunteer",
        avatarUrl: member.avatarUrl,
      })),
      foodSavedKg: 12,
      status: "upcoming" as const,
    },
  ];

  await db.communityKitchenEvents.bulkAdd(
    kitchenEvents.map((event) => ({
      id: generateId(),
      createdAt: now,
      updatedAt: now,
      ...event,
    }))
  );

  const leaderboardTypes: CommunityLeaderboard["type"][] = [
    "top-sharers",
    "zero-waste",
    "volunteer-stars",
    "building-impact",
    "weekly-xp",
  ];

  await db.communityLeaderboard.bulkAdd(
    leaderboardTypes.map((type, idx) => ({
      id: generateId(),
      type,
      entries: communityMembers.map((member, position) => ({
        id: member.userId,
        name: member.username,
        household: `Tower ${String.fromCharCode(65 + position)}`,
        value: Math.round(50 - position * 8 + idx * 5),
        unit:
          type === "top-sharers"
            ? "kg shared"
            : type === "zero-waste"
              ? "% saved"
              : type === "volunteer-stars"
                ? "hrs"
                : type === "building-impact"
                  ? "pts"
                  : "XP",
        badge:
          position === 0 ? "🥇" : position === 1 ? "🥈" : position === 2 ? "🥉" : "🌱",
        trend: position === 0 ? "up" : position === 1 ? "steady" : "down",
      })),
      updatedAt: now,
    }))
  );

  await db.communityImpact.add({
    id: generateId(),
    totalSurplusKg: 328,
    donations: 142,
    co2PreventedKg: 912,
    waterSavedLiters: 5800,
    mealsProvided: 420,
    weeklyTrend: [
      { label: "Mon", value: 38 },
      { label: "Tue", value: 42 },
      { label: "Wed", value: 36 },
      { label: "Thu", value: 48 },
      { label: "Fri", value: 52 },
      { label: "Sat", value: 61 },
      { label: "Sun", value: 55 },
    ],
    personalContribution: [
      { label: "Surplus shared", value: 26, unit: "kg" },
      { label: "Volunteer hours", value: 8, unit: "hrs" },
      { label: "Claims fulfilled", value: 12, unit: "items" },
    ],
    updatedAt: now,
  });

  const notificationsSeed = [
    {
      title: "Your surplus tomatoes were claimed",
      message: "A neighbor confirmed pickup for your tomatoes this evening.",
      type: "claim" as const,
    },
    {
      title: "Volunteer reminder",
      message: "Kitchen prep session starts in 2 hours. Tap to confirm attendance.",
      type: "volunteer" as const,
    },
    {
      title: "Community announcement",
      message: "Shared pantry restocked with reusable containers.",
      type: "announcement" as const,
    },
    {
      title: "New leftover nearby",
      message: "Fresh pasta portions available 0.4 km away.",
      type: "surplus" as const,
    },
  ];

  await db.notifications.bulkAdd(
    notificationsSeed.map((notification, idx) => ({
      id: generateId(),
      userId: communityMembers[idx % communityMembers.length].userId,
      read: idx === 0,
      createdAt: new Date(Date.now() - idx * 60 * 60 * 1000).toISOString(),
      ...notification,
    }))
  );
}

export async function seedRestaurantModule(): Promise<void> {
  const now = getTimestamp();
  const hasInventory = (await db.restaurantInventory.count()) > 0;
  if (hasInventory) {
    return;
  }

  const restaurantInventory: RestaurantInventoryItem[] = [
    {
      id: generateId(),
      name: "Chicken Breast",
      quantity: 10,
      unit: "kg",
      category: "protein",
      expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      storageType: "chilled",
      batchCode: "CHK-204",
      alertTags: ["expiring", "high-risk"],
      status: "expiring",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: "Tomatoes",
      quantity: 5,
      unit: "kg",
      category: "produce",
      expiryDate: new Date(Date.now()).toISOString(),
      storageType: "fresh",
      batchCode: "VEG-102",
      alertTags: ["urgent"],
      status: "expiring",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: "Milk",
      quantity: 20,
      unit: "L",
      category: "dairy",
      expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      storageType: "chilled",
      batchCode: "DAIRY-778",
      alertTags: ["chilled"],
      status: "expiring",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: "Spinach Crates",
      quantity: 8,
      unit: "crates",
      category: "produce",
      expiryDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      storageType: "fresh",
      batchCode: "GREENS-55",
      alertTags: ["perishable"],
      status: "expiring",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: "Frozen Samosas",
      quantity: 120,
      unit: "pieces",
      category: "frozen",
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      storageType: "frozen",
      batchCode: "FRZ-990",
      alertTags: ["stable"],
      status: "normal",
      createdAt: now,
      updatedAt: now,
    },
  ];

  await db.restaurantInventory.bulkAdd(restaurantInventory);

  const menuItems: RestaurantMenuItem[] = [
    {
      id: generateId(),
      name: "Chicken Biryani",
      category: "main",
      ingredients: [
        { name: "Chicken Breast", quantity: "1.5kg" },
        { name: "Rice", quantity: "2kg" },
        { name: "Spices", quantity: "200g" },
      ],
      predictedWasteScore: "medium",
      price: 12,
      margin: 32,
      suggestions: ["Reduce rice batch size on weekdays", "Offer half portions late-night"],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: "Grilled Sandwich",
      category: "snack",
      ingredients: [
        { name: "Bread Loaf", quantity: "1 loaf" },
        { name: "Tomatoes", quantity: "0.5kg" },
        { name: "Cheese", quantity: "0.4kg" },
      ],
      predictedWasteScore: "low",
      price: 6,
      margin: 45,
      suggestions: ["Promote combo with soup to increase usage"],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: "Fried Rice",
      category: "main",
      ingredients: [
        { name: "Rice", quantity: "3kg" },
        { name: "Mixed Vegetables", quantity: "1kg" },
      ],
      predictedWasteScore: "high",
      price: 9,
      margin: 25,
      suggestions: ["Reduce rice prep by 15% mid-week", "Offer leftover rice as staff meal"],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: "Seasonal Vegetable Curry",
      category: "main",
      ingredients: [
        { name: "Spinach", quantity: "1kg" },
        { name: "Tomatoes", quantity: "0.5kg" },
        { name: "Seasonal Veg", quantity: "1kg" },
      ],
      predictedWasteScore: "medium",
      price: 11,
      margin: 30,
      suggestions: ["Highlight as chef's special to rotate stock"],
      createdAt: now,
      updatedAt: now,
    },
  ];

  await db.restaurantMenuItems.bulkAdd(menuItems);

  const surplusItems: RestaurantSurplusItem[] = [
    {
      id: generateId(),
      title: "Chicken Biryani Portions",
      description: "12 portions prepared for lunch service",
      quantity: 12,
      unit: "portions",
      category: "meal",
      storageType: "fresh",
      pickupWindow: { start: "18:00", end: "21:00" },
      tags: ["protein", "spiced"],
      assignedTo: "ngo",
      recipientName: "Hope Meals",
      status: "pending",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      title: "Vegetable Curry Bowls",
      description: "8 bowls from dinner prep",
      quantity: 8,
      unit: "bowls",
      category: "meal",
      storageType: "fresh",
      pickupWindow: { start: "15:00", end: "18:00" },
      tags: ["vegetarian"],
      assignedTo: "kitchen",
      recipientName: "Community Kitchen",
      status: "pending",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      title: "Sandwich Pack",
      description: "10 grilled sandwiches ready to donate",
      quantity: 10,
      unit: "pieces",
      category: "snack",
      storageType: "fresh",
      pickupWindow: { start: "11:00", end: "13:00" },
      tags: ["bread"],
      status: "picked-up",
      assignedTo: "ngo",
      recipientName: "Urban Outreach",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      title: "Tomato Crates",
      description: "3 crates nearing expiry",
      quantity: 3,
      unit: "crates",
      category: "produce",
      storageType: "fresh",
      pickupWindow: { start: "09:00", end: "12:00" },
      tags: ["urgent"],
      status: "pending",
      createdAt: now,
      updatedAt: now,
    },
  ];

  await db.restaurantSurplus.bulkAdd(surplusItems);

  const donationHistory: RestaurantDonationLog[] = [
    {
      id: generateId(),
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      recipientType: "ngo",
      recipientName: "Hope Meals",
      items: "Cooked Meals",
      quantity: 150,
      unit: "meals",
      mealsProvided: 150,
      co2SavedKg: 4.2,
      notes: "Weekly donation",
      createdAt: now,
    },
    {
      id: generateId(),
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      recipientType: "community-kitchen",
      recipientName: "Neighborhood Kitchen",
      items: "Vegetable Curry & Sandwiches",
      quantity: 80,
      unit: "meals",
      mealsProvided: 80,
      co2SavedKg: 2.6,
      notes: "Daily surplus",
      createdAt: now,
    },
  ];

  await db.restaurantDonations.bulkAdd(donationHistory);

  const impact: RestaurantImpactMetrics = {
    id: generateId(),
    wastePreventedKg: 12,
    surplusDonationRate: 68,
    waterSavedLiters: 850,
    co2PreventedKg: 6.5,
    sustainabilityScore: 82,
    weeklyTrend: [
      { label: "Mon", value: 10 },
      { label: "Tue", value: 12 },
      { label: "Wed", value: 8 },
      { label: "Thu", value: 14 },
      { label: "Fri", value: 16 },
      { label: "Sat", value: 11 },
      { label: "Sun", value: 9 },
    ],
    monthlyTrend: [
      { label: "Week 1", value: 45 },
      { label: "Week 2", value: 52 },
      { label: "Week 3", value: 48 },
      { label: "Week 4", value: 55 },
    ],
    categoryBreakdown: [
      { category: "Produce", wasteKg: 4.5 },
      { category: "Protein", wasteKg: 3.2 },
      { category: "Dairy", wasteKg: 2.1 },
      { category: "Prepared Meals", wasteKg: 2.2 },
    ],
    updatedAt: now,
  };

  await db.restaurantImpact.add(impact);

  const staffTasks: StaffTask[] = [
    {
      id: generateId(),
      title: "Prep donation crates",
      description: "Label and weigh crates for Hope Meals",
      assignee: "Rafiq",
      shift: "Morning",
      completed: false,
      priority: "high",
    },
    {
      id: generateId(),
      title: "Sort vegetables",
      description: "Move urgent produce to front racks",
      assignee: "Lina",
      shift: "Afternoon",
      completed: true,
      priority: "medium",
    },
    {
      id: generateId(),
      title: "Kitchen cleanup rotation",
      description: "Deep clean cold storage area",
      assignee: "Team B",
      shift: "Closing",
      completed: false,
      priority: "low",
    },
    {
      id: generateId(),
      title: "Pack surplus boxes",
      description: "Pack sandwiches for pickup",
      assignee: "Arun",
      shift: "Evening",
      completed: false,
      priority: "medium",
    },
  ];

  await db.restaurantStaffTasks.bulkAdd(staffTasks);

  const schedule: ShiftScheduleEntry[] = [
    { id: generateId(), role: "Chef Lead", staff: "Chef Lila", time: "09:00 - 17:00", notes: "Oversee prep" },
    { id: generateId(), role: "Inventory Manager", staff: "Marin", time: "08:00 - 16:00", notes: "Stock audits" },
    { id: generateId(), role: "Donation Coordinator", staff: "Rafiq", time: "12:00 - 20:00", notes: "Pickup liaison" },
  ];

  await db.restaurantShiftSchedule.bulkAdd(schedule);

  const preferences: RestaurantPreferences = {
    id: generateId(),
    cuisineType: "Asian Fusion",
    operatingHours: "09:00 AM - 11:00 PM",
    donationPreferences: ["Vegetarian OK", "High-quantity"],
    storageCapabilities: ["Fresh", "Chilled", "Frozen"],
    staffRoles: ["Chef Lead", "Inventory Manager", "Donation Coordinator"],
    notificationsEnabled: true,
    notifyOnPickup: true,
    notifyOnExpiry: true,
    createdAt: now,
    updatedAt: now,
  };

  await db.restaurantPreferences.add(preferences);
}

let restaurantSeedInProgress: Promise<void> | null = null;

export async function ensureRestaurantSeeded(): Promise<void> {
  if (typeof window === "undefined") return;
  const hasInventory = await db.restaurantInventory.count();
  if (hasInventory > 0) {
    return;
  }
  if (!restaurantSeedInProgress) {
    restaurantSeedInProgress = seedRestaurantModule().finally(() => {
      restaurantSeedInProgress = null;
    });
  }
  await restaurantSeedInProgress;
}

/**
 * Seed data for a specific user
 */
export async function seedUserData(userId: string, householdId?: string, force = false): Promise<void> {
  try {
    // Check if user already has data
    const hasInventory = await db.inventory.where("userId").equals(userId).count() > 0;
    const hasLogs = await db.logs.where("userId").equals(userId).count() > 0;
    const hasMealPlans = await db.mealPlans.where("userId").equals(userId).count() > 0;
    const hasShoppingList = await db.shoppingList.where("userId").equals(userId).count() > 0;
    const hasNutritionData = await db.nutritionData.where("userId").equals(userId).count() > 0;
    const hasPreferences = householdId ? await db.familyPreferences.where("householdId").equals(householdId).count() > 0 : false;
    
    // Only skip if user has ALL data types (unless forced)
    if (!force && hasInventory && hasLogs && hasMealPlans && hasShoppingList && hasNutritionData && hasPreferences) {
      console.log("✅ User already has complete data, skipping seed");
      return; // User already has data
    }
    
    // If some data exists but not all, log what's missing
    if (!force && (hasInventory || hasLogs || hasMealPlans || hasShoppingList || hasNutritionData || hasPreferences)) {
      console.log("⚠️ User has partial data. Seeding missing data...");
      console.log(`   Inventory: ${hasInventory ? "✓" : "✗"}`);
      console.log(`   Logs: ${hasLogs ? "✓" : "✗"}`);
      console.log(`   Meal Plans: ${hasMealPlans ? "✓" : "✗"}`);
      console.log(`   Shopping List: ${hasShoppingList ? "✓" : "✗"}`);
      console.log(`   Nutrition Data: ${hasNutritionData ? "✓" : "✗"}`);
      console.log(`   Preferences: ${hasPreferences ? "✓" : "✗"}`);
    }
    
    console.log(`🌱 Seeding comprehensive demo data for user ${userId}...`);
    console.log(`   Force mode: ${force ? "YES" : "NO"}`);
    
    // Seed in order to maintain data consistency
    // Note: XP and badges depend on logs, so order matters
    
    // 1. Inventory (24 items)
    if (force || !hasInventory) {
      await seedFamilyInventory(userId);
      const count = await db.inventory.where("userId").equals(userId).count();
      console.log(`   ✓ Inventory: ${count} items seeded`);
    }
    
    // 2. Consumption Logs (50+ logs)
    if (force || !hasLogs) {
      await seedFamilyLogs(userId);
      const count = await db.logs.where("userId").equals(userId).count();
      console.log(`   ✓ Consumption Logs: ${count} entries seeded`);
    }
    
    // 3. Meal Plans (14 days = 42 meals)
    if (force || !hasMealPlans) {
      await seedMealPlans(userId, householdId);
      const count = await db.mealPlans.where("userId").equals(userId).count();
      console.log(`   ✓ Meal Plans: ${count} meals seeded (14 days)`);
    }
    
    // 4. Shopping List (17 items)
    if (force || !hasShoppingList) {
      await seedShoppingList(userId, householdId);
      const count = await db.shoppingList.where("userId").equals(userId).count();
      console.log(`   ✓ Shopping List: ${count} items seeded`);
    }
    
    // 5. User XP (calculated from logs)
    await seedUserXP(userId);
    const xpData = await db.userXP.where("userId").equals(userId).first();
    if (xpData) {
      console.log(`   ✓ XP: Level ${xpData.level}, ${xpData.totalXP} total XP`);
    }
    
    // 6. Badges (calculated from activity)
    await seedBadges(userId);
    const badgeCount = await db.badges.where("userId").equals(userId).count();
    console.log(`   ✓ Badges: ${badgeCount} badges unlocked`);
    
    // 7. Family Preferences
    if (force || !hasPreferences) {
      await seedFamilyPreferences(userId, householdId);
      console.log(`   ✓ Family Preferences: Configured`);
    }
    
    // 8. Nutrition Data (7 days)
    if (force || !hasNutritionData) {
      await seedNutritionData(userId);
      const nutritionCount = await db.nutritionData.where("userId").equals(userId).count();
      console.log(`   ✓ Nutrition Data: ${nutritionCount} days seeded`);
    }
    
    // 9. Price Comparisons
    await seedPriceComparisons(userId);
    const priceCount = await db.priceComparisons.count();
    console.log(`   ✓ Price Comparisons: ${priceCount} items`);
    
    // Summary
    const finalInventory = await db.inventory.where("userId").equals(userId).count();
    const finalLogs = await db.logs.where("userId").equals(userId).count();
    const finalMeals = await db.mealPlans.where("userId").equals(userId).count();
    const finalShopping = await db.shoppingList.where("userId").equals(userId).count();
    const finalNutrition = await db.nutritionData.where("userId").equals(userId).count();
    
    console.log("✅ Demo data seeding complete!");
    console.log("   Summary:");
    console.log(`   - ${finalInventory} inventory items`);
    console.log(`   - ${finalLogs} consumption logs`);
    console.log(`   - ${finalMeals} meal plans`);
    console.log(`   - ${finalShopping} shopping list items`);
    console.log(`   - ${finalNutrition} days of nutrition data`);
    console.log(`   - ${badgeCount} badges`);
    console.log("   🎉 Your dashboard is now populated with demo data!");
    
  } catch (error) {
    console.error("❌ Error seeding user data:", error);
    throw error; // Re-throw so caller knows it failed
  }
}

/**
 * Seed the database with initial data
 */
export async function seedDatabase(): Promise<void> {
  try {
    // Always seed base data (food items and resources)
    const foodItemsCount = await db.foodItems.count();
    if (foodItemsCount === 0) {
    await seedFoodItems();
    }
    
    const resourcesCount = await db.resources.count();
    if (resourcesCount === 0) {
    await seedResources();
    }
    
    // Ensure at least one demo user exists so login works out of the box
    const userCount = await db.users.count();
    if (userCount === 0) {
      const now = getTimestamp();
      const demoUserId = generateId();
      const demoHouseholdId = generateId();
      await db.users.add({
        id: demoUserId,
        name: DEFAULT_DEMO_USER.name,
        email: DEFAULT_DEMO_USER.email,
        passwordHash: hashPassword(DEFAULT_DEMO_USER.password),
        householdId: demoHouseholdId,
        createdAt: now,
        updatedAt: now,
      });
      console.log("👤 Created default demo user:", DEFAULT_DEMO_USER.email);
      await seedUserData(demoUserId, demoHouseholdId, true);
      console.log("📦 Demo user data ready. Use demo@foodflow.app / password123 to login.");
    }
    
    // Seed family data for all existing users
    const users = await db.users.toArray();
    for (const user of users) {
      await seedUserData(user.id, user.householdId);
    }

    await seedCommunityModule();
    await seedRestaurantModule();
    
    // Mark as seeded only if we haven't before
    if (!isSeeded()) {
    markAsSeeded();
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

/**
 * Reset seed data for a specific user (for development/testing)
 */
export async function resetUserSeedData(userId: string, householdId?: string): Promise<void> {
  if (typeof window === "undefined") return;
  
  try {
    console.log("Resetting seed data for user:", userId);
    
    // Clear all user-specific data
    await db.inventory.where("userId").equals(userId).delete();
    await db.logs.where("userId").equals(userId).delete();
    await db.mealPlans.where("userId").equals(userId).delete();
    await db.shoppingList.where("userId").equals(userId).delete();
    await db.badges.where("userId").equals(userId).delete();
    await db.userXP.where("userId").equals(userId).delete();
    await db.nutritionData.where("userId").equals(userId).delete();
    if (householdId) {
      await db.familyPreferences.where("householdId").equals(householdId).delete();
    }
    await db.priceComparisons.toCollection().filter(pc => {
      // Price comparisons don't have userId, so we'll clear all
      return true;
    }).delete();
    
    // Re-seed with force flag
    await seedUserData(userId, householdId, true);
    console.log("✅ User data reset and re-seeded!");
  } catch (error) {
    console.error("Error resetting user seed data:", error);
    throw error;
  }
}

/**
 * Reset seed data (for development/testing)
 */
export async function resetSeedData(): Promise<void> {
  if (typeof window === "undefined") return;
  
  try {
    // Clear all data
    await db.inventory.clear();
    await db.logs.clear();
    await db.mealPlans.clear();
    await db.shoppingList.clear();
    await db.badges.clear();
    await db.userXP.clear();
    await db.familyPreferences.clear();
    await db.nutritionData.clear();
    await db.priceComparisons.clear();
    
    // Reset seed marker
    localStorage.removeItem(SEED_MARKER_KEY);
    
    // Re-seed
    await seedDatabase();
  } catch (error) {
    console.error("Error resetting seed data:", error);
  }
}

/**
 * Initialize database and seed if needed
 */
export async function initializeDatabase(): Promise<void> {
  // Seed will be called automatically on first access
  await seedDatabase();
}

