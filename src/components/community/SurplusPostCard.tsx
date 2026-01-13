"use client";

import { CommunitySurplusPost } from "@/lib/server/db";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCirclePlus, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { DistanceTag } from "./DistanceTag";

interface SurplusPostCardProps {
  post: CommunitySurplusPost;
  onStatusChange: (postId: string, status: CommunitySurplusPost["status"]) => Promise<void> | void;
}

export function SurplusPostCard({ post, onStatusChange }: SurplusPostCardProps) {
  const [loading, setLoading] = useState(false);
  const handleClaim = async () => {
    if (post.status !== "available") return;
    try {
      setLoading(true);
      await onStatusChange(post.id, "claimed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-emerald-50 bg-white/90 dark:bg-gray-900/70 shadow-lg shadow-emerald-100/50 p-5 space-y-4"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-emerald-500">{post.category}</p>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{post.title}</h3>
        </div>
        <Badge
          className="rounded-full px-3 py-1 text-xs font-semibold capitalize bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40"
        >
          {post.status}
        </Badge>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300">{post.description}</p>
      <DistanceTag distanceKm={post.distanceKm} pickupWindow={`${post.pickupWindow.start} - ${post.pickupWindow.end}`} />

      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Badge key={tag} variant="outline" className="rounded-full border-emerald-200 text-emerald-600">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-500">{`${post.quantity} ${post.unit}`}</p>
          <p className="text-xs text-gray-400">Requests: {post.requests.length}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <MessageCirclePlus className="h-4 w-4" />
          </Button>
          <Button
            className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/40"
            onClick={handleClaim}
            disabled={post.status !== "available" || loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
            {post.status === "available" ? "Mark as Claimed" : "Completed"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

