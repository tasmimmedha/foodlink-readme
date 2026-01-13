"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CommunityKitchenEvent, KitchenVolunteer } from "@/lib/server/db";
import { motion } from "framer-motion";
import { Clock, MapPin, Users } from "lucide-react";
import { VolunteerButton } from "./VolunteerButton";
import { SocialAvatars } from "./SocialAvatars";

interface KitchenEventCardProps {
  event: CommunityKitchenEvent;
  onVolunteer: (eventId: string) => Promise<void> | void;
}

export function KitchenEventCard({ event, onVolunteer }: KitchenEventCardProps) {
  const progress = Math.min((event.volunteers.length / event.volunteersNeeded) * 100, 100);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-none bg-white/80 dark:bg-gray-900/60 shadow-xl shadow-emerald-100/40 dark:shadow-emerald-900/40 hover:-translate-y-1 hover:shadow-2xl transition">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-emerald-400">{event.status}</p>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{event.title}</h3>
            </div>
            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">{`${event.foodSavedKg} kg saved`}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-sm text-gray-600 dark:text-gray-300">{event.description}</p>
          <div className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-500" />
              {new Date(event.date).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}{" "}
              at {event.time}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-500" />
              {event.location}
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-500" />
              {`${event.volunteers.length}/${event.volunteersNeeded} volunteers`}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase text-gray-400 tracking-wide">Volunteer Progress</p>
              <p className="text-xs font-semibold text-emerald-500">{Math.round(progress)}%</p>
            </div>
            <div className="h-2 rounded-full bg-emerald-100 dark:bg-emerald-900/40 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <SocialAvatars
            avatars={event.volunteers.map((volunteer: KitchenVolunteer) => ({
              id: volunteer.id,
              src: volunteer.avatarUrl,
              initials: volunteer.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2),
            }))}
          />

          <div className="flex flex-wrap gap-3 pt-2">
            {event.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-200 px-3 py-1 text-xs font-semibold shadow-inner"
              >
                {tag}
              </span>
            ))}
          </div>

          <VolunteerButton onVolunteer={() => onVolunteer(event.id)} />
        </CardContent>
      </Card>
    </motion.div>
  );
}

