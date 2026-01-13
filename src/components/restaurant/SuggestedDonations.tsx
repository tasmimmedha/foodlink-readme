"use client";

import { RestaurantInventoryItem } from "@/lib/server/db";
import { motion } from "framer-motion";
import { ArrowRight, HeartHandshake } from "lucide-react";

interface SuggestedDonationsProps {
  items: RestaurantInventoryItem[];
}

export function SuggestedDonations({ items }: SuggestedDonationsProps) {
  if (!items.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl border border-dashed border-emerald-200/60 bg-emerald-50/30 p-8 text-center"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
            <HeartHandshake className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">No items suggested for donation</p>
            <p className="text-sm text-muted-foreground mt-1">All inventory is in good condition</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.06 }}
          whileHover={{ x: 4, scale: 1.02 }}
          className="flex items-center justify-between rounded-2xl border border-emerald-100/80 bg-gradient-to-br from-white via-emerald-50/50 to-white px-4 py-3 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {item.quantity} {item.unit} • {item.storageType.toUpperCase()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold group-hover:gap-3 transition-all">
            Donate
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

