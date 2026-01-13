"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";

const FILTERS = ["all", "produce", "dairy", "meals", "bakery", "pantry"];

interface SurplusFilterBarProps {
  onFilterChange?: (filter: string) => void;
}

export function SurplusFilterBar({ onFilterChange }: SurplusFilterBarProps) {
  const [active, setActive] = useState("all");

  const handleFilter = (filter: string) => {
    setActive(filter);
    onFilterChange?.(filter);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-4 z-20 flex flex-wrap items-center gap-3 rounded-3xl border border-emerald-100/80 bg-white/90 dark:bg-gray-900/70 px-4 py-3 shadow-lg shadow-emerald-900/5 backdrop-blur"
    >
      <Button variant="ghost" size="sm" className="rounded-full text-emerald-500 gap-2">
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </Button>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-all",
              active === filter
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-200"
            )}
            onClick={() => handleFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

