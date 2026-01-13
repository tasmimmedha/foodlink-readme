"use client";

import { useMemo, useState } from "react";
import { NGODonationOffer, NGOPickupSchedule } from "@/lib/server";
import {
  useNgoOffers,
  useOfferStatusUpdate,
  useSchedulePickup,
  useNgoCapacity,
  useNgoPartners,
} from "@/hooks/use-query-ngo";
import { OfferListItem } from "@/components/ngo/OfferListItem";
import { OfferDetailModal } from "@/components/ngo/OfferDetailModal";
import { VolunteerAssignModal } from "@/components/ngo/VolunteerAssignModal";
import { MapPreviewCard } from "@/components/ngo/MapPreviewCard";
import { UrgentOfferBanner } from "@/components/ngo/UrgentOfferBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Filter, WandSparkles } from "lucide-react";
import { EmptyStateIllustration } from "@/components/ngo/EmptyStateIllustration";

const FILTERS: Array<{ label: string; value: "all" | "high" | "medium" | "low" }> = [
  { label: "All", value: "all" },
  { label: "High urgency", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

export default function NGODonationsPage() {
  const { data: offers, isLoading } = useNgoOffers();
  const { data: capacity } = useNgoCapacity();
  const { data: partners } = useNgoPartners();
  const updateOffer = useOfferStatusUpdate();
  const schedulePickup = useSchedulePickup();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const [detailOffer, setDetailOffer] = useState<NGODonationOffer | null>(null);
  const [assignOffer, setAssignOffer] = useState<NGODonationOffer | null>(null);

  const filteredOffers = useMemo(() => {
    return (offers ?? []).filter((offer) => {
      if (offer.status !== "pending") return false;
      if (filter !== "all" && offer.urgencyLevel !== filter) return false;
      if (search) {
        const term = search.toLowerCase();
        return (
          offer.offerTitle.toLowerCase().includes(term) ||
          offer.donorName.toLowerCase().includes(term) ||
          offer.locationLabel.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [offers, filter, search]);

  const urgentOffer = filteredOffers.find((offer) => offer.urgencyLevel === "high");

  const handleAccept = (offer: NGODonationOffer) => {
    setAssignOffer(offer);
  };

  const handleAssignSubmit = async (payload: { volunteerName: string; volunteerContact: string; scheduledFor: string; vehicleType: NGOPickupSchedule["vehicleType"]; notes?: string }) => {
    if (!assignOffer) return;
    try {
      await updateOffer.mutateAsync({ offerId: assignOffer.id, data: { status: "accepted" } });
      await schedulePickup.mutateAsync({
        offerId: assignOffer.id,
        volunteerName: payload.volunteerName,
        volunteerContact: payload.volunteerContact,
        scheduledFor: payload.scheduledFor,
        vehicleType: payload.vehicleType,
        notes: payload.notes,
      });
      toast({ title: "Offer claimed", description: `${assignOffer.offerTitle} scheduled for pickup.` });
      setAssignOffer(null);
    } catch {
      toast({ title: "Unable to claim offer", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white/80 p-4 shadow-lg dark:border-slate-800 dark:bg-slate-900/70 lg:flex-row lg:items-center">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wide text-slate-400">Automated matching</p>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            {capacity?.orgName} can auto-accept {filteredOffers.length} offers today
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Filter className="h-4 w-4 text-slate-400" />
          {FILTERS.map((item) => (
            <Button
              key={item.value}
              variant={filter === item.value ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={() => setFilter(item.value)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      {urgentOffer && (
        <UrgentOfferBanner offer={urgentOffer} onAccept={handleAccept} onView={(offer) => setDetailOffer(offer)} />
      )}

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search donors, items, or locations"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <Button 
              variant="secondary" 
              className="gap-2"
              onClick={() => toast({ title: "Smart matching", description: "Finding best matches for your capacity..." })}
            >
              <WandSparkles className="h-4 w-4" />
              Smart match
            </Button>
          </div>

          <div className="space-y-3">
            {filteredOffers.map((offer) => (
              <OfferListItem
                key={offer.id}
                offer={offer}
                onAccept={handleAccept}
                onDecline={async (of) => {
                  try {
                    await updateOffer.mutateAsync({ offerId: of.id, data: { status: "declined" } });
                    toast({ title: "Offer declined", description: `${of.offerTitle} has been declined.` });
                  } catch {
                    toast({ title: "Unable to decline offer", variant: "destructive" });
                  }
                }}
                onRequestInfo={(of) => setDetailOffer(of)}
                onViewDetail={(of) => setDetailOffer(of)}
              />
            ))}
            {filteredOffers.length === 0 && !isLoading && (
              <EmptyStateIllustration
                title="All offers processed"
                description="You're all caught up. New donations will appear here instantly."
              />
            )}
          </div>
        </div>
        <div className="space-y-4">
          <MapPreviewCard offer={detailOffer ?? urgentOffer ?? filteredOffers[0]} onOpenMap={(offer) => setDetailOffer(offer)} />
          <div className="rounded-3xl border border-slate-100 bg-white/80 p-4 shadow-lg dark:border-slate-800 dark:bg-slate-900/70">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Suggested partners</h4>
            <div className="mt-3 space-y-3">
              {(partners ?? []).slice(0, 3).map((partner) => (
                <div key={partner.id} className="flex items-center justify-between rounded-2xl border border-slate-100 px-3 py-2 dark:border-slate-800">
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{partner.name}</p>
                    <p className="text-xs text-slate-400">{partner.location}</p>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-200">
                    {(partner.acceptanceRate * 100).toFixed(0)}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <OfferDetailModal
        open={Boolean(detailOffer)}
        offer={detailOffer}
        onClose={() => setDetailOffer(null)}
        onAccept={handleAccept}
        onDecline={async (offer) => {
          try {
            await updateOffer.mutateAsync({ offerId: offer.id, data: { status: "declined" } });
            toast({ title: "Offer declined", description: `${offer.offerTitle} has been declined.` });
          } catch {
            toast({ title: "Unable to decline offer", variant: "destructive" });
          }
        }}
      />

      <VolunteerAssignModal
        open={Boolean(assignOffer)}
        pickupId={assignOffer?.id}
        defaultValues={{
          volunteerName: "Shift Crew A",
          volunteerContact: "+880 1700-000222",
          scheduledFor: assignOffer
            ? new Date(assignOffer.pickupWindow.start).toISOString().slice(0, 16)
            : new Date().toISOString().slice(0, 16),
          vehicleType: "van",
        }}
        onClose={() => setAssignOffer(null)}
        onSubmit={handleAssignSubmit}
        isSubmitting={updateOffer.isPending || schedulePickup.isPending}
      />
    </div>
  );
}


