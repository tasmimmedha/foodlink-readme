import { db, Resource } from "./db";
import { delay, isExpiringSoon } from "./helpers";
import { getCurrentUser } from "./auth.server";
import { getInventoryItems } from "./inventory.server";

export interface ResourceRecommendation extends Resource {
  reason: string;
  relevanceScore: number;
}

export interface RecommendationContext {
  category?: string;
  hasExpiringItems?: boolean;
  expiringCategories?: string[];
}

/**
 * Get all resources
 */
export async function getResources(category?: string): Promise<Resource[]> {
  await delay(100);

  if (category) {
    return db.resources.where("category").equals(category).toArray();
  }
  return db.resources.toArray();
}

/**
 * Get resources by tags
 */
export async function getResourcesByTags(tags: string[]): Promise<Resource[]> {
  await delay(100);

  const allResources = await db.resources.toArray();
  return allResources.filter((resource) =>
    tags.some((tag) => resource.tags.includes(tag))
  );
}

/**
 * Get recommended resources based on user's inventory and context
 */
export async function getRecommendedResources(
  token: string,
  context?: RecommendationContext
): Promise<ResourceRecommendation[]> {
  await delay(200);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  // Get user's inventory to understand their context
  const inventory = await getInventoryItems(token);
  const allResources = await db.resources.toArray();

  // Build recommendation context from inventory
  const inventoryContext: RecommendationContext = {
    ...context,
    expiringCategories: [],
    hasExpiringItems: false,
  };

  // Check for expiring items
  const expiringItems = inventory.filter(
    (item) => item.expiryDate && isExpiringSoon(item.expiryDate)
  );

  if (expiringItems.length > 0) {
    inventoryContext.hasExpiringItems = true;
    inventoryContext.expiringCategories = [
      ...new Set(expiringItems.map((item) => item.category).filter(Boolean) as string[]),
    ];
  }

  // If category is provided in context, use it
  if (context?.category) {
    inventoryContext.category = context.category;
  } else if (inventoryContext.expiringCategories && inventoryContext.expiringCategories.length > 0) {
    // Use the most common expiring category
    inventoryContext.category = inventoryContext.expiringCategories[0];
  }

  // Rule-based recommendation logic
  const recommendations: ResourceRecommendation[] = [];

  for (const resource of allResources) {
    let relevanceScore = 0;
    let reason = "";

    // Rule 1: Category match
    if (inventoryContext.category && resource.category === inventoryContext.category) {
      relevanceScore += 50;
      reason = `Recommended because you have ${inventoryContext.category} items in your inventory.`;
    }

    // Rule 2: Dairy category specific
    if (inventoryContext.category === "dairy" && resource.category === "dairy") {
      relevanceScore += 30;
      if (!reason) {
        reason = "Recommended for dairy products in your inventory.";
      }
    }

    // Rule 3: Expiring vegetables
    if (
      inventoryContext.hasExpiringItems &&
      inventoryContext.expiringCategories?.includes("vegetables") &&
      (resource.tags.includes("vegetables") ||
        resource.tags.includes("meal-planning") ||
        resource.tags.includes("storage"))
    ) {
      relevanceScore += 40;
      if (!reason) {
        reason = "Recommended because you have vegetables expiring soon. Check out meal planning and storage tips.";
      }
    }

    // Rule 4: General waste reduction for any expiring items
    if (inventoryContext.hasExpiringItems && resource.tags.includes("waste-reduction")) {
      relevanceScore += 25;
      if (!reason) {
        reason = "Recommended to help reduce waste from items expiring soon.";
      }
    }

    // Rule 5: Storage tips for specific categories
    if (
      inventoryContext.category &&
      resource.tags.includes("storage") &&
      resource.category === inventoryContext.category
    ) {
      relevanceScore += 35;
      if (!reason) {
        reason = `Storage tips for ${inventoryContext.category} items.`;
      }
    }

    // Rule 6: Meal planning for expiring items
    if (
      inventoryContext.hasExpiringItems &&
      resource.tags.includes("meal-planning")
    ) {
      relevanceScore += 30;
      if (!reason) {
        reason = "Meal planning tips to use items before they expire.";
      }
    }

    // Rule 7: General sustainability resources
    if (resource.category === "general" && resource.tags.includes("sustainability")) {
      relevanceScore += 10;
      if (!reason) {
        reason = "General sustainability resource.";
      }
    }

    // Only include resources with some relevance
    if (relevanceScore > 0) {
      recommendations.push({
        ...resource,
        reason: reason || "Recommended based on your inventory.",
        relevanceScore,
      });
    }
  }

  // Sort by relevance score (highest first)
  recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Return top 10 recommendations
  return recommendations.slice(0, 10);
}

/**
 * Get resources by category
 */
export async function getResourcesByCategory(category: string): Promise<Resource[]> {
  await delay(100);
  return db.resources.where("category").equals(category).toArray();
}

/**
 * Search resources
 */
export async function searchResources(query: string): Promise<Resource[]> {
  await delay(100);

  const allResources = await db.resources.toArray();
  const queryLower = query.toLowerCase();

  return allResources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(queryLower) ||
      resource.description.toLowerCase().includes(queryLower) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(queryLower))
  );
}

/**
 * Get a single resource by ID
 */
export async function getResource(id: string): Promise<Resource | null> {
  await delay(100);
  return db.resources.get(id) || null;
}

