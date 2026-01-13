import { db, NGOPickupSchedule, NGODonationOffer } from "./db";
import { delay, generateId, getTimestamp } from "./helpers";
import { ensureNgoSeedData } from "./ngo.seed";

const MIN_LATENCY = 120;
const MAX_LATENCY = 260;

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

async function touchOfferStatus(offerId: string, status: NGODonationOffer["status"]) {
  await db.ngoOffers.where("id").equals(offerId).modify((offer) => {
    offer.status = status;
    offer.updatedAt = getTimestamp();
  });
}

export interface PickupRange {
  start?: string;
  end?: string;
}

export interface SchedulePickupInput {
  offerId: string;
  scheduledFor: string;
  volunteerName: string;
  volunteerContact: string;
  vehicleType: NGOPickupSchedule["vehicleType"];
  notes?: string;
}

export interface RouteEstimate {
  totalDistanceKm: number;
  totalDurationMinutes: number;
  waypoints: {
    pickupId: string;
    etaMinutes: number;
    distanceKm: number;
  }[];
}

export async function getPickups(range?: PickupRange): Promise<NGOPickupSchedule[]> {
  return withSeededData(async () => {
    await simulateLatency();
    let pickups = await db.ngoPickups.toArray();

    if (range?.start) {
      const startTs = new Date(range.start).getTime();
      pickups = pickups.filter((p) => new Date(p.scheduledFor).getTime() >= startTs);
    }
    if (range?.end) {
      const endTs = new Date(range.end).getTime();
      pickups = pickups.filter((p) => new Date(p.scheduledFor).getTime() <= endTs);
    }

    return pickups.sort(
      (a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
    );
  });
}

export async function schedulePickup(input: SchedulePickupInput): Promise<NGOPickupSchedule> {
  return withSeededData(async () => {
    await simulateLatency();
    const now = getTimestamp();
    const pickup: NGOPickupSchedule = {
      id: generateId(),
      offerId: input.offerId,
      scheduledFor: input.scheduledFor,
      etaMinutes: 45,
      volunteerName: input.volunteerName,
      volunteerContact: input.volunteerContact,
      vehicleType: input.vehicleType,
      status: "scheduled",
      checkpoints: [
        { label: "Depart", status: "pending" },
        { label: "Arrive donor", status: "pending" },
        { label: "Return", status: "pending" },
      ],
      reminders: [
        { time: input.scheduledFor, type: "info", delivered: false },
        { time: new Date(new Date(input.scheduledFor).getTime() - 30 * 60 * 1000).toISOString(), type: "warning", delivered: false },
      ],
      notes: input.notes,
      routeId: undefined,
      createdAt: now,
      updatedAt: now,
    };
    await db.ngoPickups.add(pickup);
    await touchOfferStatus(input.offerId, "scheduled");
    return pickup;
  });
}

export async function updatePickupStatus(
  pickupId: string,
  status: NGOPickupSchedule["status"]
): Promise<NGOPickupSchedule> {
  return withSeededData(async () => {
    await simulateLatency();
    const existing = await db.ngoPickups.get(pickupId);
    if (!existing) throw new Error("Pickup not found");

    const updated: NGOPickupSchedule = {
      ...existing,
      status,
      updatedAt: getTimestamp(),
    };
    await db.ngoPickups.put(updated);

    if (status === "picked-up") {
      await touchOfferStatus(existing.offerId, "completed");
    }

    return updated;
  });
}

export async function estimateRoute(pickupIds: string[]): Promise<RouteEstimate> {
  return withSeededData(async () => {
    await simulateLatency();
    const pickups = await db.ngoPickups.bulkGet(pickupIds);
    const valid = pickups.filter((p): p is NGOPickupSchedule => Boolean(p));
    const totalDistance = valid.reduce((sum, pickup) => sum + Math.max(pickup.etaMinutes / 4, 3), 0);
    const totalDuration = valid.reduce((sum, pickup) => sum + pickup.etaMinutes, 0);

    return {
      totalDistanceKm: Number(totalDistance.toFixed(1)),
      totalDurationMinutes: totalDuration,
      waypoints: valid.map((pickup, index) => ({
        pickupId: pickup.id,
        etaMinutes: 20 + index * 15,
        distanceKm: Number((3 + index * 0.8).toFixed(1)),
      })),
    };
  });
}


