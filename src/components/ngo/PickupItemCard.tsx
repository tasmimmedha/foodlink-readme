"use client";

import type { NGOPickupSchedule, NGODonationOffer } from "@/lib/server";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPinned, Truck, Timer, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/helpers";

interface PickupItemCardProps {
  pickup: NGOPickupSchedule;
  offer?: NGODonationOffer | null;
  onStatusChange?: (pickup: NGOPickupSchedule, status: NGOPickupSchedule["status"]) => void;
  onRoutePreview?: (pickup: NGOPickupSchedule) => void;
  onAssign?: (pickup: NGOPickupSchedule) => void;
}

const statusTone: Record<NGOPickupSchedule["status"], string> = {
  scheduled: "bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-200",
  "en-route": "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-200",
  "picked-up": "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-200",
  delivered: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-100",
  failed: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-200",
};

export function PickupItemCard({ pickup, offer, onStatusChange, onRoutePreview, onAssign }: PickupItemCardProps) {
  return (
    <motion.div
      layout
      whileHover={{ scale: 1.01 }}
      className="rounded-3xl border border-slate-100 bg-white/80 p-4 shadow-lg shadow-slate-100/70 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-black/40"
    >
      <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Scheduled</p>
        <p className="text-lg font-semibold text-slate-900 dark:text-white">
          {new Date(pickup.scheduledFor).toLocaleString([], { weekday: "short", hour: "2-digit", minute: "2-digit" })}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-300">
          {offer?.donorName ?? "Unassigned donor"}
        </p>
      </div>
      <Badge className={cn("px-3 py-1 text-xs", statusTone[pickup.status])}>{pickup.status}</Badge>
      </div>

      <div className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-300 md:grid-cols-3">
        <div className="flex items-center gap-2">
          <Timer className="h-4 w-4 text-amber-500" />
          ETA {pickup.etaMinutes}m
        </div>
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-emerald-500" />
          {pickup.volunteerName} • {pickup.vehicleType}
        </div>
        <div className="flex items-center gap-2">
          <MapPinned className="h-4 w-4 text-indigo-500" />
          {offer?.locationLabel ?? "TBD"}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
        {pickup.checkpoints.map((cp) => (
          <span
            key={cp.label}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-3 py-1",
              cp.status === "completed"
                ? "border-emerald-200 text-emerald-600 dark:border-emerald-500/40 dark:text-emerald-200"
                : "border-slate-200 dark:border-slate-700"
            )}
          >
            {cp.status === "completed" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
            {cp.label}
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs uppercase tracking-wide text-slate-400">
          Last updated {new Date(pickup.updatedAt ?? pickup.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => onRoutePreview?.(pickup)}>
            Route
          </Button>
          <Button variant="outline" size="sm" onClick={() => onAssign?.(pickup)}>
            Assign
          </Button>
          <Button size="sm" onClick={() => onStatusChange?.(pickup, pickup.status === "scheduled" ? "en-route" : "picked-up")}>
            Advance
          </Button>
        </div>
      </div>
    </motion.div>
  );
}


