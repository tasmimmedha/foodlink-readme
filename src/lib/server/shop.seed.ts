import {
  db,
  getDb,
  ShopInventoryItem,
  ShopPriceMapEntry,
  ShopDiscountSuggestion,
  ShopSurplusItem,
  ShopAnalyticsRecord,
  ShopStaffMember,
  ShopStaffTask,
  ShopShift,
  ShopProfile,
} from "./db";
import { generateId, getTimestamp } from "./helpers";

const SHOP_SEED_KEY = "foodflow_shop_seed_v1";
let seedPromise: Promise<void> | null = null;

function daysFromNow(days: number): string {
  const now = new Date();
  now.setDate(now.getDate() + days);
  return now.toISOString();
}

export async function ensureShopSeedData(): Promise<void> {
  if (typeof window === "undefined") return;
  if (seedPromise) return seedPromise;

  seedPromise = (async () => {
    const alreadySeeded = localStorage.getItem(SHOP_SEED_KEY);
    const inventoryCount = await db.shopInventory.count();

    // Only skip if we have confirmed data exists
    if (alreadySeeded === "true" && inventoryCount > 0) {
      return;
    }

    // Clear localStorage if data is missing to force fresh seed
    if (alreadySeeded === "true" && inventoryCount === 0) {
      localStorage.removeItem(SHOP_SEED_KEY);
    }

    const now = getTimestamp();

    const skuEntries: ShopInventoryItem[] = [
      {
        id: generateId(),
        name: "Milk 1L",
        category: "Dairy",
        barcode: "GM-0001",
        stockQuantity: 12,
        unit: "bottles",
        price: 90,
        cost: 60,
        expiryDate: daysFromNow(0),
        storageType: "chilled",
        shelfLocation: "Chiller A1",
        imageData: undefined,
        markdownStatus: "active",
        surplusEligible: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        name: "Chicken 1kg",
        category: "Meat",
        barcode: "GM-0002",
        stockQuantity: 8,
        unit: "packs",
        price: 420,
        cost: 320,
        expiryDate: daysFromNow(1),
        storageType: "frozen",
        shelfLocation: "Freezer B2",
        imageData: undefined,
        markdownStatus: "scheduled",
        surplusEligible: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        name: "Tomatoes 5kg Crate",
        category: "Produce",
        barcode: "GM-0003",
        stockQuantity: 6,
        unit: "crates",
        price: 350,
        cost: 250,
        expiryDate: daysFromNow(2),
        storageType: "ambient",
        shelfLocation: "Produce Dock",
        imageData: undefined,
        markdownStatus: "scheduled",
        surplusEligible: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        name: "Egg Tray 30pc",
        category: "Dairy",
        barcode: "GM-0004",
        stockQuantity: 15,
        unit: "trays",
        price: 330,
        cost: 220,
        expiryDate: daysFromNow(5),
        storageType: "ambient",
        shelfLocation: "Rack C3",
        imageData: undefined,
        markdownStatus: "none",
        surplusEligible: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        name: "Potatoes 10kg",
        category: "Produce",
        barcode: "GM-0005",
        stockQuantity: 20,
        unit: "sacks",
        price: 480,
        cost: 360,
        expiryDate: daysFromNow(15),
        storageType: "ambient",
        shelfLocation: "Backroom",
        imageData: undefined,
        markdownStatus: "none",
        surplusEligible: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        name: "Bread Loaf",
        category: "Bakery",
        barcode: "GM-0006",
        stockQuantity: 18,
        unit: "loaves",
        price: 70,
        cost: 40,
        expiryDate: daysFromNow(0),
        storageType: "ambient",
        shelfLocation: "Bakery Endcap",
        imageData: undefined,
        markdownStatus: "active",
        surplusEligible: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        name: "Apples 2kg",
        category: "Produce",
        barcode: "GM-0007",
        stockQuantity: 10,
        unit: "bags",
        price: 260,
        cost: 180,
        expiryDate: daysFromNow(1),
        storageType: "chilled",
        shelfLocation: "Produce Island",
        imageData: undefined,
        markdownStatus: "scheduled",
        surplusEligible: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        name: "Yogurt Cups 6-pack",
        category: "Dairy",
        barcode: "GM-0008",
        stockQuantity: 14,
        unit: "packs",
        price: 210,
        cost: 130,
        expiryDate: daysFromNow(3),
        storageType: "chilled",
        shelfLocation: "Chiller B1",
        imageData: undefined,
        markdownStatus: "none",
        surplusEligible: true,
        createdAt: now,
        updatedAt: now,
      },
    ];

    const priceMapEntries: ShopPriceMapEntry[] = skuEntries.slice(0, 4).map((sku, index) => ({
      id: generateId(),
      skuId: sku.id,
      skuName: sku.name,
      oldPrice: sku.price,
      newPrice: Number((sku.price * (1 - (0.05 + index * 0.05))).toFixed(2)),
      method: "percentage",
      changeValue: 5 + index * 5,
      effectiveAt: daysFromNow(0),
      scheduledBy: "Pricing Automation",
      notes: "Auto markdown for near expiry",
      createdAt: now,
    }));

    const discountSuggestions: ShopDiscountSuggestion[] = skuEntries.slice(0, 4).map((sku, idx) => ({
      id: generateId(),
      skuId: sku.id,
      skuName: sku.name,
      reason: idx % 2 === 0 ? "Expiring soon" : "Slow movement",
      suggestedDiscountPct: 10 + idx * 5,
      predictedSellThrough: 60 + idx * 8,
      urgency: idx < 2 ? "high" : "medium",
      expiresAt: daysFromNow(1),
      createdAt: now,
    }));

    const surplusQueue: ShopSurplusItem[] = [
      {
        id: generateId(),
        skuName: "Bread Loaf",
        quantity: 10,
        unit: "loaves",
        expiryWindowStart: daysFromNow(0),
        expiryWindowEnd: daysFromNow(1),
        condition: "near-expiry",
        destinationType: "ngo",
        destinationName: "Warm Meals Shelter",
        status: "pending",
        pickupTime: daysFromNow(0),
        reminderSent: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        skuName: "Milk 1L",
        quantity: 6,
        unit: "bottles",
        expiryWindowStart: daysFromNow(0),
        expiryWindowEnd: daysFromNow(1),
        condition: "near-expiry",
        destinationType: "community-kitchen",
        destinationName: "Community Kitchen 5A",
        status: "pending",
        pickupTime: daysFromNow(0),
        reminderSent: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        skuName: "Tomatoes 5kg Crate",
        quantity: 4,
        unit: "kg",
        expiryWindowStart: daysFromNow(1),
        expiryWindowEnd: daysFromNow(2),
        condition: "fresh",
        destinationType: "ngo",
        destinationName: "Family Care NGO",
        status: "pending",
        pickupTime: daysFromNow(1),
        reminderSent: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        skuName: "Sandwich Packs",
        quantity: 5,
        unit: "packs",
        expiryWindowStart: daysFromNow(0),
        expiryWindowEnd: daysFromNow(0),
        condition: "fresh",
        destinationType: "community-kitchen",
        destinationName: "Evening Soup Run",
        status: "pending",
        pickupTime: daysFromNow(0),
        reminderSent: false,
        createdAt: now,
        updatedAt: now,
      },
    ];

    const analyticsRecord: ShopAnalyticsRecord = {
      id: generateId(),
      wasteReductionTrend: [
        { label: "Mon", value: 5 },
        { label: "Tue", value: 7 },
        { label: "Wed", value: 6 },
        { label: "Thu", value: 8 },
        { label: "Fri", value: 9 },
        { label: "Sat", value: 11 },
        { label: "Sun", value: 10 },
      ],
      markdownRecoveryTrend: [
        { label: "Week 1", value: 14 },
        { label: "Week 2", value: 18 },
        { label: "Week 3", value: 16 },
        { label: "Week 4", value: 21 },
      ],
      wasteByCategory: [
        { category: "Produce", value: 35 },
        { category: "Dairy", value: 25 },
        { category: "Bakery", value: 18 },
        { category: "Meat", value: 12 },
        { category: "Other", value: 10 },
      ],
      surplusVsSold: [
        { label: "Surplus Donated", value: 32 },
        { label: "Markdown Sold", value: 68 },
      ],
      expiredPerDay: [
        { label: "Mon", value: 6 },
        { label: "Tue", value: 4 },
        { label: "Wed", value: 5 },
        { label: "Thu", value: 3 },
        { label: "Fri", value: 6 },
        { label: "Sat", value: 2 },
        { label: "Sun", value: 4 },
      ],
      totalCo2Prevented: 240,
      mealsDonated: 180,
      wasteReductionPercent: 28,
      updatedAt: now,
    };

    const staffMembers: ShopStaffMember[] = [
      {
        id: generateId(),
        name: "Ahmed Rahman",
        role: "Inventory Manager",
        shift: "Morning",
        contact: "+880 1770-111222",
        responsibilities: ["Stock audits", "Expiry monitoring"],
      },
      {
        id: generateId(),
        name: "Sara Zerin",
        role: "Pricing Lead",
        shift: "Flexible",
        contact: "+880 1888-333444",
        responsibilities: ["Markdown approvals", "Promotion planning"],
      },
      {
        id: generateId(),
        name: "Musa Karim",
        role: "Prep & Packing",
        shift: "Evening",
        contact: "+880 1999-555666",
        responsibilities: ["Donation prep", "Cold storage handling"],
      },
      {
        id: generateId(),
        name: "Laila Chowdhury",
        role: "Cashier / Surplus Prep",
        shift: "Split",
        contact: "+880 1444-777888",
        responsibilities: ["Customer checkout", "Bagging surplus"],
      },
    ];

    const staffTasks: ShopStaffTask[] = [
      {
        id: generateId(),
        title: "Check dairy expiry",
        description: "Scan chilled aisle for items expiring within 48h",
        assigneeId: staffMembers[0].id,
        due: daysFromNow(0),
        completed: false,
        category: "expiry",
        priority: "high",
      },
      {
        id: generateId(),
        title: "Prepare tomatoes for donation",
        description: "Sort 4kg crate and pack for NGO pickup",
        assigneeId: staffMembers[2].id,
        due: daysFromNow(0),
        completed: false,
        category: "surplus",
        priority: "medium",
      },
      {
        id: generateId(),
        title: "Update bread pricing",
        description: "Apply 25% markdown to bread loaves expiring tonight",
        assigneeId: staffMembers[1].id,
        due: daysFromNow(0),
        completed: true,
        category: "pricing",
        priority: "high",
      },
    ];

    const shiftEntries: ShopShift[] = [
      {
        id: generateId(),
        staffId: staffMembers[0].id,
        day: "Mon",
        startTime: "08:00",
        endTime: "16:00",
        station: "Inventory Floor",
      },
      {
        id: generateId(),
        staffId: staffMembers[1].id,
        day: "Tue",
        startTime: "10:00",
        endTime: "18:00",
        station: "Pricing Desk",
      },
      {
        id: generateId(),
        staffId: staffMembers[2].id,
        day: "Wed",
        startTime: "14:00",
        endTime: "22:00",
        station: "Prep Room",
      },
      {
        id: generateId(),
        staffId: staffMembers[3].id,
        day: "Thu",
        startTime: "12:00",
        endTime: "20:00",
        station: "Front + Surplus",
      },
    ];

    const profile: ShopProfile = {
      id: generateId(),
      storeName: "GreenMart Superstore",
      address: "House 12, Road 4, Banani, Dhaka",
      contactNumber: "+880 1700-555111",
      managerName: "Demo Manager",
      operatingHours: "09:00 AM - 11:00 PM",
      notificationPreferences: {
        expiryAlerts: true,
        surplusReminders: true,
        priceUpdates: true,
      },
      donationPreferences: ["Accept all categories", "Cooked food not accepted"],
      categoryPriority: ["Dairy", "Produce", "Bakery", "Meat", "Beverages"],
      barcodePrefix: "GM-",
      updatedAt: now,
    };

    const database = getDb();
    await database.transaction(
      "rw",
      database.shopInventory,
      database.shopPriceMap,
      database.shopDiscountSuggestions,
      database.shopSurplus,
      database.shopAnalytics,
      database.shopStaff,
      database.shopStaffTasks,
      database.shopShifts,
      database.shopProfile,
      async () => {
        await database.shopInventory.clear();
        await database.shopPriceMap.clear();
        await database.shopDiscountSuggestions.clear();
        await database.shopSurplus.clear();
        await database.shopAnalytics.clear();
        await database.shopStaff.clear();
        await database.shopStaffTasks.clear();
        await database.shopShifts.clear();
        await database.shopProfile.clear();

        await database.shopInventory.bulkAdd(skuEntries);
        await database.shopPriceMap.bulkAdd(priceMapEntries);
        await database.shopDiscountSuggestions.bulkAdd(discountSuggestions);
        await database.shopSurplus.bulkAdd(surplusQueue);
        await database.shopAnalytics.add(analyticsRecord);
        await database.shopStaff.bulkAdd(staffMembers);
        await database.shopStaffTasks.bulkAdd(staffTasks);
        await database.shopShifts.bulkAdd(shiftEntries);
        await database.shopProfile.add(profile);
      }
    );

    localStorage.setItem(SHOP_SEED_KEY, "true");
  })().finally(() => {
    seedPromise = null;
  });

  return seedPromise;
}


