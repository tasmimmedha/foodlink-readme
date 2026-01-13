"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface EmptyStateIllustrationProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyStateIllustration({ title, description, actionLabel, onAction }: EmptyStateIllustrationProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="relative h-32 w-32 rounded-full bg-gradient-to-br from-emerald-100 via-white to-lime-100 shadow-inner"
      >
        <div className="absolute inset-6 rounded-full border-2 border-dashed border-emerald-200" />
        <div className="absolute left-1/2 top-4 h-3 w-3 -translate-x-1/2 rounded-full bg-emerald-400 shadow-lg" />
        <div className="absolute bottom-6 left-6 h-4 w-4 rounded-full bg-lime-400 shadow-lg" />
        <div className="absolute bottom-6 right-6 h-6 w-6 rounded-full bg-emerald-300 shadow-lg" />
      </motion.div>
      <div>
        <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h4>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{description}</p>
      </div>
      {actionLabel && (
        <Button onClick={onAction} variant="outline" className="rounded-full">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}


