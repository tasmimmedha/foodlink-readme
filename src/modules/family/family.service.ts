import { apiGet } from "@/lib/api-client";

export interface InventorySummary {
  totalItems: number;
  expiringSoon: number;
  expired: number;
  expiringItems: Array<{
    id: string;
    name: string;
    quantity: number;
    unit?: string;
    expiryDate: string;
    daysUntilExpiry: number;
  }>;
}

export interface WasteAnalytics {
  wastePrevented: number; // kg
  leftoverUsage: number; // percentage
  monthlyFoodUsageScore: number; // 0-100
  wasteLogs: Array<{
    date: string;
    wasted: number;
    used: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    waste: number;
    usage: number;
  }>;
}

export interface MealPlan {
  week: string;
  meals: Array<{
    day: string;
    date: string;
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  }>;
}

export interface SmartShoppingList {
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    unit?: string;
    category?: string;
    priority: "low" | "medium" | "high";
    estimatedPrice?: number;
    stores: Array<{
      name: string;
      price: number;
    }>;
  }>;
  totalEstimatedCost: number;
  bestStore: string;
  savings: number;
}

export interface BulkBuyOpportunity {
  id: string;
  itemName: string;
  currentPrice: number;
  bulkPrice: number;
  savings: number;
  savingsPercentage: number;
  participants: number;
  maxParticipants: number;
  deadline: string;
  participantsPreview: Array<{
    name: string;
    avatar?: string;
  }>;
}

export interface EnvironmentalImpact {
  co2Prevented: number; // kg
  wasteReduced: number; // kg
  waterSaved: number; // liters
  xpPoints: number;
  level: number;
  xpProgress: number; // 0-100
}

export interface FamilyPreferences {
  householdSize: number;
  weeklyBudget: number;
  dietaryRestrictions: string[];
  allergies: string[];
  preferredCuisines: string[];
  mealPrepDays: string[];
}

export interface FamilyDashboardData {
  inventorySummary: InventorySummary;
  wasteAnalytics: WasteAnalytics;
  mealPlan: MealPlan;
  smartShoppingList: SmartShoppingList;
  bulkBuyOpportunities: BulkBuyOpportunity[];
  environmentalImpact: EnvironmentalImpact;
  familyPreferences: FamilyPreferences;
}

export async function getFamilyDashboardData(): Promise<FamilyDashboardData> {
  return apiGet<FamilyDashboardData>("/family/dashboard");
}

export async function getInventorySummary(): Promise<InventorySummary> {
  return apiGet<InventorySummary>("/family/inventory-summary");
}

export async function getWasteAnalytics(): Promise<WasteAnalytics> {
  return apiGet<WasteAnalytics>("/family/waste-analytics");
}

export async function getMealPlan(): Promise<MealPlan> {
  return apiGet<MealPlan>("/family/meal-plan");
}

export async function getSmartShoppingList(): Promise<SmartShoppingList> {
  return apiGet<SmartShoppingList>("/family/smart-shopping-list");
}

export async function getBulkBuyOpportunities(): Promise<BulkBuyOpportunity[]> {
  return apiGet<BulkBuyOpportunity[]>("/family/bulk-buy-opportunities");
}

export async function getEnvironmentalImpact(): Promise<EnvironmentalImpact> {
  return apiGet<EnvironmentalImpact>("/family/environmental-impact");
}

export async function getFamilyPreferences(): Promise<FamilyPreferences> {
  return apiGet<FamilyPreferences>("/family/preferences");
}

