import Dexie, { Table } from "dexie";

// Database entities
export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  householdId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  userId: string;
  name: string;
  quantity: number;
  unit?: string;
  expiryDate?: string;
  category?: string;
  location?: string;
  foodItemId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  typicalExpiryDays: number;
  storageTips?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConsumptionLog {
  id: string;
  userId: string;
  inventoryItemId?: string;
  foodName: string;
  quantity: number;
  unit?: string;
  category?: string;
  consumedAt: string;
  wasWasted: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  url?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Upload {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  data: string; // base64 encoded
  associatedType?: "inventory" | "log" | "profile";
  associatedId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MealPlan {
  id: string;
  userId: string;
  householdId?: string;
  date: string; // YYYY-MM-DD
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  name: string;
  description?: string;
  ingredients?: string[];
  servings?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingListItem {
  id: string;
  userId: string;
  householdId?: string;
  name: string;
  quantity: number;
  unit?: string;
  category?: string;
  priority: "low" | "medium" | "high";
  purchased: boolean;
  purchasedAt?: string;
  estimatedPrice?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Badge {
  id: string;
  userId: string;
  badgeId: string; // e.g., "leftover-master", "zero-waste-champion"
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  xpReward: number;
  createdAt: string;
}

export interface UserXP {
  id: string;
  userId: string;
  totalXP: number;
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  updatedAt: string;
}

export interface FamilyPreferences {
  id: string;
  householdId: string;
  // Household
  householdSize: number;
  ageGroups?: {
    child?: number;
    adult?: number;
    senior?: number;
  };
  cookingFrequency?: "daily" | "few-times-week" | "weekly" | "occasional";
  eatingSchedule?: {
    breakfast?: string; // e.g., "07:00"
    lunch?: string;
    dinner?: string;
  };
  // Diet & Restrictions
  dietaryType?: "vegan" | "vegetarian" | "halal" | "keto" | "low-sodium" | "general";
  dietaryRestrictions: string[]; // e.g., "vegetarian", "vegan", "gluten-free"
  allergies: string[];
  healthConditions?: string[]; // e.g., "diabetes", "heart", "celiac", "hypertension"
  // Budget & Shopping
  weeklyBudget?: number;
  budgetRange: {
    min: number;
    max: number;
  };
  preferredStores: string[];
  priceSensitivity?: "low" | "medium" | "high";
  // Culinary
  preferredCuisines?: string[]; // e.g., "asian", "italian", "middle-eastern", "indian", "western"
  mealPrepPreference?: "quick" | "diverse" | "budget" | "high-protein";
  // Sustainability
  wasteSensitivityLevel?: "low" | "medium" | "high";
  sustainabilityPreference?: "minimal" | "moderate" | "high";
  leftoverComfortLevel?: "low" | "medium" | "high";
  // Nutrition Goals
  dailyCalories?: number;
  macroGoal?: {
    protein?: number; // percentage
    carbs?: number;
    fats?: number;
  };
  vitaminsFocus?: string[]; // e.g., "iron", "vitaminD", "calcium", "B12"
  avoidExcess?: string[]; // e.g., "sugar", "sodium", "fats"
  createdAt: string;
  updatedAt: string;
}

export interface NutritionData {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  // Macros
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fats: number; // grams
  fiber: number; // grams
  // Micronutrients
  sugar: number; // grams
  sodium: number; // mg
  // Vitamins
  vitaminA: number; // IU
  vitaminB: number; // mg
  vitaminC: number; // mg
  vitaminD: number; // IU
  iron: number; // mg
  calcium: number; // mg
  // Score
  nutritionScore?: number; // 0-100
  createdAt: string;
  updatedAt: string;
}

export interface PriceComparison {
  id: string;
  itemName: string;
  category?: string;
  stores: {
    storeName: string;
    price: number;
    unit?: string;
    available: boolean;
  }[];
  bestPrice: {
    storeName: string;
    price: number;
  };
  updatedAt: string;
}

export interface SurplusRequest {
  id: string;
  userId: string;
  userName: string;
  message: string;
  status: "pending" | "approved" | "declined";
  createdAt: string;
}

export interface SurplusComment {
  id: string;
  userId: string;
  userName: string;
  message: string;
  createdAt: string;
}

export interface CommunitySurplusPost {
  id: string;
  userId: string;
  userName: string;
  avatarUrl?: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  quantity: number;
  unit: string;
  pickupWindow: {
    start: string;
    end: string;
  };
  pickupLocation: string;
  distanceKm?: number;
  image?: string;
  status: "available" | "claimed" | "expired";
  expiresAt: string;
  requests: SurplusRequest[];
  comments: SurplusComment[];
  createdAt: string;
  updatedAt: string;
}

export interface LeftoverItemClaim {
  id: string;
  userId: string;
  userName: string;
  message?: string;
  createdAt: string;
}

export interface LeftoverItem {
  id: string;
  userId: string;
  userName: string;
  avatarUrl?: string;
  dishName: string;
  description: string;
  portions: number;
  distanceKm: number;
  dietaryTags: string[];
  allergens: string[];
  pickupWindow: string;
  status: "available" | "claimed";
  image?: string;
  claims: LeftoverItemClaim[];
  createdAt: string;
  updatedAt: string;
}

export interface KitchenVolunteer {
  id: string;
  userId: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface CommunityKitchenEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  tags: string[];
  volunteersNeeded: number;
  volunteers: KitchenVolunteer[];
  foodSavedKg: number;
  status: "upcoming" | "in-progress" | "completed";
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  household?: string;
  value: number;
  unit: string;
  badge?: string;
  trend?: "up" | "down" | "steady";
}

export interface CommunityLeaderboard {
  id: string;
  type: "top-sharers" | "zero-waste" | "volunteer-stars" | "building-impact" | "weekly-xp";
  entries: LeaderboardEntry[];
  updatedAt: string;
}

export interface ImpactTrendPoint {
  label: string;
  value: number;
}

export interface CommunityImpact {
  id: string;
  totalSurplusKg: number;
  donations: number;
  co2PreventedKg: number;
  waterSavedLiters: number;
  mealsProvided: number;
  weeklyTrend: ImpactTrendPoint[];
  personalContribution: {
    label: string;
    value: number;
    unit: string;
  }[];
  updatedAt: string;
}

export interface CommunityNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "claim" | "volunteer" | "announcement" | "surplus" | "reminder";
  read: boolean;
  createdAt: string;
}

export interface CommunityProfile {
  id: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  communityRole: "member" | "champion" | "organizer";
  bio?: string;
  preferredItems: string[];
  avoidItems: string[];
  dietaryRestrictions: string[];
  allergens: string[];
  acceptsHotMeals: boolean;
  distancePreference: "1km" | "3km" | "5km" | "any";
  visibility: "public" | "community" | "private";
  notificationsEnabled: boolean;
  notifyOnClaim: boolean;
  notifyOnMessages: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantInventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expiryDate: string;
  storageType: "fresh" | "chilled" | "frozen" | "dry";
  batchCode?: string;
  alertTags: string[];
  status: "normal" | "expiring" | "overstocked";
  invoiceImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantMenuItem {
  id: string;
  name: string;
  category: string;
  ingredients: { name: string; quantity: string }[];
  predictedWasteScore: "low" | "medium" | "high";
  price: number;
  margin: number;
  suggestions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantSurplusItem {
  id: string;
  title: string;
  description: string;
  quantity: number;
  unit: string;
  category: string;
  storageType: "fresh" | "chilled" | "frozen";
  pickupWindow: {
    start: string;
    end: string;
  };
  tags: string[];
  image?: string;
  assignedTo?: "ngo" | "kitchen";
  recipientName?: string;
  status: "pending" | "picked-up" | "expired";
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantDonationLog {
  id: string;
  date: string;
  recipientType: "ngo" | "community-kitchen";
  recipientName: string;
  items: string;
  quantity: number;
  unit: string;
  mealsProvided: number;
  co2SavedKg: number;
  notes?: string;
  createdAt: string;
}

export interface RestaurantImpactMetrics {
  id: string;
  wastePreventedKg: number;
  surplusDonationRate: number;
  waterSavedLiters: number;
  co2PreventedKg: number;
  sustainabilityScore: number;
  weeklyTrend: { label: string; value: number }[];
  monthlyTrend: { label: string; value: number }[];
  categoryBreakdown: { category: string; wasteKg: number }[];
  updatedAt: string;
}

export interface StaffTask {
  id: string;
  title: string;
  description: string;
  assignee: string;
  shift: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
}

export interface ShiftScheduleEntry {
  id: string;
  role: string;
  staff: string;
  time: string;
  notes?: string;
}

export interface RestaurantPreferences {
  id: string;
  cuisineType: string;
  operatingHours: string;
  donationPreferences: string[];
  storageCapabilities: string[];
  staffRoles: string[];
  notificationsEnabled: boolean;
  notifyOnPickup: boolean;
  notifyOnExpiry: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NGOCapacitySettings {
  id: string;
  orgName: string;
  location: string;
  geoPoint?: { lat: number; lng: number };
  managerName: string;
  contactPhone: string;
  contactEmail: string;
  preferredFoodTypes: ("cooked" | "raw" | "produce" | "bakery" | "protein")[];
  restrictedItems: string[];
  storageTypes: ("refrigerated" | "frozen" | "dry")[];
  safetyRules: string[];
  policyNotes?: string;
  pickupWindow: { start: string; end: string };
  dailyCapacityKg: number;
  refrigeratedCapacityKg: number;
  dryCapacityKg: number;
  currentUtilizationKg: number;
  xpPoints: number;
  level: number;
  levelProgressPct: number;
  autoAcceptance: {
    allowPork: boolean;
    rejectExpired: boolean;
    temperatureChecks: boolean;
  };
  preferredPickupRadiusKm: number;
  updatedAt: string;
}

export interface NGODonationOffer {
  id: string;
  donorName: string;
  donorType: "building" | "restaurant" | "household" | "kitchen";
  partnerId?: string;
  distanceKm: number;
  locationLabel: string;
  geoPoint?: { lat: number; lng: number };
  offerTitle: string;
  items: {
    name: string;
    quantity: number;
    unit: string;
    type: "cooked" | "raw" | "produce" | "meat" | "dry";
    temperature?: "hot" | "chilled" | "ambient" | "frozen";
  }[];
  weightKg: number;
  mealsEstimated: number;
  freshnessScore: number;
  pickupWindow: { start: string; end: string };
  expiresAt: string;
  urgencyLevel: "low" | "medium" | "high";
  dietaryNotes?: string;
  safetyFlags?: string[];
  contact: {
    name: string;
    phone: string;
    email?: string;
    channel?: "call" | "sms" | "whatsapp";
  };
  images: string[];
  status: "pending" | "accepted" | "declined" | "scheduled" | "completed";
  matchReason: string;
  createdAt: string;
  updatedAt: string;
}

export interface NGOPickupSchedule {
  id: string;
  offerId: string;
  routeId?: string;
  scheduledFor: string;
  etaMinutes: number;
  volunteerName: string;
  volunteerContact: string;
  vehicleType: "van" | "bike" | "car" | "on-foot";
  status: "scheduled" | "en-route" | "picked-up" | "delivered" | "failed";
  checkpoints: {
    label: string;
    timestamp?: string;
    status: "pending" | "completed" | "skipped";
    note?: string;
  }[];
  reminders: {
    time: string;
    type: "info" | "warning";
    delivered: boolean;
  }[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NGODonationHistoryEntry {
  id: string;
  offerId?: string;
  donorName: string;
  donorType: string;
  itemsSummary: string;
  weightKg: number;
  mealsProvided: number;
  co2PreventedKg: number;
  beneficiaries: number;
  pickupTime: string;
  deliveredAt?: string;
  status: "delivered" | "partial" | "redirected" | "cancelled";
  tags: string[];
  photo?: string;
  createdAt: string;
}

export interface NGOPartnerProfile {
  id: string;
  name: string;
  type: "community-kitchen" | "building" | "restaurant" | "ngo";
  location: string;
  distanceKm: number;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  operatingHours: string;
  acceptanceRate: number;
  lastDonationAt: string;
  avgDonationKg: number;
  storageCapabilities: string[];
  notes?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NGOFeedbackEntry {
  id: string;
  recipientName: string;
  partnerName: string;
  deliveryDate: string;
  rating: number;
  comment: string;
  tags: ("quality" | "temperature" | "packaging" | "late" | "positive")[];
  photo?: string;
  status: "pending" | "acknowledged" | "resolved";
  correctiveAction?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NGOImpactStory {
  id: string;
  title: string;
  excerpt: string;
  beneficiaryType: string;
  image?: string;
  metrics: {
    meals: number;
    families: number;
    smiles?: number;
  };
  publishedAt: string;
}

export interface NGONotification {
  id: string;
  type: "urgent-offer" | "pickup" | "volunteer" | "feedback" | "message";
  title: string;
  description: string;
  relatedEntityId?: string;
  severity: "info" | "warning" | "critical";
  read: boolean;
  createdAt: string;
}

export interface ShopInventoryItem {
  id: string;
  name: string;
  category: string;
  barcode: string;
  stockQuantity: number;
  unit: string;
  price: number;
  cost: number;
  expiryDate: string;
  storageType: "frozen" | "chilled" | "ambient";
  shelfLocation?: string;
  imageData?: string;
  markdownStatus: "none" | "scheduled" | "active";
  surplusEligible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShopPriceMapEntry {
  id: string;
  skuId: string;
  skuName: string;
  oldPrice: number;
  newPrice: number;
  method: "percentage" | "fixed";
  changeValue: number;
  effectiveAt: string;
  scheduledBy: string;
  notes?: string;
  createdAt: string;
}

export interface ShopDiscountSuggestion {
  id: string;
  skuId: string;
  skuName: string;
  reason: string;
  suggestedDiscountPct: number;
  predictedSellThrough: number;
  urgency: "low" | "medium" | "high";
  expiresAt: string;
  createdAt: string;
}

export interface ShopSurplusItem {
  id: string;
  skuName: string;
  quantity: number;
  unit: string;
  expiryWindowStart: string;
  expiryWindowEnd: string;
  condition: "fresh" | "near-expiry";
  destinationType?: "ngo" | "community-kitchen";
  destinationName?: string;
  status: "pending" | "picked" | "expired";
  pickupTime?: string;
  reminderSent: boolean;
  imageData?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShopAnalyticsRecord {
  id: string;
  wasteReductionTrend: { label: string; value: number }[];
  markdownRecoveryTrend: { label: string; value: number }[];
  wasteByCategory: { category: string; value: number }[];
  surplusVsSold: { label: string; value: number }[];
  expiredPerDay: { label: string; value: number }[];
  totalCo2Prevented: number;
  mealsDonated: number;
  wasteReductionPercent: number;
  updatedAt: string;
}

export interface ShopStaffMember {
  id: string;
  name: string;
  role: string;
  shift: string;
  contact: string;
  avatar?: string;
  responsibilities: string[];
}

export interface ShopStaffTask {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  due: string;
  completed: boolean;
  category: "expiry" | "pricing" | "surplus" | "cleaning";
  priority: "low" | "medium" | "high";
}

export interface ShopShift {
  id: string;
  staffId: string;
  day: string;
  startTime: string;
  endTime: string;
  station: string;
  notes?: string;
}

export interface ShopProfile {
  id: string;
  storeName: string;
  address: string;
  contactNumber: string;
  managerName: string;
  operatingHours: string;
  notificationPreferences: {
    expiryAlerts: boolean;
    surplusReminders: boolean;
    priceUpdates: boolean;
  };
  donationPreferences: string[];
  categoryPriority: string[];
  barcodePrefix: string;
  updatedAt: string;
}

class FoodFlowDatabase extends Dexie {
  users!: Table<User, string>;
  inventory!: Table<InventoryItem, string>;
  foodItems!: Table<FoodItem, string>;
  logs!: Table<ConsumptionLog, string>;
  resources!: Table<Resource, string>;
  uploads!: Table<Upload, string>;
  mealPlans!: Table<MealPlan, string>;
  shoppingList!: Table<ShoppingListItem, string>;
  badges!: Table<Badge, string>;
  userXP!: Table<UserXP, string>;
  familyPreferences!: Table<FamilyPreferences, string>;
  priceComparisons!: Table<PriceComparison, string>;
  nutritionData!: Table<NutritionData, string>;
  communitySurplusPosts!: Table<CommunitySurplusPost, string>;
  leftoverItems!: Table<LeftoverItem, string>;
  communityKitchenEvents!: Table<CommunityKitchenEvent, string>;
  communityLeaderboard!: Table<CommunityLeaderboard, string>;
  communityImpact!: Table<CommunityImpact, string>;
  notifications!: Table<CommunityNotification, string>;
  communityProfiles!: Table<CommunityProfile, string>;
  restaurantInventory!: Table<RestaurantInventoryItem, string>;
  restaurantMenuItems!: Table<RestaurantMenuItem, string>;
  restaurantSurplus!: Table<RestaurantSurplusItem, string>;
  restaurantDonations!: Table<RestaurantDonationLog, string>;
  restaurantImpact!: Table<RestaurantImpactMetrics, string>;
  restaurantStaffTasks!: Table<StaffTask, string>;
  restaurantShiftSchedule!: Table<ShiftScheduleEntry, string>;
  restaurantPreferences!: Table<RestaurantPreferences, string>;
  ngoCapacity!: Table<NGOCapacitySettings, string>;
  ngoOffers!: Table<NGODonationOffer, string>;
  ngoPickups!: Table<NGOPickupSchedule, string>;
  ngoHistory!: Table<NGODonationHistoryEntry, string>;
  ngoPartners!: Table<NGOPartnerProfile, string>;
  ngoFeedback!: Table<NGOFeedbackEntry, string>;
  ngoImpactStories!: Table<NGOImpactStory, string>;
  ngoNotifications!: Table<NGONotification, string>;
  shopInventory!: Table<ShopInventoryItem, string>;
  shopPriceMap!: Table<ShopPriceMapEntry, string>;
  shopDiscountSuggestions!: Table<ShopDiscountSuggestion, string>;
  shopSurplus!: Table<ShopSurplusItem, string>;
  shopAnalytics!: Table<ShopAnalyticsRecord, string>;
  shopStaff!: Table<ShopStaffMember, string>;
  shopStaffTasks!: Table<ShopStaffTask, string>;
  shopShifts!: Table<ShopShift, string>;
  shopProfile!: Table<ShopProfile, string>;

  constructor() {
    super("FoodFlowDB");
    this.version(1).stores({
      users: "id, email, householdId",
      inventory: "id, userId, category, expiryDate, foodItemId",
      foodItems: "id, category, name",
      logs: "id, userId, inventoryItemId, consumedAt, category",
      resources: "id, category, tags",
      uploads: "id, userId, [userId+associatedType], [userId+associatedId]",
    });
    this.version(2).stores({
      users: "id, email, householdId",
      inventory: "id, userId, category, expiryDate, foodItemId",
      foodItems: "id, category, name",
      logs: "id, userId, inventoryItemId, consumedAt, category",
      resources: "id, category, tags",
      uploads: "id, userId, [userId+associatedType], [userId+associatedId]",
      mealPlans: "id, userId, householdId, date, mealType, [userId+date+mealType]",
      shoppingList: "id, userId, householdId, purchased, category",
      badges: "id, userId, badgeId, unlockedAt, [userId+badgeId]",
      userXP: "id, userId",
      familyPreferences: "id, householdId",
      priceComparisons: "id, itemName, category",
    });
    this.version(3).stores({
      users: "id, email, householdId, [email]", // Added email index for faster lookups
      inventory: "id, userId, category, expiryDate, foodItemId",
      foodItems: "id, category, name",
      logs: "id, userId, inventoryItemId, consumedAt, category",
      resources: "id, category, tags",
      uploads: "id, userId, [userId+associatedType], [userId+associatedId]",
      mealPlans: "id, userId, householdId, date, mealType, [userId+date+mealType]",
      shoppingList: "id, userId, householdId, purchased, category",
      badges: "id, userId, badgeId, unlockedAt, [userId+badgeId]",
      userXP: "id, userId",
      familyPreferences: "id, householdId",
      priceComparisons: "id, itemName, category",
      nutritionData: "id, userId, date, [userId+date]",
    });
    this.version(4).stores({
      users: "id, email, householdId, [email]",
      inventory: "id, userId, category, expiryDate, foodItemId",
      foodItems: "id, category, name",
      logs: "id, userId, inventoryItemId, consumedAt, category",
      resources: "id, category, tags",
      uploads: "id, userId, [userId+associatedType], [userId+associatedId]",
      mealPlans: "id, userId, householdId, date, mealType, [userId+date+mealType]",
      shoppingList: "id, userId, householdId, purchased, category",
      badges: "id, userId, badgeId, unlockedAt, [userId+badgeId]",
      userXP: "id, userId",
      familyPreferences: "id, householdId",
      priceComparisons: "id, itemName, category",
      nutritionData: "id, userId, date, [userId+date]",
      communitySurplusPosts: "id, userId, status, category, createdAt",
      leftoverItems: "id, userId, status, createdAt",
      communityKitchenEvents: "id, status, date",
      communityLeaderboard: "id, type",
      communityImpact: "id",
      notifications: "id, userId, type, read",
      communityProfiles: "id, userId, username",
    });
    this.version(5).stores({
      users: "id, email, householdId, [email]",
      inventory: "id, userId, category, expiryDate, foodItemId",
      foodItems: "id, category, name",
      logs: "id, userId, inventoryItemId, consumedAt, category",
      resources: "id, category, tags",
      uploads: "id, userId, [userId+associatedType], [userId+associatedId]",
      mealPlans: "id, userId, householdId, date, mealType, [userId+date+mealType]",
      shoppingList: "id, userId, householdId, purchased, category",
      badges: "id, userId, badgeId, unlockedAt, [userId+badgeId]",
      userXP: "id, userId",
      familyPreferences: "id, householdId",
      priceComparisons: "id, itemName, category",
      nutritionData: "id, userId, date, [userId+date]",
      communitySurplusPosts: "id, userId, status, category, createdAt",
      leftoverItems: "id, userId, status, createdAt",
      communityKitchenEvents: "id, status, date",
      communityLeaderboard: "id, type",
      communityImpact: "id",
      notifications: "id, userId, type, read",
      communityProfiles: "id, userId, username",
      restaurantInventory: "id, category, status, expiryDate",
      restaurantMenuItems: "id, category, predictedWasteScore",
      restaurantSurplus: "id, status, category, assignedTo",
      restaurantDonations: "id, date, recipientType",
      restaurantImpact: "id",
      restaurantStaffTasks: "id, assignee, completed",
      restaurantShiftSchedule: "id, role",
      restaurantPreferences: "id",
    });
    this.version(6).stores({
      users: "id, email, householdId, [email]",
      inventory: "id, userId, category, expiryDate, foodItemId",
      foodItems: "id, category, name",
      logs: "id, userId, inventoryItemId, consumedAt, category",
      resources: "id, category, tags",
      uploads: "id, userId, [userId+associatedType], [userId+associatedId]",
      mealPlans: "id, userId, householdId, date, mealType, [userId+date+mealType]",
      shoppingList: "id, userId, householdId, purchased, category",
      badges: "id, userId, badgeId, unlockedAt, [userId+badgeId]",
      userXP: "id, userId",
      familyPreferences: "id, householdId",
      priceComparisons: "id, itemName, category",
      nutritionData: "id, userId, date, [userId+date]",
      communitySurplusPosts: "id, userId, status, category, createdAt",
      leftoverItems: "id, userId, status, createdAt",
      communityKitchenEvents: "id, status, date",
      communityLeaderboard: "id, type",
      communityImpact: "id",
      notifications: "id, userId, type, read",
      communityProfiles: "id, userId, username",
      restaurantInventory: "id, category, status, expiryDate",
      restaurantMenuItems: "id, category, predictedWasteScore",
      restaurantSurplus: "id, status, category, assignedTo",
      restaurantDonations: "id, date, recipientType",
      restaurantImpact: "id",
      restaurantStaffTasks: "id, assignee, completed",
      restaurantShiftSchedule: "id, role",
      restaurantPreferences: "id",
      ngoCapacity: "id",
      ngoOffers: "id, status, urgencyLevel, expiresAt",
      ngoPickups: "id, offerId, scheduledFor, status",
      ngoHistory: "id, status, pickupTime",
      ngoPartners: "id, type, name",
      ngoFeedback: "id, status, deliveryDate",
      ngoImpactStories: "id, publishedAt",
      ngoNotifications: "id, type, severity, read",
    });
    this.version(7).stores({
      users: "id, email, householdId, [email]",
      inventory: "id, userId, category, expiryDate, foodItemId",
      foodItems: "id, category, name",
      logs: "id, userId, inventoryItemId, consumedAt, category",
      resources: "id, category, tags",
      uploads: "id, userId, [userId+associatedType], [userId+associatedId]",
      mealPlans: "id, userId, householdId, date, mealType, [userId+date+mealType]",
      shoppingList: "id, userId, householdId, purchased, category",
      badges: "id, userId, badgeId, unlockedAt, [userId+badgeId]",
      userXP: "id, userId",
      familyPreferences: "id, householdId",
      priceComparisons: "id, itemName, category",
      nutritionData: "id, userId, date, [userId+date]",
      communitySurplusPosts: "id, userId, status, category, createdAt",
      leftoverItems: "id, userId, status, createdAt",
      communityKitchenEvents: "id, status, date",
      communityLeaderboard: "id, type",
      communityImpact: "id",
      notifications: "id, userId, type, read",
      communityProfiles: "id, userId, username",
      restaurantInventory: "id, category, status, expiryDate",
      restaurantMenuItems: "id, category, predictedWasteScore",
      restaurantSurplus: "id, status, category, assignedTo",
      restaurantDonations: "id, date, recipientType",
      restaurantImpact: "id",
      restaurantStaffTasks: "id, assignee, completed",
      restaurantShiftSchedule: "id, role",
      restaurantPreferences: "id",
      ngoCapacity: "id",
      ngoOffers: "id, status, urgencyLevel, expiresAt",
      ngoPickups: "id, offerId, scheduledFor, status",
      ngoHistory: "id, status, pickupTime",
      ngoPartners: "id, type, name",
      ngoFeedback: "id, status, deliveryDate",
      ngoImpactStories: "id, publishedAt",
      ngoNotifications: "id, type, severity, read",
      shopInventory: "id, category, barcode, expiryDate",
      shopPriceMap: "id, skuId, effectiveAt",
      shopDiscountSuggestions: "id, skuId, expiresAt",
      shopSurplus: "id, status, destinationType",
      shopAnalytics: "id",
      shopStaff: "id, role",
      shopStaffTasks: "id, assigneeId, category",
      shopShifts: "id, staffId, day",
      shopProfile: "id",
    });

    this.restaurantInventory = this.table("restaurantInventory");
    this.restaurantMenuItems = this.table("restaurantMenuItems");
    this.restaurantSurplus = this.table("restaurantSurplus");
    this.restaurantDonations = this.table("restaurantDonations");
    this.restaurantImpact = this.table("restaurantImpact");
    this.restaurantStaffTasks = this.table("restaurantStaffTasks");
    this.restaurantShiftSchedule = this.table("restaurantShiftSchedule");
    this.restaurantPreferences = this.table("restaurantPreferences");
    this.ngoCapacity = this.table("ngoCapacity");
    this.ngoOffers = this.table("ngoOffers");
    this.ngoPickups = this.table("ngoPickups");
    this.ngoHistory = this.table("ngoHistory");
    this.ngoPartners = this.table("ngoPartners");
    this.ngoFeedback = this.table("ngoFeedback");
    this.ngoImpactStories = this.table("ngoImpactStories");
    this.ngoNotifications = this.table("ngoNotifications");
    this.shopInventory = this.table("shopInventory");
    this.shopPriceMap = this.table("shopPriceMap");
    this.shopDiscountSuggestions = this.table("shopDiscountSuggestions");
    this.shopSurplus = this.table("shopSurplus");
    this.shopAnalytics = this.table("shopAnalytics");
    this.shopStaff = this.table("shopStaff");
    this.shopStaffTasks = this.table("shopStaffTasks");
    this.shopShifts = this.table("shopShifts");
    this.shopProfile = this.table("shopProfile");
  }
}

let dbInstance: FoodFlowDatabase | null = null;

/**
 * Get database instance (lazy initialization, client-side only)
 */
export function getDb(): FoodFlowDatabase {
  if (typeof window === "undefined") {
    throw new Error("Database can only be accessed on the client side");
  }
  
  if (!dbInstance) {
    dbInstance = new FoodFlowDatabase();
  }
  
  return dbInstance;
}

/**
 * Database instance - lazy loaded, client-side only
 * This is a getter that returns the database instance
 */
export const db = {
  get users() {
    return getDb().users;
  },
  get inventory() {
    return getDb().inventory;
  },
  get foodItems() {
    return getDb().foodItems;
  },
  get logs() {
    return getDb().logs;
  },
  get resources() {
    return getDb().resources;
  },
  get uploads() {
    return getDb().uploads;
  },
  get mealPlans() {
    return getDb().mealPlans;
  },
  get shoppingList() {
    return getDb().shoppingList;
  },
  get badges() {
    return getDb().badges;
  },
  get userXP() {
    return getDb().userXP;
  },
  get familyPreferences() {
    return getDb().familyPreferences;
  },
  get priceComparisons() {
    return getDb().priceComparisons;
  },
  get nutritionData() {
    return getDb().nutritionData;
  },
  get communitySurplusPosts() {
    return getDb().communitySurplusPosts;
  },
  get leftoverItems() {
    return getDb().leftoverItems;
  },
  get communityKitchenEvents() {
    return getDb().communityKitchenEvents;
  },
  get communityLeaderboard() {
    return getDb().communityLeaderboard;
  },
  get communityImpact() {
    return getDb().communityImpact;
  },
  get notifications() {
    return getDb().notifications;
  },
  get communityProfiles() {
    return getDb().communityProfiles;
  },
  get restaurantInventory() {
    return getDb().restaurantInventory;
  },
  get restaurantMenuItems() {
    return getDb().restaurantMenuItems;
  },
  get restaurantSurplus() {
    return getDb().restaurantSurplus;
  },
  get restaurantDonations() {
    return getDb().restaurantDonations;
  },
  get restaurantImpact() {
    return getDb().restaurantImpact;
  },
  get restaurantStaffTasks() {
    return getDb().restaurantStaffTasks;
  },
  get restaurantShiftSchedule() {
    return getDb().restaurantShiftSchedule;
  },
  get restaurantPreferences() {
    return getDb().restaurantPreferences;
  },
  get ngoCapacity() {
    return getDb().ngoCapacity;
  },
  get ngoOffers() {
    return getDb().ngoOffers;
  },
  get ngoPickups() {
    return getDb().ngoPickups;
  },
  get ngoHistory() {
    return getDb().ngoHistory;
  },
  get ngoPartners() {
    return getDb().ngoPartners;
  },
  get ngoFeedback() {
    return getDb().ngoFeedback;
  },
  get ngoImpactStories() {
    return getDb().ngoImpactStories;
  },
  get ngoNotifications() {
    return getDb().ngoNotifications;
  },
  get shopInventory() {
    return getDb().shopInventory;
  },
  get shopPriceMap() {
    return getDb().shopPriceMap;
  },
  get shopDiscountSuggestions() {
    return getDb().shopDiscountSuggestions;
  },
  get shopSurplus() {
    return getDb().shopSurplus;
  },
  get shopAnalytics() {
    return getDb().shopAnalytics;
  },
  get shopStaff() {
    return getDb().shopStaff;
  },
  get shopStaffTasks() {
    return getDb().shopStaffTasks;
  },
  get shopShifts() {
    return getDb().shopShifts;
  },
  get shopProfile() {
    return getDb().shopProfile;
  },
} as FoodFlowDatabase;

