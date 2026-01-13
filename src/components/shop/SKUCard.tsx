"use client";

import { ShopInventoryItem } from "@/lib/server";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Pencil, ArchiveRestore } from "lucide-react";
import { cn } from "@/lib/helpers";

export interface SKUCardProps {
  item: ShopInventoryItem;
  viewMode?: "card" | "list";
  onEdit?: (item: ShopInventoryItem) => void;
  onMarkSurplus?: (item: ShopInventoryItem) => void;
  onOpenDetail?: (item: ShopInventoryItem) => void;
}

const STORAGE_TONES: Record<ShopInventoryItem["storageType"], string> = {
  frozen: "bg-sky-50 text-sky-600",
  chilled: "bg-emerald-50 text-emerald-600",
  ambient: "bg-amber-50 text-amber-600",
};

export function SKUCard({
  item,
  viewMode = "card",
  onEdit,
  onMarkSurplus,
  onOpenDetail,
}: SKUCardProps) {
  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      className={cn(
        "rounded-3xl border border-slate-100 bg-white/95 p-4 shadow-lg shadow-slate-200/60 backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/80",
        viewMode === "list" && "flex items-center justify-between gap-4"
      )}
      onClick={() => onOpenDetail?.(item)}
    >
      <div className="flex flex-1 items-start gap-4">
        <div className="rounded-2xl bg-slate-50 p-3 text-slate-400 dark:bg-slate-800">
          <Package className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-base font-semibold text-slate-900 dark:text-white">{item.name}</p>
            <Badge className={cn("rounded-full text-xs", STORAGE_TONES[item.storageType])}>
              {item.storageType}
            </Badge>
            {item.markdownStatus !== "none" && (
              <Badge className="rounded-full bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-200">
                {item.markdownStatus === "active" ? "Markdown active" : "Markdown scheduled"}
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500">
            {item.category} · {item.barcode} · {item.stockQuantity} {item.unit}
          </p>
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            ৳{item.price.toFixed(2)}{" "}
            <span className="text-xs font-normal text-slate-500">
              Cost ৳{item.cost.toFixed(2)}
            </span>
          </p>
          <p className="text-xs text-slate-400">
            Expires {new Date(item.expiryDate).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex flex-shrink-0 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={(event) => {
            event.stopPropagation();
            onEdit?.(item);
          }}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
        {item.surplusEligible && (
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full text-emerald-600 hover:bg-emerald-50"
            onClick={(event) => {
              event.stopPropagation();
              onMarkSurplus?.(item);
            }}
          >
            <ArchiveRestore className="mr-2 h-4 w-4" />
            Surplus
          </Button>
        )}
      </div>
    </motion.div>
  );
}

