"use client";

import type { NGOFeedbackEntry } from "@/lib/server";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, AlertTriangle, CheckCircle2 } from "lucide-react";

interface FeedbackDetailModalProps {
  open: boolean;
  feedback?: NGOFeedbackEntry | null;
  onClose: () => void;
  onResolve?: (feedback: NGOFeedbackEntry) => void;
  onFlag?: (feedback: NGOFeedbackEntry) => void;
}

export function FeedbackDetailModal({ open, feedback, onClose, onResolve, onFlag }: FeedbackDetailModalProps) {
  if (!feedback) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-3xl bg-white/95 p-0 shadow-2xl backdrop-blur-xl dark:bg-slate-900/95">
        {feedback.photo && (
          <div className="relative h-48 w-full overflow-hidden rounded-t-3xl">
            <Image src={`${feedback.photo}?auto=format&fit=crop&w=600&q=60`} alt="feedback" fill className="object-cover" />
          </div>
        )}
        <div className="space-y-4 p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-white">
              {feedback.recipientName} · {feedback.partnerName}
            </DialogTitle>
            <DialogDescription>
              Delivered on {new Date(feedback.deliveryDate).toLocaleString()}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-wrap gap-2">
            <Badge className="bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-200">Rating {feedback.rating}/5</Badge>
            {feedback.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="capitalize">
                {tag}
              </Badge>
            ))}
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300">{feedback.comment}</p>

          {feedback.correctiveAction && (
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800/60 dark:text-slate-200">
              <p className="flex items-center gap-2 text-slate-700 dark:text-slate-100">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Corrective action logged
              </p>
              <p className="mt-2">{feedback.correctiveAction}</p>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
            <Users className="h-4 w-4" />
            Requested by field volunteers
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onFlag?.(feedback)} className="text-rose-500">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Flag partner
            </Button>
            <Button onClick={() => onResolve?.(feedback)}>
              Resolve
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


