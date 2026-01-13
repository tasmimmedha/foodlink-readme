import {
  db,
  CommunitySurplusPost,
  LeftoverItem,
  CommunityKitchenEvent,
  CommunityLeaderboard,
  CommunityImpact,
  KitchenVolunteer,
} from "./db";
import { delay, generateId, getTimestamp } from "./helpers";

const NETWORK_DELAY = 180;

export interface SurplusPostInput {
  userId: string;
  userName: string;
  avatarUrl?: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  quantity: number;
  unit: string;
  pickupWindow: {
    start: string;
    end: string;
  };
  pickupLocation: string;
  distanceKm?: number;
  image?: string;
}

export interface LeftoverShareInput {
  userId: string;
  userName: string;
  avatarUrl?: string;
  dishName: string;
  description: string;
  portions: number;
  dietaryTags: string[];
  allergens: string[];
  pickupWindow: string;
  distanceKm: number;
  image?: string;
}

export interface VolunteerInput extends KitchenVolunteer {}

export async function getCommunityFeed(filters?: {
  categories?: string[];
  status?: Array<CommunitySurplusPost["status"]>;
}): Promise<CommunitySurplusPost[]> {
  await delay(NETWORK_DELAY);
  let posts = await db.communitySurplusPosts.toArray();

  if (filters?.categories?.length) {
    posts = posts.filter((post) => filters.categories?.includes(post.category));
  }

  if (filters?.status?.length) {
    posts = posts.filter((post) => filters.status?.includes(post.status));
  }

  return posts.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export async function addSurplusPost(input: SurplusPostInput): Promise<CommunitySurplusPost> {
  await delay(NETWORK_DELAY);
  const now = getTimestamp();
  const newPost: CommunitySurplusPost = {
    id: generateId(),
    ...input,
    status: "available",
    expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    requests: [],
    comments: [],
    createdAt: now,
    updatedAt: now,
  };

  await db.communitySurplusPosts.add(newPost);
  return newPost;
}

export async function updateSurplusPostStatus(
  postId: string,
  status: CommunitySurplusPost["status"]
): Promise<CommunitySurplusPost | null> {
  await delay(NETWORK_DELAY);
  const post = await db.communitySurplusPosts.get(postId);
  if (!post) return null;

  const updatedPost = {
    ...post,
    status,
    updatedAt: getTimestamp(),
  };

  await db.communitySurplusPosts.put(updatedPost);
  return updatedPost;
}

export async function getLeftoverItems(): Promise<LeftoverItem[]> {
  await delay(NETWORK_DELAY);
  const items = await db.leftoverItems.toArray();
  return items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function addLeftoverShare(input: LeftoverShareInput): Promise<LeftoverItem> {
  await delay(NETWORK_DELAY);
  const now = getTimestamp();
  const leftover: LeftoverItem = {
    id: generateId(),
    ...input,
    status: "available",
    claims: [],
    createdAt: now,
    updatedAt: now,
  };

  await db.leftoverItems.add(leftover);
  return leftover;
}

export async function claimLeftoverItem(params: {
  itemId: string;
  userId: string;
  userName: string;
  message?: string;
}): Promise<LeftoverItem | null> {
  await delay(NETWORK_DELAY);
  const item = await db.leftoverItems.get(params.itemId);
  if (!item) {
    return null;
  }

  const updatedItem: LeftoverItem = {
    ...item,
    claims: [
      ...item.claims,
      {
        id: generateId(),
        userId: params.userId,
        userName: params.userName,
        message: params.message,
        createdAt: getTimestamp(),
      },
    ],
    status: "claimed",
    updatedAt: getTimestamp(),
  };

  await db.leftoverItems.put(updatedItem);
  return updatedItem;
}

export async function getCommunityKitchenEvents(): Promise<CommunityKitchenEvent[]> {
  await delay(NETWORK_DELAY);
  const events = await db.communityKitchenEvents.toArray();
  return events.sort((a, b) => (a.date > b.date ? 1 : -1));
}

export async function volunteerForEvent(eventId: string, volunteer: VolunteerInput): Promise<CommunityKitchenEvent | null> {
  await delay(NETWORK_DELAY);
  const event = await db.communityKitchenEvents.get(eventId);
  if (!event) return null;

  const exists = event.volunteers.some((v) => v.userId === volunteer.userId);
  const updatedEvent: CommunityKitchenEvent = {
    ...event,
    volunteers: exists ? event.volunteers : [...event.volunteers, volunteer],
    updatedAt: getTimestamp(),
  };

  await db.communityKitchenEvents.put(updatedEvent);
  return updatedEvent;
}

export async function getLeaderboard(): Promise<CommunityLeaderboard[]> {
  await delay(NETWORK_DELAY);
  const leaderboard = await db.communityLeaderboard.toArray();
  return leaderboard;
}

export async function getCommunityImpact(): Promise<CommunityImpact | null> {
  await delay(NETWORK_DELAY);
  const impact = await db.communityImpact.toArray();
  return impact[0] ?? null;
}

