"use client";

import { useForm } from "react-hook-form";
import { AddSurplusInput } from "@/lib/server/shop.surplus.server";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ItemImageUploader } from "./ItemImageUploader";

interface SurplusAddFormProps {
  onSubmit: (data: AddSurplusInput) => void;
  isSubmitting?: boolean;
}

export function SurplusAddForm({ onSubmit, isSubmitting }: SurplusAddFormProps) {
  const form = useForm<AddSurplusInput>({
    defaultValues: {
      skuName: "",
      quantity: 1,
      unit: "units",
      expiryWindowStart: new Date().toISOString().slice(0, 16),
      expiryWindowEnd: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString().slice(0, 16),
      condition: "near-expiry",
      imageData: undefined,
    },
  });

  const handleSubmit = (values: AddSurplusInput) => {
    onSubmit(values);
    form.reset();
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-5 rounded-3xl border border-slate-100 bg-white/90 p-5 shadow-lg shadow-slate-200/70"
    >
      <Field label="Item name">
        <Input {...form.register("skuName", { required: true })} placeholder="Bread loaf" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Quantity">
          <Input type="number" min={1} {...form.register("quantity", { valueAsNumber: true })} />
        </Field>
        <Field label="Unit">
          <Input {...form.register("unit")} placeholder="pcs" />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Expiry window start">
          <Input type="datetime-local" {...form.register("expiryWindowStart")} />
        </Field>
        <Field label="Expiry window end">
          <Input type="datetime-local" {...form.register("expiryWindowEnd")} />
        </Field>
      </div>
      <Field label="Condition">
        <select
          className="h-10 rounded-2xl border border-slate-200 bg-white px-3 text-sm"
          {...form.register("condition")}
        >
          <option value="fresh">Fresh</option>
          <option value="near-expiry">Near expiry</option>
        </select>
      </Field>
      <ItemImageUploader
        value={form.watch("imageData")}
        onChange={(value) => form.setValue("imageData", value)}
        label="Attach image (optional)"
      />
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Add to surplus queue"}
      </Button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-sm text-slate-500">{label}</Label>
      {children}
    </div>
  );
}

