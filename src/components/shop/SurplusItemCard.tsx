"use client";

import { ShopSurplusItem } from "@/lib/server";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock3, MapPin, Truck } from "lucide-react";

interface SurplusItemCardProps {
  item: ShopSurplusItem;
  onAssign?: (item: ShopSurplusItem) => void;
  onStatusChange?: (item: ShopSurplusItem, status: ShopSurplusItem["status"]) => void;
}

const STATUS_TONE: Record<ShopSurplusItem["status"], string> = {
  pending: "bg-amber-50 text-amber-600",
  picked: "bg-emerald-50 text-emerald-600",
  expired: "bg-rose-50 text-rose-600",
};

export function SurplusItemCard({ item, onAssign, onStatusChange }: SurplusItemCardProps) {
  return (
    <motion.div
      layout
      className="rounded-3xl border border-slate-100 bg-white/95 p-4 shadow-lg shadow-slate-200/60"
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-slate-900">{item.skuName}</p>
          <p className="text-xs text-slate-500">
            {item.quantity} {item.unit} · {item.condition}
          </p>
        </div>
        <Badge className={STATUS_TONE[item.status]}>{item.status}</Badge>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1">
          <Clock3 className="h-3.5 w-3.5" />
          Pickup {item.pickupTime ? new Date(item.pickupTime).toLocaleTimeString() : "Not set"}
        </span>
        {item.destinationName && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {item.destinationName}
          </span>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() => onAssign?.(item)}
        >
          <Truck className="mr-2 h-4 w-4" />
          Assign NGO
        </Button>
        {item.status === "pending" && (
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full text-emerald-600 hover:bg-emerald-50"
            onClick={() => onStatusChange?.(item, "picked")}
          >
            Mark picked
          </Button>
        )}
        {item.status !== "expired" && (
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full text-rose-600 hover:bg-rose-50"
            onClick={() => onStatusChange?.(item, "expired")}
          >
            Mark expired
          </Button>
        )}
      </div>
    </motion.div>
  );
}

