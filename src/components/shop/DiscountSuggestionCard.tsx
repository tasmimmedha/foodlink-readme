"use client";

import { ShopDiscountSuggestion } from "@/lib/server";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface DiscountSuggestionCardProps {
  suggestion: ShopDiscountSuggestion;
  onApply?: (suggestion: ShopDiscountSuggestion) => void;
}

const URGENCY_TONE: Record<ShopDiscountSuggestion["urgency"], string> = {
  high: "bg-rose-500/10 text-rose-600",
  medium: "bg-amber-500/10 text-amber-600",
  low: "bg-emerald-500/10 text-emerald-600",
};

export function DiscountSuggestionCard({ suggestion, onApply }: DiscountSuggestionCardProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      onClick={() => onApply?.(suggestion)}
      className="w-full rounded-3xl border border-slate-100 bg-white/90 p-4 text-left shadow-lg shadow-slate-200/60 transition hover:shadow-emerald-200/70"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-base font-semibold text-slate-900">{suggestion.skuName}</p>
          <p className="text-xs text-slate-500">{suggestion.reason}</p>
        </div>
        <Badge className={URGENCY_TONE[suggestion.urgency]}>
          {suggestion.suggestedDiscountPct}% off
        </Badge>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
        <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
        Predicted sell-through {suggestion.predictedSellThrough}%
        <span className="text-slate-400">·</span>
        Expires {new Date(suggestion.expiresAt).toLocaleDateString()}
      </div>
    </motion.button>
  );
}

