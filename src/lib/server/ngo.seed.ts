import {
  getDb,
  NGOCapacitySettings,
  NGODonationOffer,
  NGOPickupSchedule,
  NGODonationHistoryEntry,
  NGOPartnerProfile,
  NGOFeedbackEntry,
  NGOImpactStory,
  NGONotification,
} from "./db";
import { generateId, getTimestamp } from "./helpers";

const NGO_SEED_KEY = "foodflow_ngo_seed_v1";
let seedPromise: Promise<void> | null = null;

function hoursFromNow(hours: number): string {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

function minutesFromNow(minutes: number): string {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString();
}

export async function ensureNgoSeedData(): Promise<void> {
  if (typeof window === "undefined") return;
  if (seedPromise) return seedPromise;

  seedPromise = (async () => {
    const database = getDb();
    const alreadySeeded = localStorage.getItem(NGO_SEED_KEY);
    const capacityCount = await database.ngoCapacity.count();

    // Only skip if we have confirmed data exists
    if (alreadySeeded === "true" && capacityCount > 0) {
      return;
    }

    // Clear localStorage if data is missing to force fresh seed
    if (alreadySeeded === "true" && capacityCount === 0) {
      localStorage.removeItem(NGO_SEED_KEY);
    }

    const now = getTimestamp();
    const capacityRecord: NGOCapacitySettings = {
      id: generateId(),
      orgName: "Nurture Home Orphanage",
      location: "Gulshan, Dhaka",
      geoPoint: { lat: 23.7925, lng: 90.4078 },
      managerName: "Farida Ahmed",
      contactPhone: "+880 1777-000111",
      contactEmail: "farida@nurturehome.org",
      preferredFoodTypes: ["cooked", "produce", "raw", "protein"],
      restrictedItems: ["pork", "expired goods"],
      storageTypes: ["refrigerated", "dry"],
      safetyRules: ["No pork items", "Hot meals above 63°C", "Label allergens clearly"],
      policyNotes: "Cooked meals preferred before 6 PM. Focus on high-protein meals for kids.",
      pickupWindow: { start: "09:00", end: "21:00" },
      dailyCapacityKg: 18,
      refrigeratedCapacityKg: 10,
      dryCapacityKg: 12,
      currentUtilizationKg: 11,
      xpPoints: 2480,
      level: 7,
      levelProgressPct: 62,
      autoAcceptance: {
        allowPork: false,
        rejectExpired: true,
        temperatureChecks: true,
      },
      preferredPickupRadiusKm: 6,
      updatedAt: now,
    };

    const offers: NGODonationOffer[] = [
      {
        id: generateId(),
        donorName: "Community Kitchen - Building 7",
        donorType: "kitchen",
        partnerId: undefined,
        distanceKm: 2.1,
        locationLabel: "Building 7, Gulshan 2",
        offerTitle: "Fish Curry Trays",
        items: [
          { name: "Fish curry", quantity: 5, unit: "kg", type: "cooked", temperature: "hot" },
          { name: "Steamed rice", quantity: 3, unit: "kg", type: "cooked", temperature: "hot" },
        ],
        weightKg: 8,
        mealsEstimated: 35,
        freshnessScore: 92,
        pickupWindow: { start: minutesFromNow(30), end: minutesFromNow(90) },
        expiresAt: hoursFromNow(2),
        urgencyLevel: "high",
        dietaryNotes: "Halal certified, contains fish bones",
        safetyFlags: ["perishable", "needs insulated carrier"],
        contact: {
          name: "Sharmeen",
          phone: "+880 1711-889900",
          channel: "call",
        },
        images: [
          "https://images.unsplash.com/photo-1608039829574-6cff9be79a2a",
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
        ],
        status: "pending",
        matchReason: "Urgent pickup within 2km, matches cooked preference",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        donorName: "Restaurant A - Banani",
        donorType: "restaurant",
        partnerId: undefined,
        distanceKm: 3.8,
        locationLabel: "Road 12, Banani",
        offerTitle: "Rice & Dal Pack",
        items: [
          { name: "Rice", quantity: 6, unit: "kg", type: "raw" },
          { name: "Split lentils", quantity: 4, unit: "kg", type: "raw" },
        ],
        weightKg: 10,
        mealsEstimated: 50,
        freshnessScore: 88,
        pickupWindow: { start: hoursFromNow(12), end: hoursFromNow(16) },
        expiresAt: hoursFromNow(20),
        urgencyLevel: "medium",
        dietaryNotes: "Vegetarian, double-bagged",
        contact: {
          name: "Chef Rahman",
          phone: "+880 1999-445566",
          channel: "whatsapp",
        },
        images: [
          "https://images.unsplash.com/photo-1604908177225-6c34c52b4d45",
        ],
        status: "pending",
        matchReason: "Staple ingredients align with weekly meal plan",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        donorName: "Family 2C",
        donorType: "household",
        distanceKm: 1.4,
        locationLabel: "Lane 5, Gulshan 1",
        offerTitle: "Vegetable Basket",
        items: [
          { name: "Assorted vegetables", quantity: 8, unit: "kg", type: "produce" },
        ],
        weightKg: 8,
        mealsEstimated: 28,
        freshnessScore: 95,
        pickupWindow: { start: hoursFromNow(1), end: hoursFromNow(3) },
        expiresAt: hoursFromNow(6),
        urgencyLevel: "medium",
        dietaryNotes: "Organic garden harvest",
        contact: {
          name: "Mrs. Rahila",
          phone: "+880 1888-223344",
        },
        images: [
          "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38",
        ],
        status: "pending",
        matchReason: "Fresh produce within 3km radius",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        donorName: "Community Kitchen Collective",
        donorType: "kitchen",
        partnerId: undefined,
        distanceKm: 4.2,
        locationLabel: "Niketan Community Center",
        offerTitle: "Cooked Biryani Packs",
        items: [
          { name: "Chicken biryani", quantity: 12, unit: "portions", type: "cooked", temperature: "hot" },
        ],
        weightKg: 7.5,
        mealsEstimated: 12,
        freshnessScore: 90,
        pickupWindow: { start: hoursFromNow(2), end: hoursFromNow(5) },
        expiresAt: hoursFromNow(5),
        urgencyLevel: "medium",
        dietaryNotes: "Contains nuts",
        safetyFlags: ["allergen: nuts"],
        contact: {
          name: "Chef Laila",
          phone: "+880 1555-667788",
        },
        images: [
          "https://images.unsplash.com/photo-1608039829574-6cff9be79a2a",
        ],
        status: "accepted",
        matchReason: "High protein meal requested by dorm wing",
        createdAt: now,
        updatedAt: now,
      },
    ];

    const pickups: NGOPickupSchedule[] = [
      {
        id: generateId(),
        offerId: offers[3].id,
        scheduledFor: hoursFromNow(3),
        etaMinutes: 35,
        volunteerName: "Nasir Chowdhury",
        volunteerContact: "+880 1711-111222",
        vehicleType: "van",
        status: "scheduled",
        checkpoints: [
          { label: "Depart NGO", status: "pending" },
          { label: "Arrive donor", status: "pending" },
          { label: "Return & unload", status: "pending" },
        ],
        reminders: [
          { time: hoursFromNow(2.5), type: "info", delivered: false },
          { time: hoursFromNow(2.9), type: "warning", delivered: false },
        ],
        notes: "Need insulated containers",
        createdAt: now,
        updatedAt: now,
      },
    ];

    const history: NGODonationHistoryEntry[] = [
      {
        id: generateId(),
        offerId: undefined,
        donorName: "Café Green Terrace",
        donorType: "restaurant",
        itemsSummary: "Mixed salads & grilled chicken",
        weightKg: 15,
        mealsProvided: 60,
        co2PreventedKg: 22,
        beneficiaries: 48,
        pickupTime: hoursFromNow(-24),
        deliveredAt: hoursFromNow(-23.5),
        status: "delivered",
        tags: ["high-protein", "refrigerated"],
        photo: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0",
        createdAt: now,
      },
      {
        id: generateId(),
        offerId: undefined,
        donorName: "Building 3 Coordinator",
        donorType: "building",
        itemsSummary: "Dry ration combo",
        weightKg: 20,
        mealsProvided: 80,
        co2PreventedKg: 30,
        beneficiaries: 60,
        pickupTime: hoursFromNow(-48),
        deliveredAt: hoursFromNow(-47.5),
        status: "delivered",
        tags: ["staples"],
        createdAt: now,
      },
    ];

    const partners: NGOPartnerProfile[] = [
      {
        id: generateId(),
        name: "Community Kitchen - Building 7",
        type: "community-kitchen",
        location: "Building 7 Rooftop, Gulshan 2",
        distanceKm: 2.1,
        contactName: "Chef Laila",
        contactPhone: "+880 1555-667788",
        contactEmail: "chef.laila@ckitchen.com",
        operatingHours: "10:00 - 22:00",
        acceptanceRate: 0.92,
        lastDonationAt: hoursFromNow(-5),
        avgDonationKg: 9,
        storageCapabilities: ["hot-box", "refrigerated"],
        notes: "Reliable for weekday dinners",
        avatar: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        name: "Restaurant A - Banani",
        type: "restaurant",
        location: "Road 12, Banani",
        distanceKm: 3.8,
        contactName: "Chef Rahman",
        contactPhone: "+880 1999-445566",
        contactEmail: "chef@restoa.com",
        operatingHours: "08:00 - 23:00",
        acceptanceRate: 0.87,
        lastDonationAt: hoursFromNow(-12),
        avgDonationKg: 11,
        storageCapabilities: ["refrigerated", "dry"],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        name: "Building 3 Coordinator (Mrs. Khan)",
        type: "building",
        location: "Building 3, Gulshan 1",
        distanceKm: 1.7,
        contactName: "Mrs. Khan",
        contactPhone: "+880 1444-556677",
        operatingHours: "09:00 - 21:00",
        acceptanceRate: 0.9,
        lastDonationAt: hoursFromNow(-26),
        avgDonationKg: 7,
        storageCapabilities: ["dry"],
        createdAt: now,
        updatedAt: now,
      },
    ];

    const feedback: NGOFeedbackEntry[] = [
      {
        id: generateId(),
        recipientName: "Girls Dorm Wing",
        partnerName: "Community Kitchen - Building 7",
        deliveryDate: hoursFromNow(-20),
        rating: 3,
        comment: "Meal was cold when it arrived last night.",
        tags: ["temperature"],
        photo: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd",
        status: "pending",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        recipientName: "Study Group B",
        partnerName: "Restaurant A - Banani",
        deliveryDate: hoursFromNow(-36),
        rating: 2,
        comment: "Utensils missing from kit.",
        tags: ["packaging"],
        status: "pending",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        recipientName: "Weekend Camp Kids",
        partnerName: "Family 2C",
        deliveryDate: hoursFromNow(-12),
        rating: 5,
        comment: "Kids loved the fresh veggies!",
        tags: ["positive"],
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        status: "acknowledged",
        createdAt: now,
        updatedAt: now,
      },
    ];

    const impactStories: NGOImpactStory[] = [
      {
        id: generateId(),
        title: "After-School Nutrition Boost",
        excerpt: "35 children received a protein-rich dinner made from Building 7 donations.",
        beneficiaryType: "Students",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        metrics: { meals: 35, families: 12, smiles: 35 },
        publishedAt: hoursFromNow(-72),
      },
      {
        id: generateId(),
        title: "Weekend Wellness Hampers",
        excerpt: "Dry pantry packs helped 18 families cook balanced meals all weekend.",
        beneficiaryType: "Families",
        metrics: { meals: 72, families: 18 },
        publishedAt: hoursFromNow(-168),
      },
    ];

    const notifications: NGONotification[] = [
      {
        id: generateId(),
        type: "urgent-offer",
        title: "Fish curry pickup expires in 2h",
        description: "Building 7 trays need pickup before 18:00.",
        relatedEntityId: offers[0].id,
        severity: "critical",
        read: false,
        createdAt: now,
      },
      {
        id: generateId(),
        type: "pickup",
        title: "Nasir scheduled for Niketan route",
        description: "Confirm insulated containers are ready.",
        relatedEntityId: pickups[0].id,
        severity: "info",
        read: false,
        createdAt: now,
      },
      {
        id: generateId(),
        type: "feedback",
        title: "Temperature issue reported",
        description: "Girls Dorm Wing flagged cold meal.",
        relatedEntityId: feedback[0].id,
        severity: "warning",
        read: false,
        createdAt: now,
      },
    ];

    await database.transaction(
      "rw",
      database.ngoCapacity,
      database.ngoOffers,
      database.ngoPickups,
      database.ngoHistory,
      database.ngoPartners,
      database.ngoFeedback,
      database.ngoImpactStories,
      database.ngoNotifications,
      async () => {
        await database.ngoCapacity.clear();
        await database.ngoOffers.clear();
        await database.ngoPickups.clear();
        await database.ngoHistory.clear();
        await database.ngoPartners.clear();
        await database.ngoFeedback.clear();
        await database.ngoImpactStories.clear();
        await database.ngoNotifications.clear();

        await database.ngoCapacity.add(capacityRecord);
        await database.ngoOffers.bulkAdd(offers);
        await database.ngoPickups.bulkAdd(pickups);
        await database.ngoHistory.bulkAdd(history);
        await database.ngoPartners.bulkAdd(partners);
        await database.ngoFeedback.bulkAdd(feedback);
        await database.ngoImpactStories.bulkAdd(impactStories);
        await database.ngoNotifications.bulkAdd(notifications);
      }
    );

    localStorage.setItem(NGO_SEED_KEY, "true");
    console.log("✅ NGO seed data initialized successfully");
  })().catch((error) => {
    console.error("❌ Error seeding NGO data:", error);
    throw error;
  }).finally(() => {
    seedPromise = null;
  });

  await seedPromise;
}


