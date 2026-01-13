import { db, NGONotification } from "./db";
import { delay, getTimestamp } from "./helpers";
import { ensureNgoSeedData } from "./ngo.seed";

const MIN_LATENCY = 110;
const MAX_LATENCY = 220;

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

export async function getNgoNotifications(): Promise<NGONotification[]> {
  return withSeededData(async () => {
    await simulateLatency();
    return (await db.ngoNotifications.toArray()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });
}

export async function markNotificationRead(id: string, read = true): Promise<void> {
  await withSeededData(async () => {
    await simulateLatency();
    await db.ngoNotifications.update(id, { read, createdAt: getTimestamp() });
  });
}

export async function clearNotifications(): Promise<void> {
  await withSeededData(async () => {
    await simulateLatency();
    await db.ngoNotifications.clear();
  });
}


