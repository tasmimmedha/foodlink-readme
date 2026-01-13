"use client";

import { ShopInventoryItem } from "@/lib/server";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlarmClock, Leaf, Tag, Truck } from "lucide-react";
import { cn } from "@/lib/helpers";

type AlertLevel = "high" | "medium" | "low";

const ALERT_COLORS: Record<AlertLevel, string> = {
  high: "bg-rose-50 border-rose-200 shadow-rose-100/50",
  medium: "bg-amber-50 border-amber-200 shadow-amber-100/50",
  low: "bg-lime-50 border-lime-200 shadow-lime-100/50",
};

export interface ExpiryAlertCardProps {
  item: ShopInventoryItem;
  level: AlertLevel;
  daysToExpire: number;
  onMarkDown?: (item: ShopInventoryItem) => void;
  onMoveToSurplus?: (item: ShopInventoryItem) => void;
  onMarkWaste?: (item: ShopInventoryItem) => void;
}

export function ExpiryAlertCard({
  item,
  level,
  daysToExpire,
  onMarkDown,
  onMoveToSurplus,
  onMarkWaste,
}: ExpiryAlertCardProps) {
  return (
    <motion.div
      layout
      whileHover={{ y: -3 }}
      className={cn(
        "rounded-3xl border p-5 shadow-lg",
        ALERT_COLORS[level]
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">{item.name}</p>
          <p className="text-xs text-slate-500">
            {item.category} · {item.storageType.toUpperCase()}
          </p>
        </div>
        <Badge
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold",
            level === "high" && "bg-rose-500 text-white",
            level === "medium" && "bg-amber-500 text-white",
            level === "low" && "bg-lime-500 text-white"
          )}
        >
          {daysToExpire <= 0 ? "Expires today" : `Expires in ${daysToExpire}d`}
        </Badge>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1">
          <AlarmClock className="h-3.5 w-3.5" />
          {new Date(item.expiryDate).toLocaleDateString()}
        </span>
        <span className="inline-flex items-center gap-1">
          <Leaf className="h-3.5 w-3.5" />
          {item.stockQuantity} {item.unit} in stock
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="rounded-full bg-white text-emerald-600 hover:bg-emerald-50 hover:scale-105 transition-all duration-200 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onMarkDown?.(item);
          }}
        >
          <Tag className="mr-2 h-4 w-4" />
          Mark down
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="rounded-full bg-white text-amber-600 hover:bg-amber-50 hover:scale-105 transition-all duration-200 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onMoveToSurplus?.(item);
          }}
        >
          <Truck className="mr-2 h-4 w-4" />
          Move to surplus
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full text-slate-500 hover:bg-slate-100 hover:scale-105 transition-all duration-200 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onMarkWaste?.(item);
          }}
        >
          Log waste
        </Button>
      </div>
    </motion.div>
  );
}

