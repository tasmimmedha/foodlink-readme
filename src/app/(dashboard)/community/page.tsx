"use client";

import { useEffect, useState, useTransition } from "react";
import {
  addLeftoverShare,
  addSurplusPost,
  getCommunityFeed,
  getCommunityImpact,
  updateSurplusPostStatus,
} from "@/lib/server/community.server";
import { CommunityImpact, CommunitySurplusPost } from "@/lib/server/db";
import { XPBoostBanner } from "@/components/community/XPBoostBanner";
import { PostComposer } from "@/components/community/PostComposer";
import { CommunityFeedCard } from "@/components/community/CommunityFeedCard";
import { CommunityImpactStats } from "@/components/community/CommunityImpactStats";
import { ImpactTrendChart } from "@/components/community/ImpactTrendChart";
import { SurplusFilterBar } from "@/components/community/SurplusFilterBar";
import { useUserStore } from "@/store/user.store";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

export default function CommunityDashboardPage() {
  const { user } = useUserStore();
  const [feed, setFeed] = useState<CommunitySurplusPost[]>([]);
  const [impact, setImpact] = useState<CommunityImpact | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [_isPending, startTransition] = useTransition();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (filterValue = filter) => {
    setLoading(true);
    const [feedData, impactData] = await Promise.all([
      getCommunityFeed(filterValue === "all" ? undefined : { categories: [filterValue] }),
      getCommunityImpact(),
    ]);
    setFeed(feedData);
    setImpact(impactData);
    setLoading(false);
  };

  const handleClaim = (postId: string) => {
    startTransition(async () => {
      try {
        await updateSurplusPostStatus(postId, "claimed");
        await loadData();
        toast({ title: "Item claimed", description: "You've successfully claimed this item!" });
      } catch (error) {
        console.error("Error claiming item:", error);
        toast({ title: "Unable to claim item", description: "Please try again.", variant: "destructive" });
      }
    });
  };

  const handleCreate = async (payload: { type: "surplus" | "leftover" } & any) => {
    if (!user) {
      toast({ title: "Please log in", variant: "destructive" });
      return;
    }
    try {
      if (payload.type === "surplus") {
        await addSurplusPost({
          userId: user.id,
          userName: user.name,
          avatarUrl: undefined,
          title: payload.title,
          description: payload.description,
          category: payload.category,
          tags: payload.category.split(",").map((tag: string) => tag.trim()),
          quantity: payload.quantity,
          unit: payload.unit,
          pickupWindow: { start: payload.pickupWindow.split("-")[0]?.trim() ?? "17:00", end: payload.pickupWindow.split("-")[1]?.trim() ?? "19:00" },
          pickupLocation: "Community Hub",
          distanceKm: 0.4,
          image: payload.image,
        });
        toast({ title: "Post created", description: "Your surplus post has been shared with the community!" });
      } else {
        await addLeftoverShare({
          userId: user.id,
          userName: user.name,
          avatarUrl: undefined,
          dishName: payload.title,
          description: payload.description,
          portions: payload.quantity,
          distanceKm: 0.5,
          dietaryTags: payload.dietaryTags?.split(",").map((tag: string) => tag.trim()).filter(Boolean) ?? [],
          allergens: payload.allergens?.split(",").map((tag: string) => tag.trim()).filter(Boolean) ?? [],
          pickupWindow: payload.pickupWindow,
          image: payload.image,
        });
        toast({ title: "Leftover shared", description: "Your leftover share has been posted!" });
      }
      await loadData();
    } catch (error) {
      console.error("Error creating post:", error);
      toast({ title: "Unable to create post", description: "Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8">
      <XPBoostBanner />
      <PostComposer onCreate={handleCreate} />
      <SurplusFilterBar
        onFilterChange={(value) => {
          setFilter(value);
          loadData(value);
        }}
      />
      {loading ? (
        <p className="text-sm text-gray-500 animate-pulse">Loading community feed...</p>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {feed.map((post) => (
            <CommunityFeedCard key={post.id} post={post} onClaim={handleClaim} />
          ))}
        </div>
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <CommunityImpactStats impact={impact} />
        <ImpactTrendChart data={impact?.weeklyTrend ?? []} />
      </motion.div>
    </div>
  );
}

