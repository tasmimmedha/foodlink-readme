"use client";

import { cn } from "@/lib/helpers";

const STATUS_COLORS: Record<"pending" | "picked" | "expired", string> = {
  pending: "bg-amber-100 text-amber-700",
  picked: "bg-emerald-100 text-emerald-700",
  expired: "bg-rose-100 text-rose-700",
};

interface PickupStatusTagProps {
  status: "pending" | "picked" | "expired";
}

export function PickupStatusTag({ status }: PickupStatusTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        STATUS_COLORS[status]
      )}
    >
      {status}
    </span>
  );
}

