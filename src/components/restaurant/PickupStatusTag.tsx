"use client";

import { cn } from "@/lib/helpers";

interface PickupStatusTagProps {
  status: "pending" | "picked-up" | "expired";
}

export function PickupStatusTag({ status }: PickupStatusTagProps) {
  const map = {
    pending: { text: "text-amber-600", bg: "bg-amber-50", label: "Pending Pickup" },
    "picked-up": { text: "text-emerald-600", bg: "bg-emerald-50", label: "Picked Up" },
    expired: { text: "text-rose-600", bg: "bg-rose-50", label: "Expired" },
  }[status];

  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em]",
        map.bg,
        map.text
      )}
    >
      {map.label}
    </span>
  );
}

