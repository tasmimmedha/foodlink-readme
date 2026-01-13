"use client";

import { useEffect, useState } from "react";
import { addLeftoverShare, claimLeftoverItem, getLeftoverItems } from "@/lib/server/community.server";
import { LeftoverItem } from "@/lib/server/db";
import { LeftoverItemCard } from "@/components/community/LeftoverItemCard";
import { PostComposer } from "@/components/community/PostComposer";
import { useUserStore } from "@/store/user.store";

export default function CommunityLeftoversPage() {
  const { user } = useUserStore();
  const [items, setItems] = useState<LeftoverItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    setItems(await getLeftoverItems());
    setLoading(false);
  };

  const handleCreate = async (values: any) => {
    if (!user) return;
    await addLeftoverShare({
      userId: user.id,
      userName: user.name,
      avatarUrl: undefined,
      dishName: values.title,
      description: values.description,
      portions: values.quantity,
      distanceKm: 0.6,
      dietaryTags: values.dietaryTags?.split(",").map((tag: string) => tag.trim()).filter(Boolean) ?? [],
      allergens: values.allergens?.split(",").map((tag: string) => tag.trim()).filter(Boolean) ?? [],
      pickupWindow: values.pickupWindow,
      image: values.image,
    });
    await loadItems();
  };

  const handleClaim = async (itemId: string) => {
    if (!user) return;
    await claimLeftoverItem({ itemId, userId: user.id, userName: user.name });
    await loadItems();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold mb-1">Leftover Exchange</h1>
        <p className="text-gray-500">Share cooked meals and rescue portions nearby.</p>
      </div>
      <PostComposer onCreate={(values) => handleCreate({ ...values, type: "leftover" })} />
      {loading ? (
        <p className="text-sm text-gray-500">Loading exchange board...</p>
      ) : (
        <div className="space-y-5">
          {items.map((item) => (
            <LeftoverItemCard key={item.id} item={item} onClaim={handleClaim} />
          ))}
        </div>
      )}
    </div>
  );
}

