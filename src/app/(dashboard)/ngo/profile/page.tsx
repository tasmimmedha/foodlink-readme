"use client";

import { useNgoCapacity, useUpdateNgoCapacity } from "@/hooks/use-query-ngo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";

interface ProfileForm {
  managerName: string;
  contactPhone: string;
  contactEmail: string;
  location: string;
  policyNotes: string;
}

export default function NGOProfilePage() {
  const { data: capacity } = useNgoCapacity();
  const updateCapacity = useUpdateNgoCapacity();
  const form = useForm<ProfileForm>({
    values: {
      managerName: capacity?.managerName ?? "",
      contactPhone: capacity?.contactPhone ?? "",
      contactEmail: capacity?.contactEmail ?? "",
      location: capacity?.location ?? "",
      policyNotes: capacity?.policyNotes ?? "",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await updateCapacity.mutateAsync(values);
    toast({ title: "Profile updated" });
  });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="rounded-3xl border-slate-100 bg-white/80 shadow-lg dark:border-slate-800 dark:bg-slate-900/70">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Organization profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label>Manager name</Label>
              <Input {...form.register("managerName")} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input {...form.register("contactPhone")} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" {...form.register("contactEmail")} />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input {...form.register("location")} />
            </div>
            <div className="space-y-2">
              <Label>Policy notes</Label>
              <Input {...form.register("policyNotes")} />
            </div>
            <Button type="submit" disabled={updateCapacity.isPending} className="w-full">
              Save profile
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-slate-100 bg-white/80 shadow-lg dark:border-slate-800 dark:bg-slate-900/70">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Preferences snapshot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <p>
            <strong>Preferred food types:</strong> {capacity?.preferredFoodTypes.join(", ")}
          </p>
          <p>
            <strong>Restricted items:</strong> {capacity?.restrictedItems.join(", ")}
          </p>
          <p>
            <strong>Pickup window:</strong> {capacity?.pickupWindow.start} – {capacity?.pickupWindow.end}
          </p>
          <p>
            <strong>Safety rules:</strong> {capacity?.safetyRules.join(" • ")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}


