"use client";

import { useEffect, useState } from "react";
import { CommunityNotification } from "@/lib/server/db";
import { getNotifications, markAsRead } from "@/lib/server/notifications.server";
import { useUserStore } from "@/store/user.store";
import { NotificationItem } from "@/components/community/NotificationItem";

export default function CommunityMessagesPage() {
  const { user } = useUserStore();
  const [notifications, setNotifications] = useState<CommunityNotification[]>([]);

  useEffect(() => {
    if (!user) return;
    loadNotifications(user.id);
  }, [user]);

  const loadNotifications = async (userId: string) => {
    setNotifications(await getNotifications(userId));
  };

  const handleRead = async (id: string) => {
    await markAsRead(id);
    if (user) {
      await loadNotifications(user.id);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Community Inbox</h1>
        <p className="text-gray-500">Claim approvals, volunteer reminders, and admin updates.</p>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} onMarkRead={handleRead} />
        ))}
        {notifications.length === 0 && <p className="text-sm text-gray-500">No notifications yet.</p>}
      </div>
    </div>
  );
}

