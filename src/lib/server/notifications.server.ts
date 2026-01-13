import { db, CommunityNotification } from "./db";
import { delay, generateId, getTimestamp } from "./helpers";

const NETWORK_DELAY = 150;

export async function getNotifications(userId: string): Promise<CommunityNotification[]> {
  await delay(NETWORK_DELAY);
  if (!userId) {
    return [];
  }

  const notifications = await db.notifications.where("userId").equals(userId).toArray();
  return notifications.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function markAsRead(notificationId: string): Promise<void> {
  await delay(NETWORK_DELAY);
  const notification = await db.notifications.get(notificationId);
  if (!notification) return;
  await db.notifications.put({
    ...notification,
    read: true,
  });
}

export interface NotificationInput {
  userId: string;
  title: string;
  message: string;
  type: CommunityNotification["type"];
}

export async function addNotification(input: NotificationInput): Promise<CommunityNotification> {
  await delay(NETWORK_DELAY);
  const notification: CommunityNotification = {
    id: generateId(),
    ...input,
    read: false,
    createdAt: getTimestamp(),
  };
  await db.notifications.add(notification);
  return notification;
}

