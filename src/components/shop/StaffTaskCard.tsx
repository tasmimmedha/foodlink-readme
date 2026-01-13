"use client";

import { ShopStaffTask, ShopStaffMember } from "@/lib/server";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle } from "lucide-react";

interface StaffTaskCardProps {
  task: ShopStaffTask;
  assignee?: ShopStaffMember;
  onToggle?: (task: ShopStaffTask) => void;
}

const CATEGORY_COLORS: Record<ShopStaffTask["category"], string> = {
  expiry: "bg-rose-50 text-rose-600",
  pricing: "bg-indigo-50 text-indigo-600",
  surplus: "bg-emerald-50 text-emerald-600",
  cleaning: "bg-amber-50 text-amber-600",
};

export function StaffTaskCard({ task, assignee, onToggle }: StaffTaskCardProps) {
  return (
    <motion.div
      layout
      className="rounded-3xl border border-slate-100 bg-white/95 p-4 shadow-lg shadow-slate-200/60"
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-slate-800">{task.title}</p>
          <p className="text-xs text-slate-500">{task.description}</p>
        </div>
        <Badge className={CATEGORY_COLORS[task.category]}>{task.category}</Badge>
      </div>
      <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
        <span>{assignee ? assignee.name : "Unassigned"}</span>
        <span className="text-slate-300">•</span>
        <span>Due {new Date(task.due).toLocaleDateString()}</span>
      </div>
      <Button
        variant={task.completed ? "secondary" : "outline"}
        size="sm"
        className="mt-4 w-full rounded-full"
        onClick={() => onToggle?.(task)}
      >
        {task.completed ? (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Completed
          </>
        ) : (
          <>
            <Circle className="mr-2 h-4 w-4" />
            Mark complete
          </>
        )}
      </Button>
    </motion.div>
  );
}

