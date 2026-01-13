"use client";

import { RestaurantDonationLog } from "@/lib/server/db";
import { motion } from "framer-motion";
import { HeartHandshake } from "lucide-react";

interface DonationHistoryTimelineProps {
  donations: RestaurantDonationLog[];
}

export function DonationHistoryTimeline({ donations }: DonationHistoryTimelineProps) {
  return (
    <div className="relative pl-6 space-y-6">
      <div className="absolute left-2 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-300 to-transparent" />
      {donations.map((donation, index) => (
        <motion.div
          key={donation.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="relative"
        >
          <div className="absolute -left-5 top-2 h-3 w-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-200" />
          <div className="rounded-2xl border border-white/60 bg-white/80 dark:bg-gray-900/70 p-4 shadow">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">{donation.recipientName}</p>
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {donation.recipientType}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(donation.date).toLocaleString()} • {donation.items}
            </p>
            <div className="mt-3 flex items-center gap-3 text-sm text-emerald-600">
              <HeartHandshake className="h-4 w-4" />
              {donation.mealsProvided} meals • {donation.co2SavedKg}kg CO₂ saved
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

