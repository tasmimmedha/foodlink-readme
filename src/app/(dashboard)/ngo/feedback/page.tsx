"use client";

import { useState } from "react";
import { FeedbackListItem } from "@/components/ngo/FeedbackListItem";
import { FeedbackDetailModal } from "@/components/ngo/FeedbackDetailModal";
import { useFeedbackQueue, useFeedbackAction } from "@/hooks/use-query-ngo";
import { NGOFeedbackEntry } from "@/lib/server";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export default function NGOFeedbackPage() {
  const { data } = useFeedbackQueue();
  const actionMutation = useFeedbackAction();
  const [detail, setDetail] = useState<NGOFeedbackEntry | null>(null);

  const handleResolve = async (feedback: NGOFeedbackEntry) => {
    try {
      await actionMutation.mutateAsync({
        id: feedback.id,
        action: { type: "resolve", note: "Checked with kitchen and updated SOP." },
      });
      toast({ title: "Feedback resolved", description: "Feedback has been marked as resolved." });
    } catch {
      toast({ title: "Unable to resolve feedback", variant: "destructive" });
    }
  };

  const handleFlag = async (feedback: NGOFeedbackEntry) => {
    try {
      await actionMutation.mutateAsync({
        id: feedback.id,
        action: { type: "flag-partner", note: "Schedule QA visit" },
      });
      toast({ title: "Partner flagged", description: `${feedback.partnerName} has been flagged for review.` });
    } catch {
      toast({ title: "Unable to flag partner", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-3xl border-slate-100 bg-white/80 shadow-lg dark:border-slate-800 dark:bg-slate-900/70">
        <CardContent className="flex flex-wrap items-center gap-4 p-5">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wide text-slate-400">Satisfaction score trend</p>
            <p className="text-3xl font-semibold text-slate-900 dark:text-white">4.6 / 5</p>
            <p className="text-xs text-slate-500">Up 0.2 vs last week</p>
          </div>
          <div className="w-full max-w-sm">
            <Progress value={92} />
            <p className="mt-2 text-xs text-slate-400">92% positive feedback</p>
          </div>
          <Button variant="outline">Download QA log</Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {(data ?? []).map((feedback) => (
          <FeedbackListItem
            key={feedback.id}
            feedback={feedback}
            onResolve={handleResolve}
            onFlag={handleFlag}
            onView={setDetail}
          />
        ))}
      </div>

      <FeedbackDetailModal
        open={Boolean(detail)}
        feedback={detail}
        onClose={() => setDetail(null)}
        onResolve={handleResolve}
        onFlag={handleFlag}
      />
    </div>
  );
}


