"use client";

import { useEffect, useState } from "react";
import { RestaurantPreferences } from "@/lib/server/db";
import {
  getRestaurantPreferences,
  updateRestaurantPreferences,
} from "@/lib/server/restaurant.preferences.server";
import { RestaurantPreferencesForm } from "@/components/restaurant/RestaurantPreferencesForm";
import { PageHeader } from "@/components/shared/page-header";

export default function RestaurantPreferencesPage() {
  const [preferences, setPreferences] = useState<RestaurantPreferences | null>(null);

  const load = async () => {
    const prefs = await getRestaurantPreferences();
    setPreferences(prefs);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Restaurant Preferences"
        description="Configure operating hours, donation rules, storage capacity, and alerts."
      />
      <RestaurantPreferencesForm
        preferences={preferences}
        onSave={async (values) => {
          await updateRestaurantPreferences({
            cuisineType: values.cuisineType,
            operatingHours: values.operatingHours,
            donationPreferences: values.donationPreferences?.split(",").map((v) => v.trim()).filter(Boolean) ?? [],
            storageCapabilities: values.storageCapabilities?.split(",").map((v) => v.trim()).filter(Boolean) ?? [],
            staffRoles: values.staffRoles?.split(",").map((v) => v.trim()).filter(Boolean) ?? [],
            notificationsEnabled: values.notificationsEnabled,
            notifyOnPickup: values.notifyOnPickup,
            notifyOnExpiry: values.notifyOnExpiry,
          });
          await load();
        }}
      />
    </div>
  );
}

