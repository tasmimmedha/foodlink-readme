"use client";

import { RestaurantPreferences } from "@/lib/server/db";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const schema = z.object({
  cuisineType: z.string().min(2),
  operatingHours: z.string().min(2),
  donationPreferences: z.string().optional(),
  storageCapabilities: z.string().optional(),
  staffRoles: z.string().optional(),
  notificationsEnabled: z.boolean(),
  notifyOnPickup: z.boolean(),
  notifyOnExpiry: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface RestaurantPreferencesFormProps {
  preferences: RestaurantPreferences | null;
  onSave: (values: FormValues) => Promise<void> | void;
}

export function RestaurantPreferencesForm({ preferences, onSave }: RestaurantPreferencesFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      cuisineType: preferences?.cuisineType ?? "Asian",
      operatingHours: preferences?.operatingHours ?? "",
      donationPreferences: preferences?.donationPreferences.join(", ") ?? "",
      storageCapabilities: preferences?.storageCapabilities.join(", ") ?? "",
      staffRoles: preferences?.staffRoles.join(", ") ?? "",
      notificationsEnabled: preferences?.notificationsEnabled ?? true,
      notifyOnPickup: preferences?.notifyOnPickup ?? true,
      notifyOnExpiry: preferences?.notifyOnExpiry ?? true,
    },
  });

  useEffect(() => {
    if (preferences) {
      form.reset({
        cuisineType: preferences.cuisineType,
        operatingHours: preferences.operatingHours,
        donationPreferences: preferences.donationPreferences.join(", "),
        storageCapabilities: preferences.storageCapabilities.join(", "),
        staffRoles: preferences.staffRoles.join(", "),
        notificationsEnabled: preferences.notificationsEnabled,
        notifyOnPickup: preferences.notifyOnPickup,
        notifyOnExpiry: preferences.notifyOnExpiry,
      });
    }
  }, [preferences, form]);

  const submit = async (values: FormValues) => {
    await onSave(values);
  };

  return (
    <form
      onSubmit={form.handleSubmit(submit)}
      className="space-y-4 rounded-3xl border border-white/60 bg-white/80 dark:bg-gray-900/70 p-6 shadow-xl"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <Input placeholder="Cuisine type" {...form.register("cuisineType")} />
        <Input placeholder="Operating hours" {...form.register("operatingHours")} />
      </div>
      <Textarea placeholder="Donation preferences" {...form.register("donationPreferences")} />
      <Textarea placeholder="Storage capabilities" {...form.register("storageCapabilities")} />
      <Textarea placeholder="Staff roles" {...form.register("staffRoles")} />
      <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
        <label className="flex items-center gap-2">
          <input type="checkbox" {...form.register("notificationsEnabled")} /> Notifications
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...form.register("notifyOnPickup")} /> Pickup alerts
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...form.register("notifyOnExpiry")} /> Expiry alerts
        </label>
      </div>
      <Button type="submit" className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500">
        Save Preferences
      </Button>
    </form>
  );
}

