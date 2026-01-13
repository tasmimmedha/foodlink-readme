"use client";

import type { NGODonationOffer } from "@/lib/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface MapPreviewCardProps {
  offer?: NGODonationOffer;
  onOpenMap?: (offer: NGODonationOffer) => void;
}

export function MapPreviewCard({ offer, onOpenMap }: MapPreviewCardProps) {
  return (
    <Card className="rounded-3xl border-slate-100 bg-white/80 shadow-xl shadow-slate-100/70 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-black/30">
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Route preview</CardTitle>
          <p className="text-sm text-slate-500">{offer ? offer.donorName : "Select an offer to preview route"}</p>
        </div>
        <MapPin className="h-5 w-5 text-emerald-500" />
      </CardHeader>
      <CardContent>
        <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-100 via-lime-50 to-white dark:from-emerald-950/40">
          <motion.div
            className="absolute left-8 top-8 h-4 w-4 rounded-full bg-emerald-500 shadow-lg"
            animate={{ y: [0, 60, 20], x: [0, 40, 90] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute left-28 top-36 h-4 w-4 rounded-full bg-indigo-500 shadow-lg"
            animate={{ y: [0, -40, -10], x: [0, -30, -70] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
          />
          <svg className="absolute inset-6 h-[calc(100%-3rem)] w-[calc(100%-3rem)]" viewBox="0 0 200 200">
            <path
              d="M20,180 C60,100 100,140 140,40"
              stroke="url(#gradientRoute)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="10 8"
            />
            <defs>
              <linearGradient id="gradientRoute" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">{offer ? `${offer.distanceKm.toFixed(1)} km` : "—"}</p>
            <p className="text-xs text-slate-400">Estimated distance</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">{offer ? "~35 mins" : "—"}</p>
            <p className="text-xs text-slate-400">ETA</p>
          </div>
          <Button size="sm" onClick={() => offer && onOpenMap?.(offer)} className="gap-2">
            <Route className="h-4 w-4" />
            Open map
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


