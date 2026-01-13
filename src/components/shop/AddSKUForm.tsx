"use client";

import { useForm } from "react-hook-form";
import { AddSKUInput } from "@/lib/server/shop.inventory.server";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ItemImageUploader } from "./ItemImageUploader";
import { motion } from "framer-motion";

interface AddSKUFormProps {
  defaultValues?: Partial<AddSKUInput>;
  onSubmit: (values: AddSKUInput) => void;
  isSubmitting?: boolean;
}

const STORAGE_OPTIONS: AddSKUInput["storageType"][] = ["frozen", "chilled", "ambient"];

export function AddSKUForm({ defaultValues, onSubmit, isSubmitting }: AddSKUFormProps) {
  const form = useForm<AddSKUInput>({
    defaultValues: {
      name: "",
      category: "",
      barcode: "",
      stockQuantity: 0,
      unit: "units",
      price: 0,
      cost: 0,
      expiryDate: new Date().toISOString().slice(0, 10),
      storageType: "ambient",
      shelfLocation: "",
      imageData: undefined,
      ...defaultValues,
    },
  });

  const handleSubmit = (values: AddSKUInput) => {
    onSubmit(values);
    form.reset();
  };

  return (
    <motion.form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-6 rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-xl shadow-slate-200/70"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Product name">
          <Input {...form.register("name", { required: true })} placeholder="Organic Milk 1L" />
        </Field>
        <Field label="Category">
          <Input {...form.register("category", { required: true })} placeholder="Dairy" />
        </Field>
        <Field label="Barcode">
          <Input {...form.register("barcode", { required: true })} placeholder="GM-0012" />
        </Field>
        <Field label="Shelf location">
          <Input {...form.register("shelfLocation")} placeholder="Chiller A2" />
        </Field>
        <Field label="Stock quantity">
          <Input
            type="number"
            min={0}
            {...form.register("stockQuantity", { valueAsNumber: true })}
          />
        </Field>
        <Field label="Unit">
          <Input {...form.register("unit")} placeholder="bottles" />
        </Field>
        <Field label="Retail price">
          <Input type="number" min={0} step="0.01" {...form.register("price", { valueAsNumber: true })} />
        </Field>
        <Field label="Cost">
          <Input type="number" min={0} step="0.01" {...form.register("cost", { valueAsNumber: true })} />
        </Field>
        <Field label="Expiry date">
          <Input type="date" {...form.register("expiryDate", { required: true })} />
        </Field>
        <Field label="Storage type">
          <select
            className="h-10 rounded-2xl border border-slate-200 bg-white px-3 text-sm"
            {...form.register("storageType")}
          >
            {STORAGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <ItemImageUploader
        value={form.watch("imageData")}
        onChange={(value) => form.setValue("imageData", value)}
      />

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save SKU"}
      </Button>
    </motion.form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-sm text-slate-500">{label}</Label>
      {children}
    </div>
  );
}

