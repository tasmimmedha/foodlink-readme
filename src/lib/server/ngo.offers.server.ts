import { db, NGODonationOffer, NGONotification } from "./db";
import { delay, generateId, getTimestamp } from "./helpers";
import { ensureNgoSeedData } from "./ngo.seed";

const MIN_LATENCY = 120;
const MAX_LATENCY = 250;

function randomLatency() {
  return MIN_LATENCY + Math.random() * (MAX_LATENCY - MIN_LATENCY);
}

async function simulateLatency() {
  await delay(randomLatency());
}

async function withSeededData<T>(fn: () => Promise<T>): Promise<T> {
  await ensureNgoSeedData();
  return fn();
}

async function addNotification(input: Omit<NGONotification, "id" | "createdAt">) {
  const now = getTimestamp();
  await db.ngoNotifications.add({
    ...input,
    id: generateId(),
    createdAt: now,
  });
}

export type OfferQuery = {
  status?: NGODonationOffer["status"];
  urgency?: NGODonationOffer["urgencyLevel"];
  search?: string;
};

export interface AddOfferInput {
  donorName: string;
  donorType: NGODonationOffer["donorType"];
  distanceKm: number;
  locationLabel: string;
  offerTitle: string;
  items: NGODonationOffer["items"];
  weightKg: number;
  mealsEstimated: number;
  freshnessScore?: number;
  pickupWindow: NGODonationOffer["pickupWindow"];
  expiresAt: string;
  urgencyLevel: NGODonationOffer["urgencyLevel"];
  dietaryNotes?: string;
  safetyFlags?: string[];
  contact: NGODonationOffer["contact"];
  images?: string[];
  matchReason: string;
}

export interface UpdateOfferStatusInput {
  status: NGODonationOffer["status"];
  schedulePickup?: boolean;
  pickupTime?: string;
  assignedVolunteer?: string;
}

export async function getOffers(query?: OfferQuery): Promise<NGODonationOffer[]> {
  return withSeededData(async () => {
    await simulateLatency();
    let offers = await db.ngoOffers.toArray();

    if (query?.status) {
      offers = offers.filter((offer) => offer.status === query.status);
    }

    if (query?.urgency) {
      offers = offers.filter((offer) => offer.urgencyLevel === query.urgency);
    }

    if (query?.search) {
      const term = query.search.toLowerCase();
      offers = offers.filter(
        (offer) =>
          offer.donorName.toLowerCase().includes(term) ||
          offer.offerTitle.toLowerCase().includes(term) ||
          offer.locationLabel.toLowerCase().includes(term)
      );
    }

    // Sort urgent first, then by freshness
    return offers.sort((a, b) => {
      const urgencyWeight = { high: 3, medium: 2, low: 1 };
      if (urgencyWeight[b.urgencyLevel] !== urgencyWeight[a.urgencyLevel]) {
        return urgencyWeight[b.urgencyLevel] - urgencyWeight[a.urgencyLevel];
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  });
}

export async function getOfferDetail(offerId: string): Promise<NGODonationOffer | null> {
  return withSeededData(async () => {
    await simulateLatency();
    return db.ngoOffers.get(offerId) ?? null;
  });
}

export async function addOffer(input: AddOfferInput): Promise<NGODonationOffer> {
  return withSeededData(async () => {
    await simulateLatency();
    const now = getTimestamp();
    const record: NGODonationOffer = {
      ...input,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
      freshnessScore: input.freshnessScore ?? 85,
      images: input.images ?? [],
      status: "pending",
      partnerId: undefined,
      geoPoint: undefined,
    };
    await db.ngoOffers.add(record);
    await addNotification({
      type: input.urgencyLevel === "high" ? "urgent-offer" : "message",
      title: `${input.offerTitle} ready from ${input.donorName}`,
      description: `Pickup window ${new Date(input.pickupWindow.start).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })} - ${new Date(input.pickupWindow.end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      relatedEntityId: record.id,
      severity: input.urgencyLevel === "high" ? "critical" : "info",
      read: false,
    });
    return record;
  });
}

export async function updateOfferStatus(
  offerId: string,
  input: UpdateOfferStatusInput
): Promise<NGODonationOffer> {
  return withSeededData(async () => {
    await simulateLatency();
    const existing = await db.ngoOffers.get(offerId);
    if (!existing) {
      throw new Error("Offer not found");
    }
    const updated: NGODonationOffer = {
      ...existing,
      status: input.status,
      updatedAt: getTimestamp(),
    };
    await db.ngoOffers.put(updated);

    if (input.status === "accepted") {
      await addNotification({
        type: "pickup",
        title: `Schedule pickup for ${existing.offerTitle}`,
        description: `${existing.donorName} accepted. Assign crew.`,
        relatedEntityId: offerId,
        severity: "info",
        read: false,
      });
    }

    if (input.status === "declined") {
      await addNotification({
        type: "message",
        title: `Declined ${existing.offerTitle}`,
        description: "Let donor know reasoning if needed.",
        relatedEntityId: offerId,
        severity: "info",
        read: false,
      });
    }

    return updated;
  });
}


