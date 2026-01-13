/**
 * Server-side API layer for FoodFlow
 * 
 * This module provides a complete client-side backend simulation
 * using IndexedDB via Dexie. All functions are async and include
 * artificial delays to simulate network latency.
 */

// Database
export { db } from "./db";
export type {
  User,
  InventoryItem,
  FoodItem,
  ConsumptionLog,
  Resource,
  Upload,
  MealPlan,
  ShoppingListItem,
  Badge,
  UserXP,
  FamilyPreferences,
  PriceComparison,
  NutritionData,
  NGOCapacitySettings,
  NGODonationOffer,
  NGOPickupSchedule,
  NGODonationHistoryEntry,
  NGOPartnerProfile,
  NGOFeedbackEntry,
  NGOImpactStory,
  NGONotification,
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

// Auth
export {
  login,
  register,
  getCurrentUser,
  verifyToken,
} from "./auth.server";
export type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from "./auth.server";

// Users
export {
  getUserById,
  getUserProfile,
  updateUserProfile,
  getHouseholdMembers,
} from "./users.server";
export type {
  UserProfile,
  UpdateUserData,
} from "./users.server";

// Inventory
export {
  createInventoryItem,
  getInventoryItems,
  getInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getFoodItems,
  searchFoodItems,
  getExpiringSoon,
} from "./inventory.server";
export type {
  CreateInventoryItemInput,
  UpdateInventoryItemInput,
  InventoryItemResponse,
  InventoryFilter,
} from "./inventory.server";

// Logs
export {
  createLog,
  getLogs,
  getRecentLogs,
  getLog,
  updateLog,
  deleteLog,
  getWasteStats,
  getWasteAnalytics,
} from "./logs.server";
export type {
  CreateLogInput,
  UpdateLogInput,
  LogFilter,
  WasteStats,
  WasteAnalyticsData,
} from "./logs.server";

// Resources
export {
  getResources,
  getResourcesByTags,
  getRecommendedResources,
  getResourcesByCategory,
  searchResources,
  getResource,
} from "./resources.server";
export type {
  ResourceRecommendation,
  RecommendationContext,
} from "./resources.server";

// Uploads
export {
  uploadFile,
  getUploadMetadata,
  getUploadData,
  getUploadUrl,
  getUserUploads,
  getAssociatedUploads,
  deleteUpload,
  updateUploadAssociation,
} from "./uploads.server";
export type {
  UploadFileInput,
  UploadMetadata,
} from "./uploads.server";

// Meal Planner
export {
  getWeeklyMeals,
  updateMealSlot,
  deleteMealSlot,
} from "./mealplanner.server";
export type {
  CreateMealPlanInput,
  UpdateMealPlanInput,
  WeeklyMealPlan,
} from "./mealplanner.server";

// Shopping List
export {
  getShoppingList,
  computeMissingItems,
  addShoppingItem,
  updateShoppingItem,
  deleteShoppingItem,
  getPriceComparisons,
} from "./shopping.server";
export type {
  CreateShoppingItemInput,
  UpdateShoppingItemInput,
} from "./shopping.server";

// Impact & Analytics
export {
  getImpactMetrics,
  getFamilyGreenScore,
  getImpactTrends,
  addXP,
} from "./impact.server";
export type {
  ImpactMetrics,
  ImpactTrend,
} from "./impact.server";

// Badges
export {
  getUnlockedBadges,
  getNextBadges,
  unlockBadge,
  checkAndUnlockBadges,
  BADGE_DEFINITIONS,
} from "./badges.server";
export type {
  BadgeDefinition,
} from "./badges.server";

// Family Preferences
export {
  getFamilyPreferences,
  updateFamilyPreferences,
} from "./family.server";
export type {
  UpdateFamilyPreferencesInput,
} from "./family.server";

// Nutrition
export {
  getDailyNutrition,
  getWeeklyNutrition,
  getNutritionWarnings,
  getNutritionSuggestions,
  getNutritionScore,
  getHealthyPlateStatus,
  getWeeklyNutritionScores,
  getNutritionBadges,
} from "./nutrition.server";
export type {
  DailyNutrition,
  NutritionWarning,
  NutritionSuggestion,
  HealthyPlateStatus,
  WeeklyNutritionScore,
} from "./nutrition.server";

// Bulk Buy Opportunities
export {
  getBulkBuyOpportunities,
  joinBulkBuy,
} from "./bulkbuy.server";
export type {
  BulkBuyOpportunity,
} from "./bulkbuy.server";

// NGO services
export {
  getOffers,
  addOffer,
  updateOfferStatus,
  getOfferDetail,
} from "./ngo.offers.server";
export type { OfferQuery, AddOfferInput, UpdateOfferStatusInput } from "./ngo.offers.server";

export {
  getCapacity,
  setCapacity,
  checkCapacityForOffer,
} from "./ngo.capacity.server";

export {
  getPickups,
  schedulePickup,
  updatePickupStatus,
  estimateRoute,
} from "./ngo.pickups.server";

export {
  getDonationHistory,
  exportHistoryCSV,
} from "./ngo.history.server";
export type { HistoryFilters, DonationHistoryResponse } from "./ngo.history.server";

export {
  getPartners,
  addPartner,
  updatePartner,
} from "./ngo.partners.server";

export {
  getFeedbackQueue,
  resolveFeedback,
} from "./ngo.feedback.server";

export {
  getNgoNotifications,
  markNotificationRead,
  clearNotifications,
} from "./ngo.notifications.server";

export {
  getNgoImpactInsights,
} from "./ngo.reports.server";

// Shop services
export {
  getInventory as getShopInventory,
  addSKU,
  updateSKU,
  deleteSKU,
  getExpiringItems,
  getMarkdownCandidates,
} from "./shop.inventory.server";
export {
  getPriceMap,
  updatePrice,
  generateDiscountSuggestions,
} from "./shop.pricing.server";
export {
  getSurplusQueue,
  addSurplusItem,
  assignSurplusToNGO,
  updateSurplusStatus,
} from "./shop.surplus.server";
export {
  getWasteTrends,
  getMarkdownRecovery,
  getCategoryWasteBreakdown,
  getRetailImpactKPIs,
} from "./shop.analytics.server";
export {
  getStaff,
  getStaffTasks,
  addTask,
  toggleTask,
  getShifts,
  updateShift,
} from "./shop.staff.server";
export {
  getShopProfile,
  updateShopProfile,
} from "./shop.profile.server";

// Database initialization
export {
  initializeDatabase,
  seedDatabase,
  seedUserData,
  resetUserSeedData,
  isSeeded,
  resetSeedData,
} from "./seed";

// Helpers
export {
  hashPassword,
  verifyPassword,
  generateToken,
  decodeToken,
  generateId,
  getTimestamp,
  delay,
  calculateExpiryDate,
  isExpiringSoon,
  isExpired,
  fileToBase64,
  formatFileSize,
} from "./helpers";

