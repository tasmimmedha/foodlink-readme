"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";

interface SafetyChecklistProps {
  items: { id: string; label: string; checked: boolean }[];
  onToggle?: (id: string, value: boolean) => void;
}

export function SafetyChecklist({ items, onToggle }: SafetyChecklistProps) {
  return (
    <Card className="rounded-3xl border-slate-100 bg-white/80 shadow-lg shadow-slate-100/70 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-black/30">
      <CardHeader className="flex flex-row items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-emerald-500" />
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Safety checklist</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-3 rounded-2xl border border-slate-100 px-3 py-2 dark:border-slate-800">
            <Checkbox
              id={item.id}
              checked={item.checked}
              onCheckedChange={(value) => onToggle?.(item.id, Boolean(value))}
            />
            <Label htmlFor={item.id} className="text-sm text-slate-600 dark:text-slate-300">
              {item.label}
            </Label>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}


