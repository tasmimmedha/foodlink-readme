"use client";

import { CommunitySurplusPost } from "@/lib/server/db";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DistanceTag } from "./DistanceTag";
import { MessageCircle, Share2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/helpers";

interface CommunityFeedCardProps {
  post: CommunitySurplusPost;
  onClaim: (postId: string) => Promise<void> | void;
  onComment?: (postId: string) => void;
}

const STATUS_STYLES: Record<CommunitySurplusPost["status"], string> = {
  available: "bg-emerald-100 text-emerald-700",
  claimed: "bg-blue-100 text-blue-700",
  expired: "bg-gray-200 text-gray-500",
};

export function CommunityFeedCard({ post, onClaim, onComment }: CommunityFeedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl bg-white/90 dark:bg-gray-900/80 border border-emerald-50/40 dark:border-gray-800 shadow-xl shadow-emerald-100/40 hover:-translate-y-0.5 transition-all"
    >
      {post.image && (
        <div className="relative h-52 overflow-hidden rounded-t-3xl">
          <Image src={post.image} alt={post.title} fill className="object-cover transition-transform hover:scale-105" />
        </div>
      )}
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-emerald-100">
              {post.avatarUrl && <AvatarImage src={post.avatarUrl} alt={post.userName} />}
              <AvatarFallback>{post.userName.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{post.userName}</p>
              <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
            </div>
          </div>
          <Badge className={cn("rounded-full px-3 py-1 text-xs font-bold capitalize", STATUS_STYLES[post.status])}>
            {post.status}
          </Badge>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{post.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{post.description}</p>
        </div>

        <DistanceTag
          distanceKm={post.distanceKm}
          pickupWindow={`${post.pickupWindow.start} - ${post.pickupWindow.end}`}
        />

        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="rounded-full border-emerald-200 text-emerald-600">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-500">{`${post.quantity} ${post.unit}`}</p>
            <p className="text-xs text-gray-400">{post.category}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="rounded-full border-emerald-300 text-emerald-600 hover:bg-emerald-50"
              onClick={() => onClaim(post.id)}
              disabled={post.status !== "available"}
            >
              <Share2 className="h-4 w-4 mr-2" />
              {post.status === "available" ? "Claim" : "Claimed"}
            </Button>
            <Button variant="ghost" className="rounded-full" onClick={() => onComment?.(post.id)}>
              <MessageCircle className="h-4 w-4 mr-1" />
              {post.comments.length}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

