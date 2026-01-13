"use client";

import { useMemo, useState } from "react";
import { NGODonationOffer, NGOPickupSchedule } from "@/lib/server";
import {
  useNgoOffers,
  useNgoHistory,
  useNgoCapacity,
  useNgoPickups,
  useOfferStatusUpdate,
  useSchedulePickup,
} from "@/hooks/use-query-ngo";
import { NGODashboardCard } from "@/components/ngo/NGODashboardCard";
import { OfferListItem } from "@/components/ngo/OfferListItem";
import { OfferDetailModal } from "@/components/ngo/OfferDetailModal";
import { VolunteerAssignModal } from "@/components/ngo/VolunteerAssignModal";
import { UrgentOfferBanner } from "@/components/ngo/UrgentOfferBanner";
import { MapPreviewCard } from "@/components/ngo/MapPreviewCard";
import { DonationHistoryTimeline } from "@/components/ngo/DonationHistoryTimeline";
import { SafetyChecklist } from "@/components/ngo/SafetyChecklist";
import { ImpactTrendChart } from "@/components/ngo/ImpactTrendChart";
import { ImpactKPI } from "@/components/ngo/ImpactKPI";
import { toast } from "@/components/ui/use-toast";
import { Loader2, PackageCheck, CalendarDays, UtensilsCrossed, Plane } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";

export default function NGODashboardPage() {
  const { data: offers, isLoading: loadingOffers } = useNgoOffers();
  const { data: history } = useNgoHistory();
  const { data: capacity } = useNgoCapacity();
  const { data: pickups } = useNgoPickups();
  const offerStatusMutation = useOfferStatusUpdate();
  const scheduleMutation = useSchedulePickup();

  const [detailOffer, setDetailOffer] = useState<NGODonationOffer | null>(null);
  const [assignOffer, setAssignOffer] = useState<NGODonationOffer | null>(null);

  const urgentOffer = useMemo(
    () => offers?.find((offer) => offer.urgencyLevel === "high" && offer.status === "pending"),
    [offers]
  );
  const pendingOffers = offers?.filter((offer) => offer.status === "pending") ?? [];
  const todaysPickups = useMemo(
    () =>
      (pickups ?? []).filter((pickup) => {
        const pickupDate = new Date(pickup.scheduledFor);
        const today = new Date();
        return pickupDate.toDateString() === today.toDateString();
      }),
    [pickups]
  );

  const handleAcceptClick = (offer: NGODonationOffer) => {
    setAssignOffer(offer);
  };

  const handleAssignSubmit = async (payload: { volunteerName: string; volunteerContact: string; scheduledFor: string; vehicleType: NGOPickupSchedule["vehicleType"]; notes?: string }) => {
    if (!assignOffer) return;
    try {
      await offerStatusMutation.mutateAsync({
        offerId: assignOffer.id,
        data: { status: "accepted" },
      });
      await scheduleMutation.mutateAsync({
        offerId: assignOffer.id,
        volunteerName: payload.volunteerName,
        volunteerContact: payload.volunteerContact,
        scheduledFor: payload.scheduledFor,
        vehicleType: payload.vehicleType,
        notes: payload.notes,
      });
      toast({
        title: "Pickup scheduled",
        description: `${assignOffer.offerTitle} routed with ${payload.volunteerName}`,
      });
      setAssignOffer(null);
    } catch {
      toast({
        title: "Unable to schedule",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    }
  };

  const checklistItems = [
    { id: "temp", label: "Log temperature on pickup", checked: true },
    { id: "allergens", label: "Confirm allergen labels", checked: false },
    { id: "volunteer", label: "Volunteer has PPE kit", checked: true },
  ];

  const impactTrendData =
    history?.summary.monthlyTrend.map((point) => ({
      label: point.label,
      kg: point.kg,
      meals: point.meals,
    })) ?? [];

  return (
    <div className="space-y-8">
      <PageHeader
        title="NGO Dashboard"
        description="Manage donations, coordinate food distribution, and track impact metrics."
      />
      <div className="grid gap-4 md:grid-cols-4">
        <NGODashboardCard
          title="Capacity used"
          value={`${capacity?.currentUtilizationKg ?? 11} kg`}
          sublabel={`of ${capacity?.dailyCapacityKg ?? 18} kg`}
          icon={PackageCheck}
          trend={{
            direction: "up",
            value: "+2.3kg",
            label: "vs yesterday",
          }}
          progress={(capacity?.currentUtilizationKg ?? 11) / (capacity?.dailyCapacityKg ?? 18)}
        />
        <NGODashboardCard
          title="Today's pickups"
          value={todaysPickups.length}
          sublabel="scheduled routes"
          icon={CalendarDays}
          trend={{
            direction: "up",
            value: "+1 route",
          }}
        />
        <NGODashboardCard
          title="Pending offers"
          value={pendingOffers.length}
          sublabel="awaiting action"
          icon={Plane}
          trend={{
            direction: "down",
            value: "-2 vs 24h",
          }}
        />
        <NGODashboardCard
          title="Meals expected"
          value={
            pendingOffers.reduce((sum, offer) => sum + offer.mealsEstimated, 0) +
            (todaysPickups.length > 0
              ? todaysPickups.reduce((sum, pickup) => {
                  const linked = offers?.find((offer) => offer.id === pickup.offerId);
                  return sum + (linked?.mealsEstimated ?? 0);
                }, 0)
              : 0)
          }
          sublabel="today"
          icon={UtensilsCrossed}
          trend={{
            direction: "up",
            value: "+14 meals",
          }}
        />
      </div>

      {urgentOffer && (
        <UrgentOfferBanner
          offer={urgentOffer}
          onAccept={handleAcceptClick}
          onView={(offer) => setDetailOffer(offer)}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Incoming offers</h3>
            {loadingOffers && <Loader2 className="h-5 w-5 animate-spin text-slate-400" />}
          </div>
          <div className="space-y-3">
            {pendingOffers.slice(0, 3).map((offer) => (
              <OfferListItem
                key={offer.id}
                offer={offer}
                onAccept={handleAcceptClick}
                onDecline={(of) =>
                  offerStatusMutation.mutate({ offerId: of.id, data: { status: "declined" } })
                }
                onRequestInfo={(of) => setDetailOffer(of)}
                onViewDetail={(of) => setDetailOffer(of)}
              />
            ))}
            {pendingOffers.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-300">No pending offers right now.</p>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <MapPreviewCard offer={detailOffer ?? pendingOffers[0]} onOpenMap={(offer) => setDetailOffer(offer)} />
          <SafetyChecklist items={checklistItems} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent history</h3>
          </div>
          <DonationHistoryTimeline entries={(history?.entries ?? []).slice(0, 4)} onSelect={(entry) => toast({ title: entry.donorName, description: entry.itemsSummary })} />
        </div>
        <div className="space-y-4">
          <ImpactTrendChart data={impactTrendData} />
          <div className="grid gap-3 md:grid-cols-2">
            <ImpactKPI label="CO₂ prevented" value={`${history?.summary.totalCo2 ?? 52}kg`} sublabel="This month" />
            <ImpactKPI label="Beneficiaries" value={history?.summary.beneficiaries ?? 108} sublabel="YTD" tone="indigo" />
          </div>
        </div>
      </div>

      <OfferDetailModal
        open={Boolean(detailOffer)}
        offer={detailOffer}
        onClose={() => setDetailOffer(null)}
        onAccept={handleAcceptClick}
        onDecline={(offer) => offerStatusMutation.mutate({ offerId: offer.id, data: { status: "declined" } })}
      />

      <VolunteerAssignModal
        open={Boolean(assignOffer)}
        pickupId={assignOffer?.id}
        defaultValues={{
          volunteerName: "Nasir Chowdhury",
          volunteerContact: "+880 1711-111222",
          scheduledFor: assignOffer
            ? new Date(assignOffer.pickupWindow.start).toISOString().slice(0, 16)
            : new Date().toISOString().slice(0, 16),
          vehicleType: "van",
        }}
        onClose={() => setAssignOffer(null)}
        onSubmit={handleAssignSubmit}
        isSubmitting={offerStatusMutation.isPending || scheduleMutation.isPending}
      />
    </div>
  );
}


