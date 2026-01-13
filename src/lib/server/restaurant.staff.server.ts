import { db, ShiftScheduleEntry, StaffTask } from "./db";
import { delay } from "./helpers";
import { ensureRestaurantSeeded } from "./restaurant.seed";

const NETWORK_DELAY = 150;

export async function getStaffTasks(): Promise<StaffTask[]> {
  await delay(NETWORK_DELAY);
  await ensureRestaurantSeeded();
  return db.restaurantStaffTasks.toArray();
}

export async function toggleTask(taskId: string): Promise<StaffTask | null> {
  await delay(NETWORK_DELAY);
  await ensureRestaurantSeeded();
  const task = await db.restaurantStaffTasks.get(taskId);
  if (!task) return null;
  const updated: StaffTask = { ...task, completed: !task.completed };
  await db.restaurantStaffTasks.put(updated);
  return updated;
}

export async function getShiftSchedule(): Promise<ShiftScheduleEntry[]> {
  await delay(NETWORK_DELAY);
  await ensureRestaurantSeeded();
  return db.restaurantShiftSchedule.toArray();
}

