"use client";

import { motion } from "framer-motion";
import { LeaderboardEntry } from "@/lib/server/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/helpers";

interface LeaderboardTableProps {
  title: string;
  entries: LeaderboardEntry[];
  accent?: string;
}

export function LeaderboardTable({ title, entries, accent = "from-emerald-500 to-teal-500" }: LeaderboardTableProps) {
  return (
    <Card className="border-none bg-white/80 dark:bg-gray-900/80 shadow-xl shadow-emerald-900/10">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-2xl bg-gradient-to-br text-white shadow-md", accent)}>
            <Trophy className="h-5 w-5" />
          </div>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {entries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between rounded-2xl border border-emerald-50/70 dark:border-emerald-900/40 bg-white dark:bg-gray-950/40 px-4 py-3 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="text-sm font-semibold text-emerald-500">{index + 1}</div>
              <div>
                <p className="text-sm font-semibold">{entry.name}</p>
                <p className="text-xs text-gray-500">{entry.household}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-base font-bold text-emerald-600 dark:text-emerald-300">{`${entry.value} ${entry.unit}`}</p>
              <p className="text-xs text-gray-400">{entry.badge}</p>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

