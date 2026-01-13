"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  DollarSign, 
  UtensilsCrossed, 
  AlertTriangle, 
  Clock,
  ShoppingCart,
  ChefHat,
  Leaf,
  Target,
  Loader2
} from "lucide-react";
import { useFamilyPreferences, useUpdateFamilyPreferences } from "@/hooks/use-query-family";
import { toast } from "sonner";

const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Keto",
  "Paleo",
  "Halal",
  "Kosher",
];

const ALLERGY_OPTIONS = [
  "Peanuts",
  "Tree Nuts",
  "Shellfish",
  "Fish",
  "Eggs",
  "Milk",
  "Soy",
  "Wheat",
];

const HEALTH_CONDITIONS = [
  "Diabetes",
  "Heart Disease",
  "Celiac",
  "Hypertension",
  "High Cholesterol",
];

const CUISINE_OPTIONS = [
  "Asian",
  "Italian",
  "Middle-Eastern",
  "Indian",
  "Western",
  "Mexican",
  "Mediterranean",
  "Thai",
];

const VITAMIN_OPTIONS = [
  "Iron",
  "Vitamin D",
  "Calcium",
  "B12",
  "Vitamin C",
  "Folate",
];

const AVOID_EXCESS_OPTIONS = [
  "Sugar",
  "Sodium",
  "Fats",
  "Carbs",
  "Cholesterol",
];

export function FamilyPreferencesForm() {
  const { data: preferences, isLoading } = useFamilyPreferences();
  const updateMutation = useUpdateFamilyPreferences();

  const [formData, setFormData] = useState({
    // Household
    householdSize: 1,
    ageGroups: { child: 0, adult: 0, senior: 0 },
    cookingFrequency: "daily" as "daily" | "few-times-week" | "weekly" | "occasional",
    eatingSchedule: { breakfast: "07:00", lunch: "13:00", dinner: "19:00" },
    // Diet & Restrictions
    dietaryType: "general" as "vegan" | "vegetarian" | "halal" | "keto" | "low-sodium" | "general",
    dietaryRestrictions: [] as string[],
    allergies: [] as string[],
    healthConditions: [] as string[],
    // Budget & Shopping
    weeklyBudget: 150,
    budgetMin: 0,
    budgetMax: 1000,
    preferredStores: [] as string[],
    priceSensitivity: "medium" as "low" | "medium" | "high",
    // Culinary
    preferredCuisines: [] as string[],
    mealPrepPreference: "diverse" as "quick" | "diverse" | "budget" | "high-protein",
    // Sustainability
    wasteSensitivityLevel: "medium" as "low" | "medium" | "high",
    sustainabilityPreference: "moderate" as "minimal" | "moderate" | "high",
    leftoverComfortLevel: "high" as "low" | "medium" | "high",
    // Nutrition Goals
    dailyCalories: 2000,
    macroGoal: { protein: 25, carbs: 45, fats: 30 },
    vitaminsFocus: [] as string[],
    avoidExcess: [] as string[],
  });

  useEffect(() => {
    if (preferences) {
      setFormData({
        householdSize: preferences.householdSize || 1,
        ageGroups: preferences.ageGroups || { child: 0, adult: 0, senior: 0 },
        cookingFrequency: preferences.cookingFrequency || "daily",
        eatingSchedule: preferences.eatingSchedule || { breakfast: "07:00", lunch: "13:00", dinner: "19:00" },
        dietaryType: preferences.dietaryType || "general",
        dietaryRestrictions: preferences.dietaryRestrictions || [],
        allergies: preferences.allergies || [],
        healthConditions: preferences.healthConditions || [],
        weeklyBudget: preferences.weeklyBudget || 150,
        budgetMin: preferences.budgetRange?.min || 0,
        budgetMax: preferences.budgetRange?.max || 1000,
        preferredStores: preferences.preferredStores || [],
        priceSensitivity: preferences.priceSensitivity || "medium",
        preferredCuisines: preferences.preferredCuisines || [],
        mealPrepPreference: preferences.mealPrepPreference || "diverse",
        wasteSensitivityLevel: preferences.wasteSensitivityLevel || "medium",
        sustainabilityPreference: preferences.sustainabilityPreference || "moderate",
        leftoverComfortLevel: preferences.leftoverComfortLevel || "high",
        dailyCalories: preferences.dailyCalories || 2000,
        macroGoal: preferences.macroGoal || { protein: 25, carbs: 45, fats: 30 },
        vitaminsFocus: preferences.vitaminsFocus || [],
        avoidExcess: preferences.avoidExcess || [],
      });
    }
  }, [preferences]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync({
        householdSize: formData.householdSize,
        ageGroups: formData.ageGroups,
        cookingFrequency: formData.cookingFrequency,
        eatingSchedule: formData.eatingSchedule,
        dietaryType: formData.dietaryType,
        dietaryRestrictions: formData.dietaryRestrictions,
        allergies: formData.allergies,
        healthConditions: formData.healthConditions,
        weeklyBudget: formData.weeklyBudget,
        budgetRange: {
          min: formData.budgetMin,
          max: formData.budgetMax,
        },
        preferredStores: formData.preferredStores,
        priceSensitivity: formData.priceSensitivity,
        preferredCuisines: formData.preferredCuisines,
        mealPrepPreference: formData.mealPrepPreference,
        wasteSensitivityLevel: formData.wasteSensitivityLevel,
        sustainabilityPreference: formData.sustainabilityPreference,
        leftoverComfortLevel: formData.leftoverComfortLevel,
        dailyCalories: formData.dailyCalories,
        macroGoal: formData.macroGoal,
        vitaminsFocus: formData.vitaminsFocus,
        avoidExcess: formData.avoidExcess,
      });
      // Success handled by mutation
    } catch (error) {
      console.error("Error updating preferences:", error);
    }
  };

  const toggleArray = (array: string[], item: string, setter: (arr: string[]) => void) => {
    setter(
      array.includes(item)
        ? array.filter((i) => i !== item)
        : [...array, item]
    );
  };

  if (isLoading) {
    return <div>Loading preferences...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Household Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Household Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="householdSize" className="w-40">Household Size</Label>
            <Input
              id="householdSize"
              type="number"
              min="1"
              max="20"
              value={formData.householdSize}
              onChange={(e) =>
                setFormData({ ...formData, householdSize: parseInt(e.target.value) || 1 })
              }
              className="w-24"
            />
          </div>

          <div className="space-y-2">
            <Label>Age Groups</Label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="child" className="text-sm">Children</Label>
                <Input
                  id="child"
                  type="number"
                  min="0"
                  value={formData.ageGroups.child}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ageGroups: { ...formData.ageGroups, child: parseInt(e.target.value) || 0 },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="adult" className="text-sm">Adults</Label>
                <Input
                  id="adult"
                  type="number"
                  min="0"
                  value={formData.ageGroups.adult}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ageGroups: { ...formData.ageGroups, adult: parseInt(e.target.value) || 0 },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="senior" className="text-sm">Seniors</Label>
                <Input
                  id="senior"
                  type="number"
                  min="0"
                  value={formData.ageGroups.senior}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ageGroups: { ...formData.ageGroups, senior: parseInt(e.target.value) || 0 },
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="cookingFrequency">Cooking Frequency</Label>
            <Select
              value={formData.cookingFrequency}
              onValueChange={(value: any) =>
                setFormData({ ...formData, cookingFrequency: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="few-times-week">Few Times a Week</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="occasional">Occasional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Typical Eating Schedule</Label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="breakfast" className="text-sm">Breakfast</Label>
                <Input
                  id="breakfast"
                  type="time"
                  value={formData.eatingSchedule.breakfast}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      eatingSchedule: { ...formData.eatingSchedule, breakfast: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="lunch" className="text-sm">Lunch</Label>
                <Input
                  id="lunch"
                  type="time"
                  value={formData.eatingSchedule.lunch}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      eatingSchedule: { ...formData.eatingSchedule, lunch: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="dinner" className="text-sm">Dinner</Label>
                <Input
                  id="dinner"
                  type="time"
                  value={formData.eatingSchedule.dinner}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      eatingSchedule: { ...formData.eatingSchedule, dinner: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diet & Restrictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5" />
            Diet & Restrictions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="dietaryType">Primary Dietary Type</Label>
            <Select
              value={formData.dietaryType}
              onValueChange={(value: any) =>
                setFormData({ ...formData, dietaryType: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="halal">Halal</SelectItem>
                <SelectItem value="keto">Keto</SelectItem>
                <SelectItem value="low-sodium">Low Sodium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Dietary Restrictions</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {DIETARY_OPTIONS.map((option) => (
                <Badge
                  key={option}
                  variant={formData.dietaryRestrictions.includes(option) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() =>
                    toggleArray(formData.dietaryRestrictions, option, (arr) =>
                      setFormData({ ...formData, dietaryRestrictions: arr })
                    )
                  }
                >
                  {option}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Allergies
            </Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {ALLERGY_OPTIONS.map((option) => (
                <Badge
                  key={option}
                  variant={formData.allergies.includes(option) ? "destructive" : "outline"}
                  className="cursor-pointer"
                  onClick={() =>
                    toggleArray(formData.allergies, option, (arr) =>
                      setFormData({ ...formData, allergies: arr })
                    )
                  }
                >
                  {option}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Health Conditions</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {HEALTH_CONDITIONS.map((condition) => (
                <Badge
                  key={condition}
                  variant={formData.healthConditions.includes(condition) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() =>
                    toggleArray(formData.healthConditions, condition, (arr) =>
                      setFormData({ ...formData, healthConditions: arr })
                    )
                  }
                >
                  {condition}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget & Shopping */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Budget & Shopping
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="weeklyBudget">Weekly Budget ($)</Label>
            <Input
              id="weeklyBudget"
              type="number"
              min="0"
              value={formData.weeklyBudget}
              onChange={(e) =>
                setFormData({ ...formData, weeklyBudget: parseFloat(e.target.value) || 0 })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Budget Range</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budgetMin" className="text-sm">Min ($)</Label>
                <Input
                  id="budgetMin"
                  type="number"
                  value={formData.budgetMin}
                  onChange={(e) =>
                    setFormData({ ...formData, budgetMin: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
              <div>
                <Label htmlFor="budgetMax" className="text-sm">Max ($)</Label>
                <Input
                  id="budgetMax"
                  type="number"
                  value={formData.budgetMax}
                  onChange={(e) =>
                    setFormData({ ...formData, budgetMax: parseFloat(e.target.value) || 1000 })
                  }
                />
              </div>
            </div>
            <Slider
              value={[formData.budgetMin, formData.budgetMax]}
              onValueChange={([min, max]) =>
                setFormData({ ...formData, budgetMin: min, budgetMax: max })
              }
              min={0}
              max={2000}
              step={50}
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="priceSensitivity">Price Sensitivity</Label>
            <Select
              value={formData.priceSensitivity}
              onValueChange={(value: any) =>
                setFormData({ ...formData, priceSensitivity: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - Quality over price</SelectItem>
                <SelectItem value="medium">Medium - Balanced</SelectItem>
                <SelectItem value="high">High - Best deals</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Preferred Stores</Label>
            <div className="space-y-2 mt-2">
              <Input
                placeholder="Add store name (e.g., FreshMart, SuperSave, Agora)"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const input = e.currentTarget;
                    const value = input.value.trim();
                    if (value && !formData.preferredStores.includes(value)) {
                      setFormData({
                        ...formData,
                        preferredStores: [...formData.preferredStores, value],
                      });
                      input.value = "";
                    }
                  }
                }}
              />
              {formData.preferredStores.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.preferredStores.map((store) => (
                    <Badge
                      key={store}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          preferredStores: formData.preferredStores.filter((s) => s !== store),
                        })
                      }
                    >
                      {store} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Culinary Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            Culinary Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Preferred Cuisines</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {CUISINE_OPTIONS.map((cuisine) => (
                <Badge
                  key={cuisine}
                  variant={formData.preferredCuisines.includes(cuisine) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() =>
                    toggleArray(formData.preferredCuisines, cuisine, (arr) =>
                      setFormData({ ...formData, preferredCuisines: arr })
                    )
                  }
                >
                  {cuisine}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="mealPrepPreference">Meal Prep Preference</Label>
            <Select
              value={formData.mealPrepPreference}
              onValueChange={(value: any) =>
                setFormData({ ...formData, mealPrepPreference: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quick">Quick & Easy</SelectItem>
                <SelectItem value="diverse">Diverse & Varied</SelectItem>
                <SelectItem value="budget">Budget-Friendly</SelectItem>
                <SelectItem value="high-protein">High-Protein</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sustainability */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            Sustainability Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="wasteSensitivityLevel">Waste Sensitivity Level</Label>
            <Select
              value={formData.wasteSensitivityLevel}
              onValueChange={(value: any) =>
                setFormData({ ...formData, wasteSensitivityLevel: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="sustainabilityPreference">Sustainability Preference</Label>
            <Select
              value={formData.sustainabilityPreference}
              onValueChange={(value: any) =>
                setFormData({ ...formData, sustainabilityPreference: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="leftoverComfortLevel">Leftover Comfort Level</Label>
            <Select
              value={formData.leftoverComfortLevel}
              onValueChange={(value: any) =>
                setFormData({ ...formData, leftoverComfortLevel: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - Prefer fresh</SelectItem>
                <SelectItem value="medium">Medium - Occasional leftovers</SelectItem>
                <SelectItem value="high">High - Love leftovers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Nutrition Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Nutrition Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="dailyCalories">Daily Calorie Target</Label>
            <Input
              id="dailyCalories"
              type="number"
              min="1000"
              max="5000"
              value={formData.dailyCalories}
              onChange={(e) =>
                setFormData({ ...formData, dailyCalories: parseInt(e.target.value) || 2000 })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Macro Goals (Percentages)</Label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="protein" className="text-sm">Protein (%)</Label>
                <Input
                  id="protein"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.macroGoal.protein}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      macroGoal: { ...formData.macroGoal, protein: parseInt(e.target.value) || 25 },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="carbs" className="text-sm">Carbs (%)</Label>
                <Input
                  id="carbs"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.macroGoal.carbs}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      macroGoal: { ...formData.macroGoal, carbs: parseInt(e.target.value) || 45 },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="fats" className="text-sm">Fats (%)</Label>
                <Input
                  id="fats"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.macroGoal.fats}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      macroGoal: { ...formData.macroGoal, fats: parseInt(e.target.value) || 30 },
                    })
                  }
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Total: {formData.macroGoal.protein + formData.macroGoal.carbs + formData.macroGoal.fats}%
            </p>
          </div>

          <div>
            <Label>Vitamins to Focus On</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {VITAMIN_OPTIONS.map((vitamin) => (
                <Badge
                  key={vitamin}
                  variant={formData.vitaminsFocus.includes(vitamin) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() =>
                    toggleArray(formData.vitaminsFocus, vitamin, (arr) =>
                      setFormData({ ...formData, vitaminsFocus: arr })
                    )
                  }
                >
                  {vitamin}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Avoid Excess</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {AVOID_EXCESS_OPTIONS.map((item) => (
                <Badge
                  key={item}
                  variant={formData.avoidExcess.includes(item) ? "destructive" : "outline"}
                  className="cursor-pointer"
                  onClick={() =>
                    toggleArray(formData.avoidExcess, item, (arr) =>
                      setFormData({ ...formData, avoidExcess: arr })
                    )
                  }
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={updateMutation.isPending} onClick={handleSubmit}>
          {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save All Preferences
        </Button>
      </div>
    </form>
  );
}

