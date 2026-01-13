"use client";

import { useEffect, useState } from "react";
import { RestaurantMenuItem } from "@/lib/server/db";
import { getMenuItems, getIngredientBreakdown, getHighWasteItems } from "@/lib/server/restaurant.menu.server";
import { MenuItemCard } from "@/components/restaurant/MenuItemCard";
import { HighWasteMenuSection } from "@/components/restaurant/HighWasteMenuSection";
import { IngredientBreakdownChart } from "@/components/restaurant/IngredientBreakdownChart";
import { PageHeader } from "@/components/shared/page-header";

export default function RestaurantMenuAnalysisPage() {
  const [items, setItems] = useState<RestaurantMenuItem[]>([]);
  const [highWaste, setHighWaste] = useState<RestaurantMenuItem[]>([]);
  const [ingredients, setIngredients] = useState<{ ingredient: string; usage: number }[]>([]);

  const loadData = async () => {
    const [menu, high, breakdown] = await Promise.all([
      getMenuItems(),
      getHighWasteItems(),
      getIngredientBreakdown(),
    ]);
    setItems(menu);
    setHighWaste(high);
    setIngredients(breakdown);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Menu Analysis"
        description="Anticipate waste hot spots and adjust recipes based on live stock."
      />
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
        <div className="space-y-4">
          <HighWasteMenuSection items={highWaste} />
          <IngredientBreakdownChart data={ingredients} />
        </div>
      </div>
    </div>
  );
}

