/**
 * Helper functions to manage seed data
 * Can be called from browser console for debugging
 */

import { resetSeedData, seedUserData, resetUserSeedData } from "./seed";
import { db } from "./db";
import { getCurrentUser } from "./auth.server";

/**
 * Force re-seed all data for current user
 * Call this from browser console: window.seedUserData()
 */
export async function forceSeedCurrentUser(): Promise<void> {
  if (typeof window === "undefined") {
    console.error("This function can only be called from the browser");
    return;
  }

  const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
  if (!token) {
    console.error("No auth token found. Please log in first.");
    return;
  }

  try {
    const user = await getCurrentUser(token);
    if (!user) {
      console.error("User not found. Please log in first.");
      return;
    }

    console.log("Seeding data for user:", user.email);
    await seedUserData(user.id, user.householdId, true); // Force seed
    console.log("✅ Data seeded successfully!");
    
    // Refresh the page to see the data
    console.log("Refreshing page in 2 seconds...");
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

/**
 * Reset and re-seed data for current user
 * Call this from browser console: window.resetUserData()
 */
export async function resetCurrentUserData(): Promise<void> {
  if (typeof window === "undefined") {
    console.error("This function can only be called from the browser");
    return;
  }

  const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
  if (!token) {
    console.error("No auth token found. Please log in first.");
    return;
  }

  try {
    const user = await getCurrentUser(token);
    if (!user) {
      console.error("User not found. Please log in first.");
      return;
    }

    console.log("Resetting and seeding data for user:", user.email);
    await resetUserSeedData(user.id, user.householdId);
    console.log("✅ Data reset and seeded successfully!");
    
    // Refresh the page to see the data
    console.log("Refreshing page in 2 seconds...");
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  } catch (error) {
    console.error("Error resetting data:", error);
  }
}

/**
 * Reset and re-seed all data
 * Call this from browser console: window.resetAllData()
 */
export async function resetAllData(): Promise<void> {
  if (typeof window === "undefined") {
    console.error("This function can only be called from the browser");
    return;
  }

  try {
    console.log("Resetting all seed data...");
    await resetSeedData();
    console.log("✅ Data reset and re-seeded successfully!");
  } catch (error) {
    console.error("Error resetting data:", error);
  }
}

/**
 * Check current data counts
 * Call this from browser console: window.checkDataCounts()
 */
export async function checkDataCounts(): Promise<void> {
  if (typeof window === "undefined") {
    console.error("This function can only be called from the browser");
    return;
  }

  const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
  if (!token) {
    console.error("No auth token found. Please log in first.");
    return;
  }

  try {
    const user = await getCurrentUser(token);
    if (!user) {
      console.error("User not found. Please log in first.");
      return;
    }

    const counts = {
      inventory: await db.inventory.where("userId").equals(user.id).count(),
      logs: await db.logs.where("userId").equals(user.id).count(),
      mealPlans: await db.mealPlans.where("userId").equals(user.id).count(),
      shoppingList: await db.shoppingList.where("userId").equals(user.id).count(),
      badges: await db.badges.where("userId").equals(user.id).count(),
      userXP: await db.userXP.where("userId").equals(user.id).count(),
    };

    console.log("Data counts for user:", user.email);
    console.table(counts);
    
    if (counts.inventory === 0 && counts.logs === 0) {
      console.warn("⚠️ No data found! Run window.seedUserData() to populate demo data.");
    }
  } catch (error) {
    console.error("Error checking data counts:", error);
  }
}

// Make functions available globally in development
if (typeof window !== "undefined") {
  (window as any).seedUserData = forceSeedCurrentUser;
  (window as any).resetUserData = resetCurrentUserData;
  (window as any).resetAllData = resetAllData;
  (window as any).checkDataCounts = checkDataCounts;
  
  console.log("🔧 Seed helper functions available:");
  console.log("  - window.seedUserData() - Force seed data for current user");
  console.log("  - window.resetUserData() - Reset and re-seed current user data");
  console.log("  - window.resetAllData() - Reset all data");
  console.log("  - window.checkDataCounts() - Check data counts");
}

