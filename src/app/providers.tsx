"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState, useEffect } from "react";
import { initializeDatabase } from "@/lib/server";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
          },
        },
      })
  );

  // Initialize database and set up helper functions
  // Defer heavy operations to not block initial render
  useEffect(() => {
    // Initialize database immediately but don't wait for heavy operations
    const initDb = async () => {
      try {
        // Initialize database (lightweight operation)
        await initializeDatabase();
        
        // Set up window helper functions for console debugging
        const setupHelpers = async () => {
          const { seedUserData, resetUserSeedData } = await import("@/lib/server/seed");
          const { db } = await import("@/lib/server");
          const { getCurrentUser } = await import("@/lib/server");
          
          // Force seed current user
          (window as any).seedUserData = async () => {
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
              await seedUserData(user.id, user.householdId, true);
              console.log("✅ Data seeded successfully! Refreshing page...");
              setTimeout(() => window.location.reload(), 1000);
            } catch (error) {
              console.error("Error seeding data:", error);
            }
          };
          
          // Reset and re-seed current user
          (window as any).resetUserData = async () => {
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
              console.log("✅ Data reset and seeded successfully! Refreshing page...");
              setTimeout(() => window.location.reload(), 1000);
            } catch (error) {
              console.error("Error resetting data:", error);
            }
          };
          
          // Check data counts
          (window as any).checkDataCounts = async () => {
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
          };
          
          console.log("🔧 Seed helper functions available:");
          console.log("  - window.seedUserData() - Force seed data for current user");
          console.log("  - window.resetUserData() - Reset and re-seed current user data");
          console.log("  - window.checkDataCounts() - Check data counts");
        };
        
        // Set up helpers immediately (lightweight)
        await setupHelpers();
      } catch (error) {
        console.error("Failed to initialize database:", error);
      }
    };

    // Defer heavy data checking and seeding operations
    const checkAndSeedData = async () => {
      try {
        const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
        if (token) {
          const { getCurrentUser } = await import("@/lib/server");
          const { seedUserData } = await import("@/lib/server/seed");
          
          const user = await getCurrentUser(token);
          if (user) {
            // Check if user has data, if not, seed it
            const { db } = await import("@/lib/server");
            const inventoryCount = await db.inventory.where("userId").equals(user.id).count();
            const logsCount = await db.logs.where("userId").equals(user.id).count();
            const mealPlansCount = await db.mealPlans.where("userId").equals(user.id).count();
            const shoppingListCount = await db.shoppingList.where("userId").equals(user.id).count();
            
            // Check nutrition data count
            const nutritionCount = await db.nutritionData.where("userId").equals(user.id).count();
            
            // Check if any critical data is missing
            const hasNoData = inventoryCount === 0 && logsCount === 0 && mealPlansCount === 0 && shoppingListCount === 0 && nutritionCount === 0;
            const hasMissingData = inventoryCount === 0 || logsCount === 0 || mealPlansCount === 0 || shoppingListCount === 0 || nutritionCount === 0;
            
            if (hasNoData) {
              console.log("📦 No demo data found for user, seeding comprehensive demo data...");
              console.log("   This includes:");
              console.log("   - 24 inventory items");
              console.log("   - 50+ consumption logs");
              console.log("   - 14 days of meal plans");
              console.log("   - 17 shopping list items");
              console.log("   - 7 days of nutrition data");
              console.log("   - Badges and XP");
              console.log("   - Family preferences");
              
              try {
                await seedUserData(user.id, user.householdId, false);
                console.log("✅ Demo data seeded successfully!");
                console.log("   Refresh the page to see your data.");
                
                // Invalidate queries to refresh the UI
                queryClient.invalidateQueries();
                
                // Show a brief notification
                if (typeof window !== "undefined") {
                  setTimeout(() => {
                    alert("Demo data has been loaded! The page will refresh to show your data.");
                    window.location.reload();
                  }, 500);
                }
              } catch (error) {
                console.error("❌ Error seeding demo data:", error);
                console.error("   You can manually seed by running: window.seedUserData()");
              }
            } else if (hasMissingData) {
              console.log("⚠️ User has partial data. Seeding missing data...");
              console.log(`   Current data:`);
              console.log(`   - ${inventoryCount} inventory items ${inventoryCount === 0 ? "❌" : "✓"}`);
              console.log(`   - ${logsCount} consumption logs ${logsCount === 0 ? "❌" : "✓"}`);
              console.log(`   - ${mealPlansCount} meal plans ${mealPlansCount === 0 ? "❌" : "✓"}`);
              console.log(`   - ${shoppingListCount} shopping list items ${shoppingListCount === 0 ? "❌" : "✓"}`);
              console.log(`   - ${nutritionCount} days of nutrition data ${nutritionCount === 0 ? "❌" : "✓"}`);
              
              try {
                await seedUserData(user.id, user.householdId, false);
                console.log("✅ Missing data seeded successfully!");
                
                // Invalidate queries to refresh the UI
                queryClient.invalidateQueries();
                
                // Show a brief notification
                if (typeof window !== "undefined") {
                  setTimeout(() => {
                    alert("Missing demo data has been loaded! The page will refresh.");
                    window.location.reload();
                  }, 500);
                }
              } catch (error) {
                console.error("❌ Error seeding missing data:", error);
                console.error("   You can manually seed by running: window.seedUserData()");
              }
            } else {
              console.log("✅ User already has complete data:");
              console.log(`   - ${inventoryCount} inventory items`);
              console.log(`   - ${logsCount} consumption logs`);
              console.log(`   - ${mealPlansCount} meal plans`);
              console.log(`   - ${shoppingListCount} shopping list items`);
              console.log(`   - ${nutritionCount} days of nutrition data`);
            }
          }
        } else {
          console.log("ℹ️ No user logged in. Demo data will be seeded after login.");
        }
      } catch (error) {
        console.error("Failed to check and seed data:", error);
      }
    };

    if (typeof window !== "undefined") {
      // Initialize database immediately (non-blocking)
      initDb().catch((error) => {
        console.error("Failed to initialize database:", error);
      });

      // Defer heavy data operations using requestIdleCallback or setTimeout
      // This allows the UI to render first
      if (typeof window.requestIdleCallback !== "undefined") {
        window.requestIdleCallback(() => {
          checkAndSeedData().catch((error) => {
            console.error("Failed to check and seed data:", error);
          });
        }, { timeout: 2000 });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => {
          checkAndSeedData().catch((error) => {
            console.error("Failed to check and seed data:", error);
          });
        }, 100);
      }
    }
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
}

