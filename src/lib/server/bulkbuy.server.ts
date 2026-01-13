import { db } from "./db";
import { generateId, getTimestamp, delay } from "./helpers";
import { getCurrentUser } from "./auth.server";

export interface BulkBuyOpportunity {
  id: string;
  itemName: string;
  category?: string;
  currentPrice: number;
  bulkPrice: number;
  savings: number;
  savingsPercentage: number;
  participants: number;
  maxParticipants: number;
  deadline: string;
  participantsPreview: Array<{ name: string; avatar?: string }>;
  description?: string;
}

/**
 * Get bulk buy opportunities for a user - generates dynamic data directly
 */
export async function getBulkBuyOpportunities(
  token: string
): Promise<BulkBuyOpportunity[]> {
  await delay(50);

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  // Get items that are low in stock or expiring soon
  const inventory = await db.inventory
    .where("userId")
    .equals(currentUser.id)
    .toArray();

  const lowStockItems = inventory.filter((item) => (item.quantity || 0) < 1);
  const expiringSoon = inventory.filter((item) => {
    if (!item.expiryDate) return false;
    const expiry = new Date(item.expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 3 && daysUntilExpiry >= 0;
  });

  // Base prices by category
  const categoryPrices: Record<string, number> = {
    fruits: 4.99,
    vegetables: 3.99,
    dairy: 5.99,
    meat: 9.99,
    seafood: 13.99,
    grains: 3.49,
    bakery: 4.49,
    condiments: 6.99,
  };

  const participantNames = [
    "Sarah M.", "John D.", "Emma L.", "Mike T.", "Lisa K.",
    "Alex R.", "Maria S.", "David W.", "Chris P.", "Anna B."
  ];

  // Generate dynamic opportunities based on inventory
  const opportunities: BulkBuyOpportunity[] = [];

  // Helper to get stable ID from item name
  const getStableId = (itemName: string) => {
    return `bulk_${itemName.toLowerCase().replace(/\s+/g, '_')}`;
  };

  // Helper to get participation count from localStorage
  const getParticipationCount = (opportunityId: string): number => {
    if (typeof window === "undefined") return 0;
    const storageKey = `bulk_buy_${opportunityId}`;
    const existing = localStorage.getItem(storageKey);
    if (existing) {
      try {
        const participants = JSON.parse(existing);
        return Array.isArray(participants) ? participants.length : 0;
      } catch {
        return 0;
      }
    }
    return 0;
  };

  // Generate opportunities for low stock items
  lowStockItems.slice(0, 3).forEach((item) => {
    const basePrice = categoryPrices[item.category || "general"] || 5.99;
    const discount = 0.25 + (Math.random() * 0.15); // 25-40% discount
    const bulkPrice = basePrice * (1 - discount);
    const stableId = getStableId(item.name);
    const baseParticipants = Math.floor(Math.random() * 3) + 2; // 2-4 participants
    const maxParticipants = baseParticipants + Math.floor(Math.random() * 3) + 1;
    
    // Get actual participation count from localStorage
    const actualParticipants = getParticipationCount(stableId);
    const participants = Math.max(baseParticipants, actualParticipants);
    
    // Shuffle and pick random participants
    const shuffled = [...participantNames].sort(() => Math.random() - 0.5);
    
    opportunities.push({
      id: stableId,
      itemName: item.name,
      category: item.category,
      currentPrice: Number(basePrice.toFixed(2)),
      bulkPrice: Number(bulkPrice.toFixed(2)),
      savings: Number((basePrice - bulkPrice).toFixed(2)),
      savingsPercentage: Math.round(discount * 100),
      participants,
      maxParticipants,
      deadline: new Date(Date.now() + (Math.floor(Math.random() * 5) + 2) * 24 * 60 * 60 * 1000).toISOString(),
      participantsPreview: shuffled.slice(0, Math.min(participants, 3)).map(name => ({ name })),
      description: `Bulk buy opportunity for ${item.name} - save ${Math.round(discount * 100)}%`,
    });
  });

  // Generate opportunities for expiring soon items
  expiringSoon.slice(0, 2).forEach((item) => {
    if (!opportunities.find((opp) => opp.itemName.toLowerCase() === item.name.toLowerCase())) {
      const basePrice = categoryPrices[item.category || "general"] || 5.99;
      const discount = 0.30 + (Math.random() * 0.20); // 30-50% discount (higher for expiring)
      const bulkPrice = basePrice * (1 - discount);
      const stableId = getStableId(item.name);
      const baseParticipants = Math.floor(Math.random() * 2) + 1; // 1-2 participants
      const maxParticipants = baseParticipants + Math.floor(Math.random() * 2) + 1;
      
      // Get actual participation count from localStorage
      const actualParticipants = getParticipationCount(stableId);
      const participants = Math.max(baseParticipants, actualParticipants);
      
      const shuffled = [...participantNames].sort(() => Math.random() - 0.5);
      
      opportunities.push({
        id: stableId,
        itemName: item.name,
        category: item.category,
        currentPrice: Number(basePrice.toFixed(2)),
        bulkPrice: Number(bulkPrice.toFixed(2)),
        savings: Number((basePrice - bulkPrice).toFixed(2)),
        savingsPercentage: Math.round(discount * 100),
        participants,
        maxParticipants,
        deadline: new Date(Date.now() + (Math.floor(Math.random() * 3) + 1) * 24 * 60 * 60 * 1000).toISOString(),
        participantsPreview: shuffled.slice(0, Math.min(participants, 3)).map(name => ({ name })),
        description: `Urgent bulk buy for ${item.name} - limited time offer`,
      });
    }
  });

  // Always include at least 2-3 general opportunities if we don't have enough
  const generalItems = [
    { name: "Organic Tomatoes", category: "vegetables", basePrice: 4.99 },
    { name: "Free-Range Eggs", category: "dairy", basePrice: 6.99 },
    { name: "Fresh Spinach", category: "vegetables", basePrice: 3.99 },
  ];

  while (opportunities.length < 3) {
    const item = generalItems[opportunities.length % generalItems.length];
    if (!opportunities.find((opp) => opp.itemName.toLowerCase() === item.name.toLowerCase())) {
      const discount = 0.25 + (Math.random() * 0.15);
      const bulkPrice = item.basePrice * (1 - discount);
      const stableId = getStableId(item.name);
      const baseParticipants = Math.floor(Math.random() * 3) + 2;
      const maxParticipants = baseParticipants + Math.floor(Math.random() * 2) + 1;
      
      // Get actual participation count from localStorage
      const actualParticipants = getParticipationCount(stableId);
      const participants = Math.max(baseParticipants, actualParticipants);
      
      const shuffled = [...participantNames].sort(() => Math.random() - 0.5);
      
      opportunities.push({
        id: stableId,
        itemName: item.name,
        category: item.category,
        currentPrice: item.basePrice,
        bulkPrice: Number(bulkPrice.toFixed(2)),
        savings: Number((item.basePrice - bulkPrice).toFixed(2)),
        savingsPercentage: Math.round(discount * 100),
        participants,
        maxParticipants,
        deadline: new Date(Date.now() + (Math.floor(Math.random() * 4) + 2) * 24 * 60 * 60 * 1000).toISOString(),
        participantsPreview: shuffled.slice(0, Math.min(participants, 3)).map(name => ({ name })),
        description: `Bulk buy opportunity for ${item.name}`,
      });
    }
  }

  return opportunities.slice(0, 5); // Return top 5
}

/**
 * Join a bulk buy opportunity
 */
export async function joinBulkBuy(
  token: string,
  opportunityId: string
): Promise<{ success: boolean; message: string }> {
  await delay(300);

  if (typeof window === "undefined") {
    throw new Error("This function must be called from the client");
  }

  const currentUser = await getCurrentUser(token);
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  // Store participation in localStorage for demo purposes
  // In a real app, this would be stored in the database
  const storageKey = `bulk_buy_${opportunityId}`;
  const existing = localStorage.getItem(storageKey);
  
  let participants: string[] = [];
  if (existing) {
    try {
      participants = JSON.parse(existing);
      if (!Array.isArray(participants)) {
        participants = [];
      }
    } catch {
      participants = [];
    }
  }
  
  if (participants.includes(currentUser.id)) {
    return {
      success: false,
      message: "You have already joined this bulk buy opportunity.",
    };
  }
  
  participants.push(currentUser.id);
  localStorage.setItem(storageKey, JSON.stringify(participants));
  
  // Trigger custom event for same-tab synchronization
  window.dispatchEvent(new CustomEvent('bulkBuyUpdated', {
    detail: { opportunityId, participants }
  }));

  return {
    success: true,
    message: "Successfully joined the bulk buy opportunity!",
  };
}

