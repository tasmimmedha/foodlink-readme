"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { PhoneCall, Send, CalendarClock, MessageCircle, MapPinned } from "lucide-react";

interface QuickActionsToolbarProps {
  onAcceptOffer?: () => void;
  onRequestPickup?: () => void;
  onMessageDonor?: () => void;
  onOpenMap?: () => void;
}

const actions = [
  { label: "Accept offer", icon: PhoneCall, key: "accept" },
  { label: "Request pickup", icon: CalendarClock, key: "pickup" },
  { label: "Message donor", icon: MessageCircle, key: "message" },
  { label: "Route map", icon: MapPinned, key: "map" },
];

export function QuickActionsToolbar({ onAcceptOffer, onMessageDonor, onOpenMap, onRequestPickup }: QuickActionsToolbarProps) {
  const handlers: Record<string, (() => void) | undefined> = {
    accept: onAcceptOffer,
    pickup: onRequestPickup,
    message: onMessageDonor,
    map: onOpenMap,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-3 rounded-3xl border border-slate-100 bg-white/80 p-4 shadow-lg shadow-slate-100/60 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-black/30"
    >
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Button
            key={action.key}
            variant="outline"
            size="sm"
            className="gap-2 rounded-2xl border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200"
            onClick={() => handlers[action.key]?.()}
          >
            <Icon className="h-4 w-4" />
            {action.label}
          </Button>
        );
      })}
      <Button size="sm" className="ml-auto rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-400 text-white shadow-lg">
        <Send className="mr-2 h-4 w-4" />
        Share impact
      </Button>
    </motion.div>
  );
}


