"use client";

import { useState } from "react";
import { PartnerCard } from "@/components/ngo/PartnerCard";
import { PartnerInviteForm, type PartnerInvitePayload } from "@/components/ngo/PartnerInviteForm";
import { useNgoPartners, usePartnerMutations } from "@/hooks/use-query-ngo";
import { NGOPartnerProfile } from "@/lib/server";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function NGOPartnersPage() {
  const { data: partners } = useNgoPartners();
  const { addMutation } = usePartnerMutations();
  const [selectedPartner, setSelectedPartner] = useState<NGOPartnerProfile | null>(null);

  const handleInvite = async (payload: PartnerInvitePayload) => {
    try {
      await addMutation.mutateAsync({
        ...payload,
        acceptanceRate: 0.85,
        lastDonationAt: new Date().toISOString(),
        avgDonationKg: 8,
      });
      toast({ title: "Partner invited", description: `${payload.name} has been added to your partner network.` });
    } catch {
      toast({ title: "Unable to invite partner", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {(partners ?? []).map((partner) => (
            <PartnerCard key={partner.id} partner={partner} onSelect={setSelectedPartner} />
          ))}
        </div>
        <PartnerInviteForm onSubmit={handleInvite} isSubmitting={addMutation.isPending} />
      </div>

      <Dialog open={Boolean(selectedPartner)} onOpenChange={() => setSelectedPartner(null)}>
        <DialogContent className="rounded-3xl bg-white/95 p-6 shadow-2xl dark:bg-slate-900/95">
          {selectedPartner && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">{selectedPartner.name}</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-slate-500">
                Avg donation {selectedPartner.avgDonationKg}kg · Last donated{" "}
                {new Date(selectedPartner.lastDonationAt).toLocaleDateString()}
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}


