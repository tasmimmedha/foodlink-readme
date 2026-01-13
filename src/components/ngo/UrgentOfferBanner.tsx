"use client";

import type { NGODonationOffer } from "@/lib/server";
import { motion } from "framer-motion";
import { AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UrgentOfferBannerProps {
  offer?: NGODonationOffer;
  onAccept?: (offer: NGODonationOffer) => void;
  onView?: (offer: NGODonationOffer) => void;
}

export function UrgentOfferBanner({ offer, onAccept, onView }: UrgentOfferBannerProps) {
  if (!offer) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50 via-white to-white p-5 shadow-lg shadow-rose-100/70 dark:border-rose-900/50 dark:from-rose-950/20 dark:via-slate-900"
    >
      <div className="flex items-center gap-3 text-rose-700 dark:text-rose-200">
        <AlertTriangle className="h-5 w-5" />
        <p className="text-sm font-semibold uppercase tracking-wide">Perishable alert</p>
      </div>
      <div>
        <p className="text-lg font-semibold text-slate-900 dark:text-white">{offer.offerTitle}</p>
        <p className="text-sm text-slate-500 dark:text-slate-300">
          {offer.donorName} • {offer.distanceKm.toFixed(1)} km away
        </p>
      </div>
      <div className="flex items-center gap-2 text-sm text-rose-600 dark:text-rose-200">
        <Clock className="h-4 w-4" />
        Pickup by {new Date(offer.pickupWindow.end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ·{" "}
        {offer.weightKg}kg cooked meals
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" onClick={() => onView?.(offer)}>
          View details
        </Button>
        <Button className="bg-rose-500 text-white hover:bg-rose-500/90" onClick={() => onAccept?.(offer)}>
          Accept & route now
        </Button>
      </div>
    </motion.div>
  );
}


