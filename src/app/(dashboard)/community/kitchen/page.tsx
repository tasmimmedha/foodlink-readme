"use client";

import { useEffect, useState } from "react";
import { CommunityKitchenEvent } from "@/lib/server/db";
import { getCommunityKitchenEvents, volunteerForEvent } from "@/lib/server/community.server";
import { KitchenEventCard } from "@/components/community/KitchenEventCard";
import { useUserStore } from "@/store/user.store";

export default function CommunityKitchenPage() {
  const { user } = useUserStore();
  const [events, setEvents] = useState<CommunityKitchenEvent[]>([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setEvents(await getCommunityKitchenEvents());
  };

  const handleVolunteer = async (eventId: string) => {
    if (!user) return;
    await volunteerForEvent(eventId, {
      id: user.id,
      userId: user.id,
      name: user.name,
      role: "Neighbor Volunteer",
      avatarUrl: undefined,
    });
    await loadEvents();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Community Kitchen</h1>
        <p className="text-gray-500">Join prep sessions, shared cooking, and impact shifts.</p>
      </div>
      <div className="grid gap-5">
        {events.map((event) => (
          <KitchenEventCard key={event.id} event={event} onVolunteer={handleVolunteer} />
        ))}
      </div>
    </div>
  );
}

