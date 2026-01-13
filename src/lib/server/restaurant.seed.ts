import {
  db,
  RestaurantInventoryItem,
  RestaurantMenuItem,
  RestaurantSurplusItem,
  RestaurantDonationLog,
  RestaurantImpactMetrics,
  StaffTask,
  ShiftScheduleEntry,
  RestaurantPreferences,
} from "./db";
import { generateId, getTimestamp } from "./helpers";

const RESTAURANT_SEED_KEY = "foodflow_restaurant_seed_v1";
let seedPromise: Promise<void> | null = null;

function daysFromNow(days: number): string {
  const now = new Date();
  now.setDate(now.getDate() + days);
  return now.toISOString();
}

export async function ensureRestaurantSeeded(): Promise<void> {
  if (typeof window === "undefined") return;
  if (seedPromise) return seedPromise;

  seedPromise = (async () => {
    const alreadySeeded = localStorage.getItem(RESTAURANT_SEED_KEY);
    const inventoryCount = await db.restaurantInventory.count();

    // Only skip if we have confirmed data exists
    if (alreadySeeded === "true" && inventoryCount > 0) {
      return;
    }

    // Clear localStorage if data is missing to force fresh seed
    if (alreadySeeded === "true" && inventoryCount === 0) {
      localStorage.removeItem(RESTAURANT_SEED_KEY);
    }

    const now = getTimestamp();

    const restaurantInventory: RestaurantInventoryItem[] = [
      {
        id: generateId(),
        name: "Chicken Breast",
        quantity: 10,
        unit: "kg",
        category: "protein",
        expiryDate: daysFromNow(2),
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
        expiryDate: daysFromNow(0),
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
        expiryDate: daysFromNow(1),
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
        expiryDate: daysFromNow(2),
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
        expiryDate: daysFromNow(30),
        storageType: "frozen",
        batchCode: "FRZ-990",
        alertTags: ["stable"],
        status: "normal",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        name: "Ground Beef",
        quantity: 15,
        unit: "kg",
        category: "protein",
        expiryDate: daysFromNow(1),
        storageType: "chilled",
        batchCode: "BEEF-301",
        alertTags: ["expiring"],
        status: "expiring",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        name: "Fresh Basil",
        quantity: 2,
        unit: "kg",
        category: "produce",
        expiryDate: daysFromNow(1),
        storageType: "fresh",
        batchCode: "HERB-88",
        alertTags: ["perishable", "urgent"],
        status: "expiring",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        name: "Yogurt",
        quantity: 30,
        unit: "L",
        category: "dairy",
        expiryDate: daysFromNow(3),
        storageType: "chilled",
        batchCode: "DAIRY-445",
        alertTags: ["chilled"],
        status: "normal",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        name: "Rice",
        quantity: 50,
        unit: "kg",
        category: "grains",
        expiryDate: daysFromNow(180),
        storageType: "dry",
        batchCode: "GRAIN-112",
        alertTags: ["stable"],
        status: "normal",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        name: "Onions",
        quantity: 25,
        unit: "kg",
        category: "produce",
        expiryDate: daysFromNow(7),
        storageType: "fresh",
        batchCode: "VEG-203",
        alertTags: [],
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
      {
        id: generateId(),
        name: "Beef Stir Fry",
        category: "main",
        ingredients: [
          { name: "Ground Beef", quantity: "2kg" },
          { name: "Onions", quantity: "0.5kg" },
          { name: "Bell Peppers", quantity: "0.8kg" },
        ],
        predictedWasteScore: "low",
        price: 14,
        margin: 38,
        suggestions: ["Popular item, maintain current prep levels"],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        name: "Fresh Garden Salad",
        category: "appetizer",
        ingredients: [
          { name: "Fresh Basil", quantity: "0.2kg" },
          { name: "Tomatoes", quantity: "0.3kg" },
          { name: "Spinach", quantity: "0.5kg" },
        ],
        predictedWasteScore: "medium",
        price: 8,
        margin: 42,
        suggestions: ["Use expiring greens first", "Offer as side dish"],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        name: "Yogurt Parfait",
        category: "dessert",
        ingredients: [
          { name: "Yogurt", quantity: "1.5L" },
          { name: "Fresh Fruits", quantity: "0.5kg" },
        ],
        predictedWasteScore: "low",
        price: 7,
        margin: 48,
        suggestions: ["Great for using expiring dairy"],
        createdAt: now,
        updatedAt: now,
      },
    ];

    await db.restaurantMenuItems.bulkAdd(menuItems);

    const surplusItems: RestaurantSurplusItem[] = [
      {
        id: generateId(),
        title: "Chicken Biryani Portions",
        description: "12 portions prepared for lunch service, still warm and ready to serve",
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
        description: "8 bowls from dinner prep, vegetarian and vegan-friendly",
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
        title: "Fresh Salad Mix",
        description: "5 large containers of mixed greens and vegetables",
        quantity: 5,
        unit: "containers",
        category: "produce",
        storageType: "fresh",
        pickupWindow: { start: "10:00", end: "14:00" },
        tags: ["vegetarian", "healthy"],
        assignedTo: "ngo",
        recipientName: "Green Hope",
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
        description: "3 crates of fresh tomatoes nearing expiry, perfect for sauces",
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
      {
        id: generateId(),
        title: "Bread Rolls",
        description: "2 dozen fresh bread rolls from morning baking",
        quantity: 24,
        unit: "pieces",
        category: "bakery",
        storageType: "fresh",
        pickupWindow: { start: "14:00", end: "17:00" },
        tags: ["bread", "bakery"],
        assignedTo: "kitchen",
        recipientName: "Local Shelter",
        status: "pending",
        createdAt: now,
        updatedAt: now,
      },
    ];

    await db.restaurantSurplus.bulkAdd(surplusItems);

    const donationHistory: RestaurantDonationLog[] = [
      {
        id: generateId(),
        date: daysFromNow(-7),
        recipientType: "ngo",
        recipientName: "Hope Meals",
        items: "Chicken Biryani & Vegetable Curry",
        quantity: 120,
        unit: "meals",
        mealsProvided: 120,
        co2SavedKg: 3.8,
        notes: "Weekly donation - large batch",
        createdAt: now,
      },
      {
        id: generateId(),
        date: daysFromNow(-5),
        recipientType: "community-kitchen",
        recipientName: "Neighborhood Kitchen",
        items: "Sandwiches & Salad Mix",
        quantity: 65,
        unit: "meals",
        mealsProvided: 65,
        co2SavedKg: 2.1,
        notes: "Lunch surplus",
        createdAt: now,
      },
      {
        id: generateId(),
        date: daysFromNow(-3),
        recipientType: "ngo",
        recipientName: "Urban Outreach",
        items: "Bread Rolls & Fresh Produce",
        quantity: 45,
        unit: "meals",
        mealsProvided: 45,
        co2SavedKg: 1.5,
        notes: "Breakfast items",
        createdAt: now,
      },
      {
        id: generateId(),
        date: daysFromNow(-2),
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
        date: daysFromNow(-1),
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

    localStorage.setItem(RESTAURANT_SEED_KEY, "true");
    console.log("✅ Restaurant seed data initialized successfully");
  })().catch((error) => {
    console.error("❌ Error seeding restaurant data:", error);
    seedPromise = null; // Reset so it can be retried
    throw error;
  });

  await seedPromise;
}

