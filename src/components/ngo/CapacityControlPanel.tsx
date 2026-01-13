"use client";

import type { NGOCapacitySettings } from "@/lib/server";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/helpers";
import { Shield, Thermometer, TimerReset } from "lucide-react";

type CapacityForm = {
  dailyCapacityKg: number;
  refrigeratedCapacityKg: number;
  dryCapacityKg: number;
  pickupWindowStart: string;
  pickupWindowEnd: string;
  allowPork: boolean;
  rejectExpired: boolean;
  temperatureChecks: boolean;
  preferredFoodTypes: string[];
  restrictedItems: string[];
};

interface CapacityControlPanelProps {
  capacity?: NGOCapacitySettings | null;
  onSave?: (data: Partial<NGOCapacitySettings>) => Promise<void> | void;
  isSubmitting?: boolean;
  className?: string;
}

const FOOD_TYPES = ["cooked", "raw", "produce", "bakery", "protein"];
const RESTRICTIONS = ["pork", "expired goods", "shellfish", "nuts", "unlabeled allergens"];

export function CapacityControlPanel({ capacity, onSave, isSubmitting, className }: CapacityControlPanelProps) {
  const form = useForm<CapacityForm>({
    values: capacity
      ? {
          dailyCapacityKg: capacity.dailyCapacityKg,
          refrigeratedCapacityKg: capacity.refrigeratedCapacityKg,
          dryCapacityKg: capacity.dryCapacityKg,
          pickupWindowStart: capacity.pickupWindow.start,
          pickupWindowEnd: capacity.pickupWindow.end,
          allowPork: capacity.autoAcceptance.allowPork,
          rejectExpired: capacity.autoAcceptance.rejectExpired,
          temperatureChecks: capacity.autoAcceptance.temperatureChecks,
          preferredFoodTypes: capacity.preferredFoodTypes,
          restrictedItems: capacity.restrictedItems,
        }
      : {
          dailyCapacityKg: 15,
          refrigeratedCapacityKg: 8,
          dryCapacityKg: 10,
          pickupWindowStart: "09:00",
          pickupWindowEnd: "21:00",
          allowPork: false,
          rejectExpired: true,
          temperatureChecks: true,
          preferredFoodTypes: ["cooked"],
          restrictedItems: ["pork"],
        },
  });

  const handleToggleMulti = (field: "preferredFoodTypes" | "restrictedItems", value: string) => {
    const current = form.getValues(field);
    if (current.includes(value)) {
      form.setValue(
        field,
        current.filter((item) => item !== value)
      );
    } else {
      form.setValue(field, [...current, value]);
    }
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSave?.({
      dailyCapacityKg: values.dailyCapacityKg,
      refrigeratedCapacityKg: values.refrigeratedCapacityKg,
      dryCapacityKg: values.dryCapacityKg,
      pickupWindow: {
        start: values.pickupWindowStart,
        end: values.pickupWindowEnd,
      },
      autoAcceptance: {
        allowPork: values.allowPork,
        rejectExpired: values.rejectExpired,
        temperatureChecks: values.temperatureChecks,
      },
      preferredFoodTypes: values.preferredFoodTypes as NGOCapacitySettings["preferredFoodTypes"],
      restrictedItems: values.restrictedItems,
    });
  });

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "space-y-6 rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-xl shadow-emerald-100/50 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-black/40",
        className
      )}
    >
      <div className="space-y-1">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Capacity & safety guardrails</h3>
        <p className="text-sm text-slate-500 dark:text-slate-300">
          Tune acceptance windows, storage thresholds, and auto-suggestions.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100/80 bg-slate-50/60 p-4 text-sm dark:border-slate-800/80 dark:bg-slate-800/40">
          <Label className="text-slate-600 dark:text-slate-300">Daily capacity (kg)</Label>
          <Input type="number" step="0.5" {...form.register("dailyCapacityKg", { valueAsNumber: true })} className="mt-2" />
        </div>
        <div className="rounded-2xl border border-slate-100/80 bg-slate-50/60 p-4 text-sm dark:border-slate-800/80 dark:bg-slate-800/40">
          <Label className="text-slate-600 dark:text-slate-300">Refrigerated (kg)</Label>
          <Input type="number" step="0.5" {...form.register("refrigeratedCapacityKg", { valueAsNumber: true })} className="mt-2" />
        </div>
        <div className="rounded-2xl border border-slate-100/80 bg-slate-50/60 p-4 text-sm dark:border-slate-800/80 dark:bg-slate-800/40">
          <Label className="text-slate-600 dark:text-slate-300">Dry storage (kg)</Label>
          <Input type="number" step="0.5" {...form.register("dryCapacityKg", { valueAsNumber: true })} className="mt-2" />
        </div>
      </div>

      <div className="rounded-3xl border border-emerald-100/80 bg-gradient-to-br from-emerald-50 via-white to-white p-5 shadow-inner dark:border-emerald-900/50 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900">
        <div className="flex items-center gap-3">
          <TimerReset className="h-5 w-5 text-emerald-500" />
          <div>
            <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">Pickup window preference</p>
            <p className="text-xs text-emerald-700/80 dark:text-emerald-200/80">
              Volunteers get auto-scheduled inside this band.
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div>
            <Label>Earliest</Label>
            <Input type="time" {...form.register("pickupWindowStart")} className="mt-1" />
          </div>
          <div>
            <Label>Latest</Label>
            <Input type="time" {...form.register("pickupWindowEnd")} className="mt-1" />
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-100/80 bg-white/70 p-5 dark:border-slate-800/80 dark:bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-500" />
            <h4 className="font-semibold text-slate-900 dark:text-white">Safety rails</h4>
          </div>
          <div className="mt-4 space-y-4 text-sm">
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
              <div>
                <p className="font-medium">Allow pork items</p>
                <p className="text-xs text-slate-500">Auto-decline if disabled.</p>
              </div>
              <Switch checked={form.watch("allowPork")} onCheckedChange={(v) => form.setValue("allowPork", v)} />
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
              <div>
                <p className="font-medium">Reject expired</p>
                <p className="text-xs text-slate-500">Flag items past best-by.</p>
              </div>
              <Switch checked={form.watch("rejectExpired")} onCheckedChange={(v) => form.setValue("rejectExpired", v)} />
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
              <div>
                <p className="font-medium">Temperature check</p>
                <p className="text-xs text-slate-500">Enforce {"\u003e"}63°C handoff for hot meals.</p>
              </div>
              <Switch checked={form.watch("temperatureChecks")} onCheckedChange={(v) => form.setValue("temperatureChecks", v)} />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-100/80 bg-white/70 p-5 dark:border-slate-800/80 dark:bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-amber-500" />
            <h4 className="font-semibold text-slate-900 dark:text-white">Food types & restrictions</h4>
          </div>
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Preferred focus</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {FOOD_TYPES.map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => handleToggleMulti("preferredFoodTypes", type)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-semibold capitalize transition",
                      form.watch("preferredFoodTypes").includes(type)
                        ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:border-emerald-500/60 dark:bg-emerald-500/10 dark:text-emerald-200"
                        : "border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-300"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Never accept</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {RESTRICTIONS.map((item) => (
                  <Badge
                    key={item}
                    variant={form.watch("restrictedItems").includes(item) ? "destructive" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleToggleMulti("restrictedItems", item)}
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-100/80 bg-slate-50/70 p-5 dark:border-slate-800/80 dark:bg-slate-900/60">
        <p className="text-xs uppercase tracking-wide text-slate-500">Dynamic partial acceptance threshold</p>
        <Slider
          defaultValue={[capacity?.currentUtilizationKg ?? 11]}
          max={capacity?.dailyCapacityKg ?? 20}
          step={0.5}
          disabled
          className="mt-4"
        />
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Currently utilizing {capacity?.currentUtilizationKg ?? 11} kg of {capacity?.dailyCapacityKg ?? 20} kg quota.
        </p>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Saving..." : "Update guardrails"}
      </Button>
    </motion.form>
  );
}


