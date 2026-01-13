"use client";

import type { NGODonationOffer } from "@/lib/server";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, MapPin, Phone, Utensils, ShieldCheck, Flame, Leaf } from "lucide-react";
import Image from "next/image";

interface OfferDetailModalProps {
  open: boolean;
  offer?: NGODonationOffer | null;
  onClose: () => void;
  onAccept?: (offer: NGODonationOffer) => void;
  onDecline?: (offer: NGODonationOffer) => void;
}

export function OfferDetailModal({ open, offer, onClose, onAccept, onDecline }: OfferDetailModalProps) {
  if (!offer) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border-none bg-white/95 shadow-2xl backdrop-blur-xl dark:bg-slate-900/95">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-semibold text-slate-900 dark:text-white">{offer.offerTitle}</DialogTitle>
          <DialogDescription className="text-base text-slate-500 dark:text-slate-300">
            Incoming from {offer.donorName} • {offer.distanceKm.toFixed(1)} km away
          </DialogDescription>
        </DialogHeader>

        {offer.images?.length > 0 && (
          <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50/60 p-3 dark:bg-slate-800/40">
            {offer.images.slice(0, 2).map((src) => (
              <div key={src} className="relative h-32 w-full overflow-hidden rounded-2xl">
                <Image src={`${src}?auto=format&fit=crop&w=400&q=60`} alt={offer.offerTitle} fill className="object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <section className="rounded-2xl border border-slate-100/80 bg-white/80 p-4 shadow-inner shadow-slate-100/40 dark:border-slate-800/80 dark:bg-slate-900/60">
            <div className="grid gap-4 text-sm text-slate-600 dark:text-slate-300 md:grid-cols-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                Pickup window{" "}
                <strong className="text-slate-900 dark:text-white">
                  {new Date(offer.pickupWindow.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                  {new Date(offer.pickupWindow.end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </strong>
              </div>
              <div className="flex items-center gap=2">
                <MapPin className="mr-2 h-4 w-4 text-emerald-500" />
                {offer.locationLabel}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-indigo-500" />
                {offer.contact.name} • {offer.contact.phone}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {offer.weightKg} kg
              </Badge>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                ~{offer.mealsEstimated} meals
              </Badge>
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                Freshness {offer.freshnessScore}%
              </Badge>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="font-semibold text-slate-900 dark:text-white">Items</h3>
            <div className="rounded-2xl border border-slate-100/80 bg-white/70 p-4 dark:border-slate-800/80 dark:bg-slate-900/60">
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {offer.items.map((item) => (
                  <li key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Utensils className="h-4 w-4 text-slate-400" />
                      <span>{item.name}</span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {item.type}
                      </Badge>
                      {item.temperature && (
                        <Badge variant="secondary" className="text-[11px] capitalize">
                          {item.temperature}
                        </Badge>
                      )}
                    </div>
                    <span>
                      {item.quantity} {item.unit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="font-semibold text-slate-900 dark:text-white">Quality & Safety</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-emerald-100/80 bg-emerald-50/80 p-4 text-sm text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-900/30 dark:text-emerald-100">
                <div className="flex items-center gap-2 font-semibold">
                  <ShieldCheck className="h-4 w-4" />
                  Acceptance Match
                </div>
                <p className="mt-2 text-emerald-800/80 dark:text-emerald-200">
                  {offer.matchReason}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100/80 bg-white/70 p-4 text-sm text-slate-600 dark:border-slate-800/80 dark:bg-slate-900/60 dark:text-slate-200">
                <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                  <Flame className="h-4 w-4 text-amber-500" />
                  Dietary & notes
                </div>
                <p className="mt-2">{offer.dietaryNotes ?? "No special notes"}</p>
                {offer.safetyFlags && offer.safetyFlags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {offer.safetyFlags.map((flag) => (
                      <Badge key={flag} variant="outline" className="border-rose-200 text-rose-600 dark:border-rose-500/40 dark:text-rose-200">
                        {flag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          <Separator />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-300">
              <Leaf className="h-4 w-4 text-emerald-500" />
              <span>CO₂ prevented projection: {(offer.weightKg * 1.5).toFixed(1)} kg</span>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => onDecline?.(offer)} className="text-rose-500 hover:bg-rose-50">
                Decline
              </Button>
              <Button onClick={() => onAccept?.(offer)}>Accept & schedule</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


