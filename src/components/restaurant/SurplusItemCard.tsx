"use client";

import { RestaurantSurplusItem } from "@/lib/server/db";
import { motion } from "framer-motion";
import { PickupStatusTag } from "./PickupStatusTag";
import { assignToNGO, assignToKitchen, updateSurplusStatus } from "@/lib/server/restaurant.surplus.server";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SurplusItemCardProps {
  item: RestaurantSurplusItem;
  onUpdated?: () => void;
}

export function SurplusItemCard({ item, onUpdated }: SurplusItemCardProps) {
  const [loading, setLoading] = useState(false);

  const handleAssign = async (type: "ngo" | "kitchen") => {
    setLoading(true);
    if (type === "ngo") {
      await assignToNGO(item.id, "Hope Meals");
    } else {
      await assignToKitchen(item.id, "Community Kitchen");
    }
    setLoading(false);
    onUpdated?.();
  };

  const handleMarkPicked = async () => {
    setLoading(true);
    await updateSurplusStatus(item.id, "picked-up");
    setLoading(false);
    onUpdated?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="rounded-3xl border border-white/60 bg-white/80 dark:bg-gray-900/70 shadow-lg overflow-hidden"
    >
      {item.image && <img src={item.image} alt={item.title} className="h-40 w-full object-cover" />}
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold">{item.title}</p>
            <p className="text-sm text-muted-foreground">
              {item.quantity} {item.unit} • {item.category}
            </p>
          </div>
          <PickupStatusTag status={item.status} />
        </div>
        <p className="text-sm text-muted-foreground">{item.description}</p>
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-emerald-50 text-emerald-600 px-3 py-1 text-xs font-semibold">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between border rounded-2xl px-4 py-2 text-sm">
          <div>
            <p className="font-semibold text-gray-900">Pickup Window</p>
            <p className="text-muted-foreground">
              {item.pickupWindow.start} - {item.pickupWindow.end}
            </p>
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{item.storageType}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => handleAssign("ngo")} disabled={loading}>
            Assign NGO
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleAssign("kitchen")} disabled={loading}>
            Assign Kitchen
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-teal-500" onClick={handleMarkPicked} disabled={loading}>
            Mark Picked
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

