import { db, CommunityProfile } from "./db";
import { delay, generateId, getTimestamp } from "./helpers";

const NETWORK_DELAY = 160;

export async function getCommunityProfile(userId: string): Promise<CommunityProfile | null> {
  await delay(NETWORK_DELAY);
  if (!userId) return null;

  const profile = await db.communityProfiles.where("userId").equals(userId).first();
  if (profile) return profile;

  // Create a lightweight profile if missing
  const fallback: CommunityProfile = {
    id: generateId(),
    userId,
    username: "New Neighbor",
    communityRole: "member",
    preferredItems: [],
    avoidItems: [],
    dietaryRestrictions: [],
    allergens: [],
    acceptsHotMeals: true,
    distancePreference: "3km",
    visibility: "community",
    notificationsEnabled: true,
    notifyOnClaim: true,
    notifyOnMessages: true,
    createdAt: getTimestamp(),
    updatedAt: getTimestamp(),
  };

  await db.communityProfiles.add(fallback);
  return fallback;
}

export async function updateCommunityProfile(
  userId: string,
  updates: Partial<CommunityProfile>
): Promise<CommunityProfile | null> {
  await delay(NETWORK_DELAY);
  const existing = await getCommunityProfile(userId);
  if (!existing) return null;

  const updatedProfile: CommunityProfile = {
    ...existing,
    ...updates,
    updatedAt: getTimestamp(),
  };

  await db.communityProfiles.put(updatedProfile);
  return updatedProfile;
}

