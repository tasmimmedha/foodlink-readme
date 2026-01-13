"use client";

import { useState } from "react";
import { PickupCalendar } from "@/components/ngo/PickupCalendar";
import { VolunteerAssignModal } from "@/components/ngo/VolunteerAssignModal";
import {
  useNgoPickups,
  useNgoOffers,
  usePickupStatusUpdate,
  useSchedulePickup,
  useRouteEstimate,
} from "@/hooks/use-query-ngo";
import { NGOPickupSchedule } from "@/lib/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Clock3, Navigation } from "lucide-react";

export default function NGOPickupsPage() {
  const { data: pickups } = useNgoPickups();
  const { data: offers } = useNgoOffers();
  const updatePickup = usePickupStatusUpdate();
  const schedulePickup = useSchedulePickup();
  const routeEstimate = useRouteEstimate();
  const [modalPickup, setModalPickup] = useState<NGOPickupSchedule | null>(null);

  const handleStatusChange = async (pickup: NGOPickupSchedule, status: NGOPickupSchedule["status"]) => {
    try {
      await updatePickup.mutateAsync({ pickupId: pickup.id, status });
      toast({ title: "Status updated", description: `Pickup marked as ${status}.` });
    } catch {
      toast({ title: "Unable to update status", variant: "destructive" });
    }
  };

  const handleRoutePreview = async (pickup: NGOPickupSchedule) => {
    const result = await routeEstimate.mutateAsync([pickup.id]);
    toast({
      title: "Route estimate",
      description: `${result.totalDistanceKm} km • ${result.totalDurationMinutes} mins`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white/80 p-4 shadow-lg dark:border-slate-800 dark:bg-slate-900/70 lg:flex-row lg:items-center">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wide text-slate-400">Pickup timeline</p>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{pickups?.length ?? 0} active pickups</h2>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            className="gap-2" 
            onClick={async () => {
              if (!pickups || pickups.length === 0) {
                toast({ title: "No pickups to optimize", variant: "destructive" });
                return;
              }
              try {
                const result = await routeEstimate.mutateAsync(pickups.map((p) => p.id));
                toast({
                  title: "Routes optimized",
                  description: `Total distance: ${result.totalDistanceKm}km • Duration: ${result.totalDurationMinutes} mins`,
                });
              } catch {
                toast({ title: "Unable to optimize routes", variant: "destructive" });
              }
            }}
            disabled={routeEstimate.isPending || !pickups || pickups.length === 0}
          >
            <Navigation className="h-4 w-4" />
            Optimize routes
          </Button>
        </div>
      </div>

      <PickupCalendar
        pickups={pickups ?? []}
        offers={offers}
        onStatusChange={handleStatusChange}
        onRoutePreview={handleRoutePreview}
        onAssign={(pickup) => setModalPickup(pickup)}
      />

      <Card className="rounded-3xl border-slate-100 bg-white/80 shadow-lg dark:border-slate-800 dark:bg-slate-900/70">
        <CardContent className="flex flex-wrap items-center gap-4 p-5">
          <Clock3 className="h-5 w-5 text-amber-500" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Reminder cadence</p>
            <p className="text-xs text-slate-500">
              2h and 30m before pickup, escalation to ops lead if volunteer hasn’t checked in.
            </p>
          </div>
          <Button variant="ghost">Edit reminders</Button>
        </CardContent>
      </Card>

      <VolunteerAssignModal
        open={Boolean(modalPickup)}
        pickupId={modalPickup?.id}
        defaultValues={{
          volunteerName: modalPickup?.volunteerName ?? "Route Crew",
          volunteerContact: modalPickup?.volunteerContact ?? "+880 1700-123456",
          scheduledFor: modalPickup?.scheduledFor
            ? modalPickup.scheduledFor.slice(0, 16)
            : new Date().toISOString().slice(0, 16),
          vehicleType: modalPickup?.vehicleType ?? "van",
        }}
        onClose={() => setModalPickup(null)}
        onSubmit={async (payload) => {
          if (!modalPickup) return;
          try {
            await schedulePickup.mutateAsync({
              offerId: modalPickup.offerId,
              volunteerName: payload.volunteerName,
              volunteerContact: payload.volunteerContact,
              scheduledFor: payload.scheduledFor,
              vehicleType: payload.vehicleType,
              notes: payload.notes,
            });
            toast({ title: "Pickup scheduled", description: `Assigned to ${payload.volunteerName}.` });
            setModalPickup(null);
          } catch {
            toast({ title: "Unable to schedule pickup", variant: "destructive" });
          }
        }}
        isSubmitting={schedulePickup.isPending}
      />
    </div>
  );
}


