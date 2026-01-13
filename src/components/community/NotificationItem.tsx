"use client";

import { CommunityNotification } from "@/lib/server/db";
import { motion } from "framer-motion";
import { BellRing, CheckCircle2, MailOpen } from "lucide-react";
import { cn } from "@/lib/helpers";

interface NotificationItemProps {
  notification: CommunityNotification;
  onMarkRead?: (id: string) => void;
}

const ICON_MAP: Record<CommunityNotification["type"], React.ElementType> = {
  claim: CheckCircle2,
  volunteer: BellRing,
  announcement: MailOpen,
  surplus: BellRing,
  reminder: BellRing,
};

export function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
  const Icon = ICON_MAP[notification.type] ?? BellRing;

  return (
    <motion.button
      type="button"
      onClick={() => onMarkRead?.(notification.id)}
      className={cn(
        "w-full text-left rounded-2xl border px-4 py-3 flex items-start gap-3 shadow-sm transition bg-white/90 dark:bg-gray-900/70",
        notification.read ? "border-transparent opacity-70" : "border-emerald-100 shadow-emerald-100/60"
      )}
    >
      <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-sm font-semibold">{notification.title}</p>
        <p className="text-xs text-gray-500">{notification.message}</p>
        <p className="text-[11px] text-gray-400 mt-1">
          {new Date(notification.createdAt).toLocaleString(undefined, { hour: "numeric", minute: "2-digit" })}
        </p>
      </div>
      {!notification.read && <span className="ml-auto mt-1 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}
    </motion.button>
  );
}

