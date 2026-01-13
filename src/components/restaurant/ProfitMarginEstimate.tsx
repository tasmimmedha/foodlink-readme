"use client";

import { motion } from "framer-motion";

interface ProfitMarginEstimateProps {
  price: number;
  margin: number;
}

export function ProfitMarginEstimate({ price, margin }: ProfitMarginEstimateProps) {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl border border-emerald-100/70 bg-emerald-50/60 px-3 py-2 text-sm text-emerald-700 flex items-center justify-between"
    >
      <span>Price: ${price.toFixed(2)}</span>
      <span className="font-semibold">{margin}% margin</span>
    </motion.div>
  );
}

