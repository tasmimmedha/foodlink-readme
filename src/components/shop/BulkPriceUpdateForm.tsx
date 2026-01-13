"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";

interface BulkPriceUpdateFormProps {
  selectionCount: number;
  onApply: (payload: { method: "percentage" | "fixed"; value: number }) => void;
  disabled?: boolean;
}

export function BulkPriceUpdateForm({
  selectionCount,
  onApply,
  disabled,
}: BulkPriceUpdateFormProps) {
  const [method, setMethod] = useState<"percentage" | "fixed">("percentage");
  const [value, setValue] = useState(10);

  return (
    <motion.div
      className="space-y-4 rounded-3xl border border-slate-100 bg-white/95 p-5 shadow-lg shadow-slate-200/60"
      initial={{ opacity: 0.8 }}
      animate={{ opacity: 1 }}
    >
      <p className="text-sm font-semibold text-slate-600">
        Bulk price update ({selectionCount} selected)
      </p>
      <div className="flex gap-2 text-xs">
        <button
          type="button"
          className={`flex-1 rounded-full border px-3 py-2 ${method === "percentage" ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200"}`}
          onClick={() => setMethod("percentage")}
        >
          Percentage
        </button>
        <button
          type="button"
          className={`flex-1 rounded-full border px-3 py-2 ${method === "fixed" ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200"}`}
          onClick={() => setMethod("fixed")}
        >
          Fixed amount
        </button>
      </div>
      {method === "percentage" ? (
        <div>
          <Label>Discount (%)</Label>
          <Slider
            max={60}
            min={1}
            defaultValue={[value]}
            onValueChange={(vals) => setValue(vals[0])}
          />
          <p className="text-xs text-slate-500">{value}% reduction</p>
        </div>
      ) : (
        <div>
          <Label>Reduce by (৳)</Label>
          <input
            type="number"
            min={0}
            value={value}
            onChange={(event) => setValue(Number(event.target.value))}
            className="mt-1 h-10 w-full rounded-2xl border border-slate-200 px-3 text-sm"
          />
        </div>
      )}
      <Button
        disabled={disabled || selectionCount === 0}
        onClick={() => onApply({ method, value })}
        className="w-full rounded-full"
      >
        Apply to selected items
      </Button>
    </motion.div>
  );
}

