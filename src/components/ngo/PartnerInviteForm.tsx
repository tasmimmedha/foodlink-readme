"use client";

import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { NGOPartnerProfile } from "@/lib/server";

export type PartnerInvitePayload = Pick<
  NGOPartnerProfile,
  "name" | "type" | "location" | "contactName" | "contactPhone" | "contactEmail" | "operatingHours" | "storageCapabilities"
> & {
  distanceKm: number;
};

interface PartnerInviteFormProps {
  onSubmit: (payload: PartnerInvitePayload) => Promise<void> | void;
  isSubmitting?: boolean;
}

const PARTNER_TYPES: NGOPartnerProfile["type"][] = ["community-kitchen", "restaurant", "building", "ngo"];
const STORAGE_OPTIONS = ["hot-box", "refrigerated", "dry", "frozen"];

export function PartnerInviteForm({ onSubmit, isSubmitting }: PartnerInviteFormProps) {
  const form = useForm<PartnerInvitePayload>({
    defaultValues: {
      name: "",
      type: "community-kitchen",
      location: "",
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      operatingHours: "09:00 - 21:00",
      storageCapabilities: ["refrigerated"],
      distanceKm: 3,
    },
  });

  const handleToggleStorage = (capability: string) => {
    const current = form.getValues("storageCapabilities");
    if (current.includes(capability)) {
      form.setValue(
        "storageCapabilities",
        current.filter((c) => c !== capability)
      );
    } else {
      form.setValue("storageCapabilities", [...current, capability]);
    }
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
    form.reset();
  });

  return (
    <Card className="rounded-3xl border-dashed border-slate-200 bg-white/80 shadow-inner dark:border-slate-800 dark:bg-slate-900/60">
      <CardContent className="p-6">
        <div className="space-y-1">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Invite partner</h4>
          <p className="text-sm text-slate-500">Send a warm invite to onboard a new building or kitchen.</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Organization name</Label>
            <Input {...form.register("name", { required: true })} placeholder="Green Terrace Kitchen" />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={form.watch("type")} onValueChange={(value: NGOPartnerProfile["type"]) => form.setValue("type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {PARTNER_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace("-", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input {...form.register("location", { required: true })} placeholder="Banani Road 12" />
          </div>
          <div className="space-y-2">
            <Label>Distance (km)</Label>
            <Input type="number" step="0.1" {...form.register("distanceKm", { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label>Contact person</Label>
            <Input {...form.register("contactName", { required: true })} placeholder="Chef Laila" />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input {...form.register("contactPhone", { required: true })} placeholder="+880 1..." />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" {...form.register("contactEmail")} placeholder="chef@kitchen.org" />
          </div>
          <div className="space-y-2">
            <Label>Operating hours</Label>
            <Input {...form.register("operatingHours")} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Storage capabilities</Label>
            <div className="flex flex-wrap gap-2">
              {STORAGE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleToggleStorage(option)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize transition ${
                    form.watch("storageCapabilities").includes(option)
                      ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 text-slate-500"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Sending invite..." : "Send invite + create record"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}


