"use client";

import { PageHeader } from "@/components/shared/page-header";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import { useFamilyPreferences } from "@/hooks/use-query-family";
import { FamilyPreferencesForm } from "@/components/family/FamilyPreferencesForm";

export default function PreferencesPage() {
  const { isLoading } = useFamilyPreferences();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Family Preferences" />
        <SkeletonLoader variant="card" count={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Family Preferences"
        description="Customize your household settings, dietary preferences, nutrition goals, and sustainability profile"
      />

      <FamilyPreferencesForm />
    </div>
  );
}

