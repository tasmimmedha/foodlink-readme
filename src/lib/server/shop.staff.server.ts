import { db, ShopStaffMember, ShopStaffTask, ShopShift } from "./db";
import { delay, generateId, getTimestamp } from "./helpers";
import { ensureShopSeedData } from "./shop.seed";

const MIN_LATENCY = 150;
const MAX_LATENCY = 230;

export interface AddTaskInput {
  title: string;
  description: string;
  assigneeId: string;
  due: string;
  category: ShopStaffTask["category"];
  priority: ShopStaffTask["priority"];
}

export interface UpdateShiftInput extends Partial<Omit<ShopShift, "id" | "staffId">> {
  staffId?: string;
}

function randomLatency() {
  return MIN_LATENCY + Math.random() * (MAX_LATENCY - MIN_LATENCY);
}

async function simulateLatency() {
  await delay(randomLatency());
}

async function withSeededData<T>(fn: () => Promise<T>): Promise<T> {
  await ensureShopSeedData();
  return fn();
}

export async function getStaff(): Promise<ShopStaffMember[]> {
  return withSeededData(async () => {
    await simulateLatency();
    return db.shopStaff.toArray();
  });
}

export async function getStaffTasks(): Promise<ShopStaffTask[]> {
  return withSeededData(async () => {
    await simulateLatency();
    return db.shopStaffTasks.toArray();
  });
}

export async function addTask(input: AddTaskInput): Promise<ShopStaffTask> {
  return withSeededData(async () => {
    await simulateLatency();
    const record: ShopStaffTask = {
      id: generateId(),
      title: input.title,
      description: input.description,
      assigneeId: input.assigneeId,
      due: input.due,
      completed: false,
      category: input.category,
      priority: input.priority,
    };
    await db.shopStaffTasks.add(record);
    return record;
  });
}

export async function toggleTask(taskId: string): Promise<ShopStaffTask> {
  return withSeededData(async () => {
    await simulateLatency();
    const record = await db.shopStaffTasks.get(taskId);
    if (!record) throw new Error("Task not found");
    const updated: ShopStaffTask = {
      ...record,
      completed: !record.completed,
    };
    await db.shopStaffTasks.put(updated);
    return updated;
  });
}

export async function getShifts(): Promise<ShopShift[]> {
  return withSeededData(async () => {
    await simulateLatency();
    return db.shopShifts.toArray();
  });
}

export async function updateShift(shiftId: string, updates: UpdateShiftInput): Promise<ShopShift> {
  return withSeededData(async () => {
    await simulateLatency();
    const record = await db.shopShifts.get(shiftId);
    if (!record) throw new Error("Shift not found");
    const updated: ShopShift = {
      ...record,
      ...updates,
      staffId: updates.staffId ?? record.staffId,
      startTime: updates.startTime ?? record.startTime,
      endTime: updates.endTime ?? record.endTime,
      station: updates.station ?? record.station,
      notes: updates.notes ?? record.notes,
    };
    await db.shopShifts.put(updated);
    return updated;
  });
}


