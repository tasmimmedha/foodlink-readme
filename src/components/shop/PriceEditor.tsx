"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";

interface PriceEditorProps {
  currentPrice: number;
  onApply: (newPrice: number, payload: { method: "percentage" | "fixed"; value: number }) => void;
}

export function PriceEditor({ currentPrice, onApply }: PriceEditorProps) {
  const [method, setMethod] = useState<"percentage" | "fixed">("percentage");
  const [value, setValue] = useState(10);

  const previewPrice =
    method === "percentage"
      ? Number((currentPrice * (1 - value / 100)).toFixed(2))
      : Math.max(0, Number((currentPrice - value).toFixed(2)));

  return (
    <motion.div
      className="space-y-4 rounded-3xl border border-slate-100 bg-white/90 p-5 shadow-lg shadow-slate-200/70"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-600">Price editor</p>
        <div className="rounded-full border border-slate-200 p-1 text-xs">
          <button
            type="button"
            className={`rounded-full px-2 py-1 ${method === "percentage" ? "bg-slate-900 text-white" : ""}`}
            onClick={() => setMethod("percentage")}
          >
            %
          </button>
          <button
            type="button"
            className={`rounded-full px-2 py-1 ${method === "fixed" ? "bg-slate-900 text-white" : ""}`}
            onClick={() => setMethod("fixed")}
          >
            Tk
          </button>
        </div>
      </div>

      {method === "percentage" ? (
        <div className="space-y-2">
          <Label>Discount percentage</Label>
          <Slider
            max={50}
            min={1}
            step={1}
            defaultValue={[value]}
            onValueChange={(vals) => setValue(vals[0])}
          />
          <p className="text-sm text-slate-500">{value}% off · New price ৳{previewPrice}</p>
        </div>
      ) : (
        <div className="space-y-2">
          <Label>Reduce by (৳)</Label>
          <Input
            type="number"
            min={0}
            step="1"
            value={value}
            onChange={(event) => setValue(Number(event.target.value))}
          />
        </div>
      )}

      <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
        <p>Old price: ৳{currentPrice.toFixed(2)}</p>
        <p className="font-semibold text-slate-900">New price: ৳{previewPrice.toFixed(2)}</p>
      </div>

      <Button
        className="w-full"
        onClick={() =>
          onApply(previewPrice, {
            method,
            value,
          })
        }
      >
        Apply new price
      </Button>
    </motion.div>
  );
}

