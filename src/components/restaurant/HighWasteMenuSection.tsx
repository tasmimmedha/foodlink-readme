"use client";

import { RestaurantMenuItem } from "@/lib/server/db";
import { motion } from "framer-motion";
import { WasteRiskBadge } from "./WasteRiskBadge";

interface HighWasteMenuSectionProps {
  items: RestaurantMenuItem[];
}

export function HighWasteMenuSection({ items }: HighWasteMenuSectionProps) {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/80 dark:bg-gray-900/70 p-5 shadow-lg space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">High Waste Menu Items</h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between rounded-2xl border border-rose-100/70 px-4 py-3"
          >
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-muted-foreground">{item.ingredients.map((i) => i.name).join(", ")}</p>
            </div>
            <WasteRiskBadge level={item.predictedWasteScore} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

