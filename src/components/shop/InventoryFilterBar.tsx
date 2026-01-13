"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

interface InventoryFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  category?: string;
  onCategoryChange: (value?: string) => void;
  storageType?: "frozen" | "chilled" | "ambient";
  onStorageChange: (value?: "frozen" | "chilled" | "ambient") => void;
  categories: string[];
}

export function InventoryFilterBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  storageType,
  onStorageChange,
  categories,
}: InventoryFilterBarProps) {
  return (
    <motion.div
      className="grid gap-4 rounded-3xl border border-slate-100 bg-white/95 p-5 shadow-lg shadow-slate-200/70 md:grid-cols-3"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Field label="Search">
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search SKU or barcode"
        />
      </Field>
      <Field label="Category">
        <Select value={category ?? "all"} onValueChange={(value) => onCategoryChange(value === "all" ? undefined : value)}>
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Storage">
        <Select
          value={storageType ?? "all"}
          onValueChange={(value) =>
            onStorageChange(value === "all" ? undefined : (value as "frozen" | "chilled" | "ambient"))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All storage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All storage</SelectItem>
            <SelectItem value="frozen">Frozen</SelectItem>
            <SelectItem value="chilled">Chilled</SelectItem>
            <SelectItem value="ambient">Ambient</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </Label>
      {children}
    </div>
  );
}

