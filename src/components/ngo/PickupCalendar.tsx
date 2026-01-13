"use client";

import type { NGOPickupSchedule, NGODonationOffer } from "@/lib/server";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { PickupItemCard } from "./PickupItemCard";
import { EmptyStateIllustration } from "./EmptyStateIllustration";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PickupCalendarProps {
  pickups: NGOPickupSchedule[];
  offers?: NGODonationOffer[];
  onStatusChange?: (pickup: NGOPickupSchedule, status: NGOPickupSchedule["status"]) => void;
  onRoutePreview?: (pickup: NGOPickupSchedule) => void;
  onAssign?: (pickup: NGOPickupSchedule) => void;
}

export function PickupCalendar({ pickups, offers = [], onStatusChange, onRoutePreview, onAssign }: PickupCalendarProps) {
  const grouped = useMemo(() => {
    return pickups.reduce<Record<string, NGOPickupSchedule[]>>((acc, pickup) => {
      const dateKey = new Date(pickup.scheduledFor).toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
      acc[dateKey] = acc[dateKey] ? [...acc[dateKey], pickup] : [pickup];
      return acc;
    }, {});
  }, [pickups]);

  const offerMap = useMemo(() => {
    return offers.reduce<Record<string, NGODonationOffer>>((acc, offer) => {
      acc[offer.id] = offer;
      return acc;
    }, {});
  }, [offers]);

  if (pickups.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 p-10 dark:border-slate-700 dark:bg-slate-900/60">
        <EmptyStateIllustration
          title="No pickups scheduled"
          description="Drag offers into the timeline or accept a donor offer to plan the next route."
          actionLabel="View offers"
        />
      </div>
    );
  }

  return (
    <ScrollArea className="max-h-[540px] rounded-3xl border border-slate-100 bg-white/80 p-4 shadow-inner dark:border-slate-800 dark:bg-slate-900/70">
      <div className="space-y-6">
        {Object.entries(grouped).map(([date, dayPickups]) => (
          <motion.div key={date} layout className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">{date}</p>
              <span className="text-xs text-slate-400">{dayPickups.length} pickups</span>
            </div>
            <div className="space-y-3">
              {dayPickups
                .sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime())
                .map((pickup) => (
                  <PickupItemCard
                    key={pickup.id}
                    pickup={pickup}
                    offer={offerMap[pickup.offerId]}
                    onAssign={onAssign}
                    onRoutePreview={onRoutePreview}
                    onStatusChange={onStatusChange}
                  />
                ))}
            </div>
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  );
}


