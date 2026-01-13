"use client";

import { ShopInventoryItem } from "@/lib/server";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/helpers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Layers2, Snowflake } from "lucide-react";

interface SKUDetailModalProps {
  open: boolean;
  item?: ShopInventoryItem | null;
  onClose: () => void;
  onEdit?: (item: ShopInventoryItem) => void;
  onMarkDown?: (item: ShopInventoryItem) => void;
}

const STORAGE_ICONS = {
  frozen: Snowflake,
  chilled: Layers2,
  ambient: Calendar,
};

export function SKUDetailModal({
  open,
  item,
  onClose,
  onEdit,
  onMarkDown,
}: SKUDetailModalProps) {
  if (!item) return null;
  const StorageIcon = STORAGE_ICONS[item.storageType];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl rounded-3xl border-none bg-white/95 p-0 shadow-2xl backdrop-blur dark:bg-slate-900/95">
        <DialogHeader className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <DialogTitle className="text-2xl">{item.name}</DialogTitle>
          <DialogDescription>Barcode {item.barcode}</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 px-6 py-5">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <Badge variant="secondary" className="rounded-full">
              {item.category}
            </Badge>
            <Badge
              className={cn(
                "rounded-full capitalize",
                item.storageType === "frozen" && "bg-sky-50 text-sky-600",
                item.storageType === "chilled" && "bg-emerald-50 text-emerald-600",
                item.storageType === "ambient" && "bg-amber-50 text-amber-600"
              )}
            >
              {item.storageType}
            </Badge>
            {item.markdownStatus !== "none" && (
              <Badge className="rounded-full bg-rose-100 text-rose-600">
                {item.markdownStatus === "active" ? "Markdown active" : "Markdown scheduled"}
              </Badge>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoTile label="Stock" value={`${item.stockQuantity} ${item.unit}`} />
            <InfoTile label="Shelf location" value={item.shelfLocation ?? "Not set"} />
            <InfoTile
              label="Retail price"
              value={`৳${item.price.toFixed(2)}`}
              sub={`Cost ৳${item.cost.toFixed(2)}`}
            />
            <InfoTile
              label="Expiry date"
              value={new Date(item.expiryDate).toLocaleDateString()}
              icon={<Calendar className="h-4 w-4 text-amber-500" />}
            />
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <StorageIcon className="h-5 w-5 text-emerald-500" />
              Storage guidance
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Keep in {item.storageType} zone. Flag for markdown if remaining shelf life is under
              48 hours.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button className="gap-2" onClick={() => onEdit?.(item)}>
              Edit SKU
            </Button>
            <Button
              variant="secondary"
              className="gap-2 rounded-full"
              onClick={() => onMarkDown?.(item)}
            >
              Schedule Markdown
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoTile({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white/60 p-4 text-sm shadow-inner shadow-slate-100 dark:border-slate-800 dark:bg-slate-900/70">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <div className="mt-1 flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
        {icon}
        {value}
      </div>
      {sub && <p className="text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

