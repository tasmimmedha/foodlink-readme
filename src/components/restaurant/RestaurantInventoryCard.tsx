"use client";

import { RestaurantInventoryItem } from "@/lib/server/db";
import { motion } from "framer-motion";
import { cn } from "@/lib/helpers";
import { Refrigerator, AlertTriangle } from "lucide-react";

interface RestaurantInventoryCardProps {
  item: RestaurantInventoryItem;
  onEdit?: (item: RestaurantInventoryItem) => void;
  onDelete?: (id: string) => void;
}

export function RestaurantInventoryCard({ item, onEdit, onDelete }: RestaurantInventoryCardProps) {
  const statusColor =
    item.status === "expiring" ? "text-rose-500" : item.status === "overstocked" ? "text-amber-500" : "text-emerald-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="rounded-3xl border border-white/60 bg-white/80 dark:bg-gray-900/70 p-4 shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{item.name}</p>
          <p className="text-sm text-muted-foreground">
            {item.quantity} {item.unit} • {item.category}
          </p>
        </div>
        <div className={cn("flex items-center gap-1 text-xs font-semibold uppercase tracking-widest", statusColor)}>
          {item.status === "expiring" && <AlertTriangle className="h-4 w-4" />}
          {item.status}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
        <div>
          <p className="font-semibold text-gray-500">Expiry</p>
          <p>{new Date(item.expiryDate).toLocaleString()}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-500">Storage</p>
          <p className="flex items-center gap-1 uppercase tracking-wide">
            <Refrigerator className="h-3.5 w-3.5" /> {item.storageType}
          </p>
        </div>
      </div>
      {item.alertTags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {item.alertTags.map((tag) => (
            <span key={tag} className="rounded-full bg-rose-50 text-rose-500 px-3 py-1 text-xs font-semibold">
              {tag}
            </span>
          ))}
        </div>
      )}
      {(onEdit || onDelete) && (
        <div className="mt-4 flex justify-end gap-3">
          {onEdit && (
            <button
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              onClick={() => onEdit(item)}
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors"
              onClick={() => onDelete(item.id)}
            >
              Remove
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}

