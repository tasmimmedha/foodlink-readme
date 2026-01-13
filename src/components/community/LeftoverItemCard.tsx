"use client";

import { LeftoverItem } from "@/lib/server/db";
import { motion } from "framer-motion";
import Image from "next/image";
import { DistanceTag } from "./DistanceTag";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/helpers";

interface LeftoverItemCardProps {
  item: LeftoverItem;
  onClaim: (itemId: string) => Promise<void> | void;
}

export function LeftoverItemCard({ item, onClaim }: LeftoverItemCardProps) {
  const dietaryColors: Record<string, string> = {
    vegan: "bg-emerald-100 text-emerald-700",
    vegetarian: "bg-lime-100 text-lime-700",
    "gluten-free": "bg-sky-100 text-sky-700",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl bg-white/90 dark:bg-gray-900/70 border border-emerald-50/50 dark:border-gray-800 shadow-xl shadow-emerald-100/40 hover:-translate-y-1 transition"
    >
      <div className="flex flex-col md:flex-row">
        {item.image && (
          <div className="relative md:w-48 h-48 md:h-auto overflow-hidden rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none">
            <Image src={item.image} alt={item.dishName} fill className="object-cover" />
          </div>
        )}
        <div className="flex-1 p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{item.dishName}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
            </div>
            <Badge
              className={cn(
                "rounded-full text-xs px-3 py-1",
                item.status === "available" ? "bg-emerald-100 text-emerald-600" : "bg-gray-200 text-gray-500"
              )}
            >
              {item.status}
            </Badge>
          </div>

          <DistanceTag distanceKm={item.distanceKm} pickupWindow={item.pickupWindow} />

          <div className="flex flex-wrap gap-3">
            {item.dietaryTags.map((tag) => (
              <span
                key={tag}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold capitalize shadow-inner",
                  dietaryColors[tag] ?? "bg-emerald-50 text-emerald-600"
                )}
              >
                {tag}
              </span>
            ))}
            {item.allergens.length > 0 && (
              <span className="rounded-full px-3 py-1 text-xs font-semibold bg-rose-50 text-rose-600 shadow-inner">
                Allergens: {item.allergens.join(", ")}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">{`${item.portions} portions`}</p>
            <Button
              variant="outline"
              className="rounded-full border-emerald-300 text-emerald-600 hover:bg-emerald-50"
              disabled={item.status !== "available"}
              onClick={() => onClaim(item.id)}
            >
              {item.status === "available" ? "Quick Claim" : "Claimed"}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

