import { db, NGOFeedbackEntry } from "./db";
import { delay, getTimestamp } from "./helpers";
import { ensureNgoSeedData } from "./ngo.seed";

const MIN_LATENCY = 120;
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

export type FeedbackAction =
  | { type: "resolve"; note?: string }
  | { type: "flag-partner"; note: string }
  | { type: "acknowledge"; note?: string };

export async function getFeedbackQueue(): Promise<NGOFeedbackEntry[]> {
  return withSeededData(async () => {
    await simulateLatency();
    return (await db.ngoFeedback.toArray()).sort(
      (a, b) => new Date(b.deliveryDate).getTime() - new Date(a.deliveryDate).getTime()
    );
  });
}

export async function resolveFeedback(
  feedbackId: string,
  action: FeedbackAction
): Promise<NGOFeedbackEntry> {
  return withSeededData(async () => {
    await simulateLatency();
    const entry = await db.ngoFeedback.get(feedbackId);
    if (!entry) throw new Error("Feedback not found");

    let status: NGOFeedbackEntry["status"] = entry.status;
    if (action.type === "resolve") status = "resolved";
    if (action.type === "flag-partner") status = "acknowledged";
    if (action.type === "acknowledge") status = "acknowledged";

    const updated: NGOFeedbackEntry = {
      ...entry,
      status,
      correctiveAction: action.note,
      updatedAt: getTimestamp(),
    };
    await db.ngoFeedback.put(updated);
    return updated;
  });
}


