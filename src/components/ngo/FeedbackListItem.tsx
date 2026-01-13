"use client";

import type { NGOFeedbackEntry } from "@/lib/server";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Star, AlertTriangle, Smile } from "lucide-react";

interface FeedbackListItemProps {
  feedback: NGOFeedbackEntry;
  onResolve?: (feedback: NGOFeedbackEntry) => void;
  onFlag?: (feedback: NGOFeedbackEntry) => void;
  onView?: (feedback: NGOFeedbackEntry) => void;
}

const statusTone: Record<NGOFeedbackEntry["status"], string> = {
  pending: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-200",
  acknowledged: "bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-200",
  resolved: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-200",
};

export function FeedbackListItem({ feedback, onResolve, onFlag, onView }: FeedbackListItemProps) {
  return (
    <motion.div
      layout
      className="rounded-3xl border border-slate-100 bg-white/80 p-4 shadow-md shadow-slate-100/80 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-black/40"
    >
      <div className="flex items-start gap-3">
        {feedback.photo ? (
          <div className="relative h-16 w-16 overflow-hidden rounded-2xl">
            {feedback.photo.startsWith('http') ? (
              <img 
                src={`${feedback.photo}?auto=format&fit=crop&w=200&q=60`} 
                alt="feedback" 
                className="h-full w-full object-cover" 
              />
            ) : (
              <Image 
                src={feedback.photo} 
                alt="feedback" 
                fill 
                className="object-cover" 
              />
            )}
          </div>
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Smile className="h-6 w-6" />
          </div>
        )}
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-slate-900 dark:text-white">{feedback.recipientName}</p>
            <Badge className={statusTone[feedback.status]}>{feedback.status}</Badge>
            <span className="text-xs text-slate-400">{feedback.partnerName}</span>
          </div>
          <div className="flex items-center gap-1 text-amber-500">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star key={idx} className={`h-3 w-3 ${idx < feedback.rating ? "fill-current" : "opacity-30"}`} />
            ))}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">{feedback.comment}</p>
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-slate-400">
            {feedback.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 dark:bg-slate-800/70">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={() => onView?.(feedback)}>
          Details
        </Button>
        <Button variant="outline" size="sm" onClick={() => onFlag?.(feedback)} className="text-rose-500">
          <AlertTriangle className="mr-2 h-4 w-4" />
          Flag partner
        </Button>
        <Button size="sm" onClick={() => onResolve?.(feedback)}>
          Resolve
        </Button>
      </div>
    </motion.div>
  );
}


