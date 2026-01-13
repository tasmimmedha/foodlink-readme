"use client";

import type { NGODonationOffer } from "@/lib/server";
import { cn } from "@/lib/helpers";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Clock3, MapPin, UtensilsCrossed, AlertTriangle } from "lucide-react";

interface OfferListItemProps {
  offer: NGODonationOffer;
  onAccept?: (offer: NGODonationOffer) => void;
  onDecline?: (offer: NGODonationOffer) => void;
  onRequestInfo?: (offer: NGODonationOffer) => void;
  onViewDetail?: (offer: NGODonationOffer) => void;
  compact?: boolean;
}

const urgencyTone: Record<NGODonationOffer["urgencyLevel"], string> = {
  high: "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:border-rose-500/30",
  medium:
    "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:border-amber-500/30",
  low: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:border-emerald-500/30",
};

export function OfferListItem({
  offer,
  onAccept,
  onDecline,
  onRequestInfo,
  onViewDetail,
  compact,
}: OfferListItemProps) {
  return (
    <motion.article
      layout
      whileHover={{ y: -4 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-slate-100 bg-white/90 p-4 shadow-lg shadow-emerald-100/40 backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/70 dark:shadow-black/30",
        compact && "p-3"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={cn("border text-xs uppercase tracking-wide", urgencyTone[offer.urgencyLevel])}>
              {offer.urgencyLevel === "high" ? "urgent" : offer.urgencyLevel}
            </Badge>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {offer.donorType}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{offer.offerTitle}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-300">{offer.donorName}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{offer.weightKg}kg</p>
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">~{offer.mealsEstimated} meals</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-300 md:grid-cols-3">
        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-amber-500" />
          <span>
            Pickup by{" "}
            <strong className="text-slate-900 dark:text-white">
              {new Date(offer.pickupWindow.end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-emerald-500" />
          <span>{offer.distanceKm.toFixed(1)} km • {offer.locationLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="h-4 w-4 text-indigo-500" />
          <span>{offer.items.map((item) => item.name).join(", ")}</span>
        </div>
      </div>

      {offer.safetyFlags && offer.safetyFlags.length > 0 && (
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-rose-50/70 px-3 py-2 text-xs font-semibold text-rose-600 dark:bg-rose-500/10 dark:text-rose-200">
          <AlertTriangle className="h-4 w-4" />
          {offer.safetyFlags.join(" • ")}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-2xl border border-slate-100 px-3 py-2 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
          <Phone className="h-4 w-4 text-emerald-500" />
          <span>{offer.contact.name}</span>
        </div>
        <div className="flex-1" />
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => onRequestInfo?.(offer)}>
            Details
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDecline?.(offer)} className="text-rose-500 hover:bg-rose-50">
            Decline
          </Button>
          <Button size="sm" onClick={() => onAccept?.(offer)}>
            Accept & Schedule
          </Button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onViewDetail?.(offer)}
        className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        aria-label={`View ${offer.offerTitle}`}
      />
    </motion.article>
  );
}


