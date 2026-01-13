"use client";

import type { NGODonationHistoryEntry } from "@/lib/server";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Utensils, Leaf, Users } from "lucide-react";

interface DonationHistoryTimelineProps {
  entries: NGODonationHistoryEntry[];
  onSelect?: (entry: NGODonationHistoryEntry) => void;
}

const statusTone: Record<NGODonationHistoryEntry["status"], string> = {
  delivered: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-200",
  partial: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-200",
  redirected: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-200",
  cancelled: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-200",
};

export function DonationHistoryTimeline({ entries, onSelect }: DonationHistoryTimelineProps) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-300 via-lime-300 to-transparent" />
      <div className="space-y-6">
        {entries.map((entry, index) => (
          <motion.button
            key={entry.id}
            type="button"
            onClick={() => onSelect?.(entry)}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative flex w-full gap-4 rounded-3xl border border-slate-100 bg-white/80 p-4 text-left shadow-sm shadow-slate-100/70 backdrop-blur hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-black/30"
          >
            <div className="relative">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-lime-400 text-white shadow-lg">
                <Utensils className="h-4 w-4" />
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-slate-800 dark:text-white">{entry.donorName}</p>
                <Badge className={`text-xs ${statusTone[entry.status]}`}>{entry.status}</Badge>
              </div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                {new Date(entry.pickupTime).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">{entry.itemsSummary}</p>
              <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <Leaf className="h-3.5 w-3.5 text-emerald-500" />
                  {entry.co2PreventedKg} kg CO₂
                </span>
                <span className="inline-flex items-center gap-1">
                  <Utensils className="h-3.5 w-3.5 text-amber-500" />
                  {entry.mealsProvided} meals
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-indigo-500" />
                  {entry.beneficiaries} people
                </span>
              </div>
              <Separator className="bg-slate-100 dark:bg-slate-800" />
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-[11px]">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}


