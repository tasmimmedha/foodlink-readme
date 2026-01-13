"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PickupStatusTag } from "./PickupStatusTag";

interface SurplusUploadFormValues {
  title: string;
  description: string;
  quantity: number;
  unit: string;
  category: string;
  storageType: "fresh" | "chilled" | "frozen";
  pickupWindowStart: string;
  pickupWindowEnd: string;
  tags: string;
  image?: string;
}

interface SurplusUploadFormProps {
  onSubmit: (values: SurplusUploadFormValues) => Promise<void> | void;
}

export function SurplusUploadForm({ onSubmit }: SurplusUploadFormProps) {
  const [values, setValues] = useState<SurplusUploadFormValues>({
    title: "",
    description: "",
    quantity: 1,
    unit: "portions",
    category: "meal",
    storageType: "fresh",
    pickupWindowStart: "17:00",
    pickupWindowEnd: "20:00",
    tags: "",
  });
  const [uploading, setUploading] = useState(false);

  const updateField = <K extends keyof SurplusUploadFormValues>(key: K, value: SurplusUploadFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateField("image", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setUploading(true);
    await onSubmit(values);
    setUploading(false);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/60 bg-white/80 dark:bg-gray-900/70 p-6 shadow-xl space-y-4"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <Input placeholder="Title" value={values.title} onChange={(e) => updateField("title", e.target.value)} required />
        <Input
          placeholder="Category"
          value={values.category}
          onChange={(e) => updateField("category", e.target.value)}
          required
        />
        <Input
          type="number"
          placeholder="Quantity"
          value={values.quantity}
          onChange={(e) => updateField("quantity", Number(e.target.value))}
        />
        <Input placeholder="Unit" value={values.unit} onChange={(e) => updateField("unit", e.target.value)} />
      </div>
      <Textarea
        placeholder="Description"
        rows={3}
        value={values.description}
        onChange={(e) => updateField("description", e.target.value)}
      />
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          placeholder="Storage type (fresh/chilled/frozen)"
          value={values.storageType}
          onChange={(e) => updateField("storageType", e.target.value as any)}
        />
        <Input
          placeholder="Tags (comma separated)"
          value={values.tags}
          onChange={(e) => updateField("tags", e.target.value)}
        />
        <Input
          placeholder="Pickup start e.g. 17:00"
          value={values.pickupWindowStart}
          onChange={(e) => updateField("pickupWindowStart", e.target.value)}
        />
        <Input
          placeholder="Pickup end e.g. 20:00"
          value={values.pickupWindowEnd}
          onChange={(e) => updateField("pickupWindowEnd", e.target.value)}
        />
      </div>
      <label className="block rounded-2xl border border-dashed border-emerald-200/60 px-4 py-3 text-sm text-muted-foreground cursor-pointer">
        Upload photo
        <input type="file" className="hidden" accept="image/*" onChange={handleImage} />
      </label>
      {values.image && (
        <div className="rounded-2xl overflow-hidden max-h-48">
          <img src={values.image} alt="Surplus preview" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex items-center justify-between">
        <PickupStatusTag status="pending" />
        <Button type="submit" disabled={uploading} className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500">
          {uploading ? "Uploading..." : "Add Surplus"}
        </Button>
      </div>
    </motion.form>
  );
}

