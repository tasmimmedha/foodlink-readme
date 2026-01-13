"use client";

import { useEffect, useState, useTransition } from "react";
import { CommunityProfile } from "@/lib/server/db";
import { getCommunityProfile, updateCommunityProfile } from "@/lib/server/communityProfile.server";
import { useUserStore } from "@/store/user.store";
import { CommunityProfileForm } from "@/components/community/CommunityProfileForm";

export default function CommunityProfilePage() {
  const { user } = useUserStore();
  const [profile, setProfile] = useState<CommunityProfile | null>(null);
  const [saving, startTransition] = useTransition();

  useEffect(() => {
    if (!user) return;
    loadProfile(user.id);
  }, [user]);

  const loadProfile = async (userId: string) => {
    setProfile(await getCommunityProfile(userId));
  };

  const handleSave = (values: any) => {
    if (!user) return;
    startTransition(async () => {
      const payload: Partial<CommunityProfile> = {
        username: values.username,
        communityRole: values.communityRole,
        bio: values.bio,
        preferredItems: values.preferredItems?.split(",").map((tag: string) => tag.trim()).filter(Boolean) ?? [],
        avoidItems: values.avoidItems?.split(",").map((tag: string) => tag.trim()).filter(Boolean) ?? [],
        dietaryRestrictions: values.dietaryRestrictions?.split(",").map((tag: string) => tag.trim()).filter(Boolean) ?? [],
        allergens: values.allergens?.split(",").map((tag: string) => tag.trim()).filter(Boolean) ?? [],
        acceptsHotMeals: values.acceptsHotMeals,
        distancePreference: values.distancePreference,
        visibility: values.visibility,
        notificationsEnabled: values.notificationsEnabled,
        notifyOnClaim: values.notifyOnClaim,
        notifyOnMessages: values.notifyOnMessages,
      };
      const updated = await updateCommunityProfile(user.id, payload);
      setProfile(updated);
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Community Profile</h1>
        <p className="text-gray-500">Fine-tune what you share and what you love receiving.</p>
      </div>
      <CommunityProfileForm profile={profile} onSave={handleSave} saving={saving} />
    </div>
  );
}

