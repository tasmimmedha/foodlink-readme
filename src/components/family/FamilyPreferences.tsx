"use client";

import { SectionCard } from "@/components/shared/section-card";
import { useFamilyPreferences } from "@/hooks/use-query-family";
import { Users, DollarSign, UtensilsCrossed, AlertTriangle } from "lucide-react";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/helpers";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import { GlowButton } from "@/components/shared/glow-button";

export function FamilyPreferences() {
  const { data, isLoading } = useFamilyPreferences();
  const [weeklyBudget, setWeeklyBudget] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (data?.weeklyBudget !== undefined) {
      setWeeklyBudget(data.weeklyBudget);
    }
  }, [data]);

  if (isLoading) {
    return (
      <SectionCard title="Family Preferences">
        <SkeletonLoader variant="card" count={3} />
      </SectionCard>
    );
  }

  const preferences = data || {
    householdSize: 0,
    weeklyBudget: 0,
    dietaryRestrictions: [],
    allergies: [],
    preferredCuisines: [],
    mealPrepDays: [],
  };

  const currentBudget = weeklyBudget !== undefined ? weeklyBudget : preferences.weeklyBudget;

  return (
    <SectionCard
      title="Family Preferences"
      description="Customize your household settings"
    >
      <div className="space-y-6">
        {/* Household Size */}
        <div className="flex items-center gap-4 p-4 bg-[#f9fafb] rounded-lg border border-blue-200/50">
          <Users className="h-6 w-6 text-blue-600 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-sm font-medium text-blue-900">Household Size</div>
            <div className="text-2xl font-bold text-blue-900 mt-1">
              {preferences.householdSize} {preferences.householdSize === 1 ? "person" : "people"}
            </div>
          </div>
        </div>

        {/* Weekly Budget */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <div className="text-sm font-medium">Weekly Budget</div>
              <div className="text-2xl font-bold text-green-700 mt-1">
                {formatCurrency(currentBudget)}
              </div>
            </div>
          </div>
          <Slider
            value={[currentBudget]}
            onValueChange={(value) => setWeeklyBudget(value[0])}
            max={1000}
            min={0}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$0</span>
            <span>$1000</span>
          </div>
        </div>

        {/* Dietary Restrictions */}
        {preferences.dietaryRestrictions.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-2 flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4" />
              Dietary Restrictions
            </div>
            <div className="flex flex-wrap gap-2">
              {preferences.dietaryRestrictions.map((restriction, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {restriction}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Allergies */}
        {preferences.allergies.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Allergies
            </div>
            <div className="flex flex-wrap gap-2">
              {preferences.allergies.map((allergy, index) => (
                <Badge key={index} variant="destructive" className="text-xs">
                  {allergy}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Preferred Cuisines */}
        {preferences.preferredCuisines.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-2">Preferred Cuisines</div>
            <div className="flex flex-wrap gap-2">
              {preferences.preferredCuisines.map((cuisine, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {cuisine}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Meal Prep Days */}
        {preferences.mealPrepDays.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-2">Meal Prep Days</div>
            <div className="flex flex-wrap gap-2">
              {preferences.mealPrepDays.map((day, index) => (
                <Badge key={index} variant="default" className="text-xs">
                  {day}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Save Button */}
        <GlowButton className="w-full" size="lg">
          Save Preferences
        </GlowButton>
      </div>
    </SectionCard>
  );
}

