import { apiGet, apiPost, apiPatch } from "@/lib/api-client";

export interface Notification {
  id: string;
  type: "expiry" | "waste" | "community" | "system";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export async function getNotifications(): Promise<Notification[]> {
  return apiGet<Notification[]>("/notifications");
}

export async function markNotificationAsRead(id: string): Promise<void> {
  return apiPatch<void>(`/notifications/${id}/read`, {});
}

export async function markAllNotificationsAsRead(): Promise<void> {
  return apiPost<void>("/notifications/read-all", {});
}

export async function getUnreadCount(): Promise<number> {
  const notifications = await getNotifications();
  return notifications.filter((n) => !n.read).length;
}

