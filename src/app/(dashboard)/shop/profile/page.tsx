"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useShopProfile, useUpdateShopProfile } from "@/hooks/use-query-shop";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ensureShopSeedData } from "@/lib/server/shop.seed";

export default function ShopProfilePage() {
  const [seedReady, setSeedReady] = useState(false);
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useShopProfile({ enabled: seedReady });
  const updateProfile = useUpdateShopProfile();

  useEffect(() => {
    ensureShopSeedData()
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["shop", "profile"] });
        setSeedReady(true);
      })
      .catch((err) => {
        console.error("Failed to seed shop data:", err);
        setSeedReady(true); // Continue anyway
      });
  }, [queryClient]);

  if (!seedReady || isLoading || !profile) {
    return <p className="text-sm text-slate-500">Loading profile...</p>;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    updateProfile.mutate({
      storeName: formData.get("storeName") as string,
      address: formData.get("address") as string,
      contactNumber: formData.get("contactNumber") as string,
      managerName: formData.get("managerName") as string,
      operatingHours: formData.get("operatingHours") as string,
      barcodePrefix: formData.get("barcodePrefix") as string,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Shop profile</h1>
        <p className="text-sm text-slate-500">
          Update store info, notification preferences, and donation settings.
        </p>
      </div>
      <form
        className="space-y-4 rounded-3xl border border-slate-100 bg-white/95 p-6 shadow-lg shadow-slate-200/70"
        onSubmit={handleSubmit}
      >
        <Field label="Store name">
          <Input name="storeName" defaultValue={profile.storeName} />
        </Field>
        <Field label="Address">
          <Input name="address" defaultValue={profile.address} />
        </Field>
        <Field label="Contact number">
          <Input name="contactNumber" defaultValue={profile.contactNumber} />
        </Field>
        <Field label="Manager name">
          <Input name="managerName" defaultValue={profile.managerName} />
        </Field>
        <Field label="Operating hours">
          <Input name="operatingHours" defaultValue={profile.operatingHours} />
        </Field>
        <Field label="Barcode prefix">
          <Input name="barcodePrefix" defaultValue={profile.barcodePrefix} />
        </Field>
        <Button type="submit" className="rounded-full" disabled={updateProfile.isPending}>
          Save profile
        </Button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-sm text-slate-500">{label}</Label>
      {children}
    </div>
  );
}

