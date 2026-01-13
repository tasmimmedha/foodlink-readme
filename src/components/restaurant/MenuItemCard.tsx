"use client";

import { RestaurantMenuItem } from "@/lib/server/db";
import { WasteRiskBadge } from "./WasteRiskBadge";
import { motion } from "framer-motion";
import { ProfitMarginEstimate } from "./ProfitMarginEstimate";

interface MenuItemCardProps {
  item: RestaurantMenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="rounded-3xl border border-white/60 bg-white/80 dark:bg-gray-900/70 p-5 shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{item.name}</p>
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">{item.category}</p>
        </div>
        <WasteRiskBadge level={item.predictedWasteScore} />
      </div>
      <div className="mt-4 space-y-1">
        <p className="text-xs font-semibold text-gray-500">Ingredients</p>
        <p className="text-sm text-muted-foreground">
          {item.ingredients.map((ing) => `${ing.name} (${ing.quantity})`).join(", ")}
        </p>
      </div>
      <div className="mt-4">
        <ProfitMarginEstimate price={item.price} margin={item.margin} />
      </div>
      {item.suggestions.length > 0 && (
        <div className="mt-4 rounded-2xl bg-emerald-50/70 px-4 py-3 text-sm text-emerald-700">
          {item.suggestions[0]}
        </div>
      )}
    </motion.div>
  );
}

