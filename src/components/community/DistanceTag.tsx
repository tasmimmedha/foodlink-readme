"use client";

import { cn } from "@/lib/helpers";

interface DistanceTagProps {
  distanceKm?: number;
  pickupWindow?: string;
  className?: string;
}

export function DistanceTag({ distanceKm, pickupWindow, className }: DistanceTagProps) {
  if (distanceKm == null && !pickupWindow) {
    return null;
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]",
        className
      )}
    >
      {distanceKm != null && <span>{distanceKm.toFixed(1)} km away</span>}
      {distanceKm != null && pickupWindow && <span className="text-emerald-400">•</span>}
      {pickupWindow && <span>{pickupWindow}</span>}
    </div>
  );
}

