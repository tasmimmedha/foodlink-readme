"use client";

import { RestaurantInventoryItem } from "@/lib/server/db";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface ExpiringStockListProps {
  items: RestaurantInventoryItem[];
}

export function ExpiringStockList({ items }: ExpiringStockListProps) {
  if (!items.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl border border-dashed border-emerald-200/60 bg-emerald-50/30 p-8 text-center"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
            <AlertTriangle className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">All stock looks stable today</p>
            <p className="text-sm text-muted-foreground mt-1">No items expiring in the next 3 days</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const expiryDate = new Date(item.expiryDate);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const isUrgent = daysUntilExpiry <= 1;

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ x: 4 }}
            className={`flex items-center justify-between rounded-2xl px-4 py-3 shadow-sm transition-all ${
              isUrgent
                ? "bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200/70"
                : "bg-white/80 dark:bg-gray-900/70 border border-amber-100/70"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  isUrgent ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"
                }`}
              >
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {daysUntilExpiry === 0
                    ? "Expires today"
                    : daysUntilExpiry === 1
                    ? "Expires tomorrow"
                    : `Expires in ${daysUntilExpiry} days`}
                  {" • "}
                  {new Date(item.expiryDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {item.quantity} {item.unit}
                </p>
                <p className="text-xs text-muted-foreground">{item.category}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

