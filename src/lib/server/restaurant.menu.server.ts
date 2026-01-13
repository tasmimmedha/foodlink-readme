import { db, RestaurantMenuItem } from "./db";
import { delay } from "./helpers";
import { ensureRestaurantSeeded } from "./restaurant.seed";

const NETWORK_DELAY = 150;

export async function getMenuItems(): Promise<RestaurantMenuItem[]> {
  await delay(NETWORK_DELAY);
  await ensureRestaurantSeeded();
  return db.restaurantMenuItems.toArray();
}

export async function getMenuWasteScore(): Promise<{ itemId: string; score: number }[]> {
  await delay(NETWORK_DELAY);
  await ensureRestaurantSeeded();
  const items = await db.restaurantMenuItems.toArray();
  return items.map((item) => {
    const base =
      item.predictedWasteScore === "high" ? 80 : item.predictedWasteScore === "medium" ? 55 : 25;
    return { itemId: item.id, score: base + Math.random() * 10 };
  });
}

export async function getIngredientBreakdown(): Promise<{ ingredient: string; usage: number }[]> {
  await delay(NETWORK_DELAY);
  await ensureRestaurantSeeded();
  const items = await db.restaurantMenuItems.toArray();
  const map = new Map<string, number>();
  items.forEach((item) => {
    item.ingredients.forEach((ingredient) => {
      const current = map.get(ingredient.name) ?? 0;
      map.set(ingredient.name, current + parseFloat(ingredient.quantity) || 1);
    });
  });
  return Array.from(map.entries()).map(([ingredient, usage]) => ({ ingredient, usage }));
}

export async function getHighWasteItems(): Promise<RestaurantMenuItem[]> {
  await delay(NETWORK_DELAY);
  await ensureRestaurantSeeded();
  return db.restaurantMenuItems.where("predictedWasteScore").equals("high").toArray();
}

