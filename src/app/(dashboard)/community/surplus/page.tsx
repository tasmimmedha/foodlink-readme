"use client";

import { useEffect, useState, useTransition } from "react";
import {
  addSurplusPost,
  getCommunityFeed,
  updateSurplusPostStatus,
} from "@/lib/server/community.server";
import { CommunitySurplusPost } from "@/lib/server/db";
import { SurplusFilterBar } from "@/components/community/SurplusFilterBar";
import { PostComposer } from "@/components/community/PostComposer";
import { SurplusPostCard } from "@/components/community/SurplusPostCard";
import { useUserStore } from "@/store/user.store";

export default function CommunitySurplusPage() {
  const { user } = useUserStore();
  const [posts, setPosts] = useState<CommunitySurplusPost[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [_pending, startTransition] = useTransition();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async (filterValue = filter) => {
    setLoading(true);
    const data = await getCommunityFeed(
      filterValue === "all" ? undefined : { categories: [filterValue], status: ["available", "claimed"] }
    );
    setPosts(data);
    setLoading(false);
  };

  const handleStatusChange = (postId: string, status: CommunitySurplusPost["status"]) => {
    startTransition(async () => {
      await updateSurplusPostStatus(postId, status);
      await loadPosts();
    });
  };

  const handleCreate = async (values: any) => {
    if (!user) return;
    await addSurplusPost({
      userId: user.id,
      userName: user.name,
      avatarUrl: undefined,
      title: values.title,
      description: values.description,
      category: values.category,
      tags: values.category.split(",").map((tag: string) => tag.trim()),
      quantity: values.quantity,
      unit: values.unit,
      pickupWindow: { start: values.pickupWindow.split("-")[0]?.trim() ?? "12:00", end: values.pickupWindow.split("-")[1]?.trim() ?? "18:00" },
      pickupLocation: "Community Hub",
      distanceKm: 0.3,
      image: values.image,
    });
    await loadPosts();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold mb-1">Surplus Sharing</h1>
        <p className="text-gray-500">List your extra groceries and see what neighbors shared.</p>
      </div>
      <PostComposer onCreate={(values) => handleCreate({ ...values, type: "surplus" })} />
      <SurplusFilterBar
        onFilterChange={(value) => {
          setFilter(value);
          loadPosts(value);
        }}
      />
      {loading ? (
        <p className="text-sm text-gray-500">Loading surplus board...</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <SurplusPostCard key={post.id} post={post} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </div>
  );
}

