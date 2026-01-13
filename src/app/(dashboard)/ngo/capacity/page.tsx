"use client";

import { useState } from "react";
import { CapacityControlPanel } from "@/components/ngo/CapacityControlPanel";
import {
  useNgoCapacity,
  useUpdateNgoCapacity,
  useNgoOffers,
  useCapacityCheck,
  useNgoPartners,
} from "@/hooks/use-query-ngo";
import { SafetyChecklist } from "@/components/ngo/SafetyChecklist";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { AlertTriangle, Share2 } from "lucide-react";
import type { NGOCapacitySettings } from "@/lib/server";

export default function NGOCapacityPage() {
  const { data: capacity } = useNgoCapacity();
  const updateCapacity = useUpdateNgoCapacity();
  const { data: offers } = useNgoOffers();
  const { data: partners } = useNgoPartners();
  const capacityCheck = useCapacityCheck();
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);

  const selectedOffer = offers?.find((offer) => offer.id === selectedOfferId) ?? offers?.[0];

  const handleSave = async (values: Partial<NGOCapacitySettings>) => {
    try {
      await updateCapacity.mutateAsync(values);
      toast({ title: "Guardrails updated" });
    } catch {
      toast({ title: "Unable to save capacity", variant: "destructive" });
    }
  };

  const handleCheckOffer = async () => {
    if (!selectedOffer) return;
    const result = await capacityCheck.mutateAsync({ weightKg: selectedOffer.weightKg, items: selectedOffer.items });
    if (result.decision === "accept") {
      toast({ title: "Good to go", description: result.reason });
    } else if (result.decision === "partial") {
      toast({
        title: "Suggest partial acceptance",
        description: `Take ${result.suggestedKg?.toFixed(1)}kg, redirect rest to ${result.referPartner?.name ?? "partner"}.`,
      });
    } else {
      toast({
        title: "Refer to partner",
        description: result.referPartner
          ? `Send to ${result.referPartner.name}`
          : "Capacity reached; share with network.",
        variant: "destructive",
      });
    }
  };

  const checklist = [
    { id: "fridge", label: "Fridge capacity logged", checked: true },
    { id: "allergen", label: "Allergen chart visible", checked: true },
    { id: "volunteer", label: "Volunteer PPE stocked", checked: false },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr] grid-cols-1">
        <CapacityControlPanel capacity={capacity} onSave={handleSave} isSubmitting={updateCapacity.isPending} />
        <div className="space-y-4">
          <Card className="rounded-3xl border border-amber-100 bg-amber-50/70 shadow-lg dark:border-amber-900/50 dark:bg-amber-900/20">
            <CardContent className="space-y-3 p-5">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-200">
                <AlertTriangle className="h-5 w-5" />
                <p className="font-semibold">Auto-suggestion</p>
              </div>
              <p className="text-sm text-amber-800/80 dark:text-amber-100/90">
                If an offer exceeds {capacity?.dailyCapacityKg ?? 18}kg, FoodFlow suggests a split plan or referral to partner kitchens within {capacity?.preferredPickupRadiusKm ?? 6}km.
              </p>
              <div className="space-y-2 rounded-2xl border border-amber-200/60 bg-white/70 p-3 dark:border-amber-900/40 dark:bg-amber-950/20">
                <p className="text-xs uppercase tracking-wide text-amber-500">Check upcoming offer</p>
                <select
                  className="w-full rounded-2xl border border-amber-200 bg-transparent p-2 text-sm text-amber-800 dark:border-amber-800 dark:text-amber-100"
                  value={selectedOffer?.id ?? ""}
                  onChange={(event) => setSelectedOfferId(event.target.value)}
                >
                  {offers?.map((offer) => (
                    <option key={offer.id} value={offer.id}>
                      {offer.offerTitle} · {offer.weightKg}kg
                    </option>
                  ))}
                </select>
                <Button variant="secondary" size="sm" onClick={handleCheckOffer} disabled={!selectedOffer}>
                  Run capacity check
                </Button>
              </div>
            </CardContent>
          </Card>
          <SafetyChecklist items={checklist} />
          <Card className="rounded-3xl border-slate-100 bg-white/80 shadow-lg dark:border-slate-800 dark:bg-slate-900/70">
            <CardContent className="space-y-3 p-5">
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-emerald-500" />
                <p className="font-semibold text-slate-900 dark:text-white">Refer overflow</p>
              </div>
              <p className="text-sm text-slate-500">
                Top partners ready for referrals: {(partners ?? []).slice(0, 2).map((partner) => partner.name).join(", ") || "Add partners"}.
              </p>
              <Button size="sm" className="rounded-full">
                Share partner brief
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


