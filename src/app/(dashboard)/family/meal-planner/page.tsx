"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { WeeklyCalendar } from "@/components/family/WeeklyCalendar";
import { useWeeklyMeals, useUpdateMealSlot, useDeleteMealSlot, useInventory } from "@/hooks/use-query-family";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Calendar, ChefHat, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

export default function MealPlannerPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack" | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    servings: "",
  });

  const { data: mealPlan, isLoading } = useWeeklyMeals();
  const updateMutation = useUpdateMealSlot();
  const deleteMutation = useDeleteMealSlot();

  const handleMealClick = (date: string, mealType: "breakfast" | "lunch" | "dinner" | "snack") => {
    const existingMeal = mealPlan?.[date]?.[mealType];
    setSelectedDate(date);
    setSelectedMealType(mealType);
    setFormData({
      name: existingMeal?.name || "",
      description: existingMeal?.description || "",
      servings: existingMeal?.servings?.toString() || "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedMealType) return;

    try {
      await updateMutation.mutateAsync({
        date: selectedDate,
        mealType: selectedMealType,
        name: formData.name,
        description: formData.description || undefined,
        servings: formData.servings ? parseInt(formData.servings) : undefined,
      });
      toast({
        title: "Success",
        description: `${formData.name} has been ${mealPlan?.[selectedDate]?.[selectedMealType] ? 'updated' : 'added'} to your meal plan.`,
      });
      setDialogOpen(false);
      setFormData({ name: "", description: "", servings: "" });
    } catch (error) {
      console.error("Error updating meal:", error);
      toast({
        title: "Error",
        description: "Failed to save meal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedDate || !selectedMealType) return;
    const existingMeal = mealPlan?.[selectedDate]?.[selectedMealType];
    if (!existingMeal) return;

    if (confirm(`Remove "${existingMeal.name}" from your meal plan?`)) {
      try {
        await deleteMutation.mutateAsync(existingMeal.id);
        toast({
          title: "Removed",
          description: `${existingMeal.name} has been removed from your meal plan.`,
        });
        setDialogOpen(false);
        setFormData({ name: "", description: "", servings: "" });
      } catch (error) {
        console.error("Error deleting meal:", error);
        toast({
          title: "Error",
          description: "Failed to remove meal. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Calculate meal planning stats
  const totalMeals = mealPlan ? Object.values(mealPlan).reduce((sum, day) => {
    return sum + (day.breakfast ? 1 : 0) + (day.lunch ? 1 : 0) + (day.dinner ? 1 : 0);
  }, 0) : 0;
  const plannedDays = mealPlan ? Object.keys(mealPlan).length : 0;
  const { data: inventory } = useInventory();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Meal Planner"
        description="Plan your weekly meals and reduce food waste"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Meals Planned</p>
                  <p className="text-3xl font-bold">{totalMeals}</p>
                </div>
                <ChefHat className="h-8 w-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Days Planned</p>
                  <p className="text-3xl font-bold">{plannedDays}/7</p>
                </div>
                <Calendar className="h-8 w-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Items Available</p>
                  <p className="text-3xl font-bold">{inventory?.length || 0}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Weekly Calendar */}
      {isLoading ? (
        <SkeletonLoader variant="card" count={1} />
      ) : (
        <WeeklyCalendar
          mealPlan={mealPlan || {}}
          onMealClick={handleMealClick}
        />
      )}

      {/* Tips Card */}
      {totalMeals < 10 && (
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Meal Planning Tip
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Plan at least 14 meals per week to make the most of your inventory and reduce waste. 
                  Use items that are expiring soon in your meal plans!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedMealType ? selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1) : "Meal"}
            </DialogTitle>
            <DialogDescription>
              {selectedDate && new Date(selectedDate).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name">Meal Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g., Grilled Chicken Salad"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description or notes"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="servings">Servings</Label>
              <Input
                id="servings"
                type="number"
                value={formData.servings}
                onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
                placeholder="4"
              />
            </div>

            <div className="flex gap-3 pt-4">
              {mealPlan?.[selectedDate || ""]?.[selectedMealType || "breakfast"] && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  className="flex-1"
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Delete
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={updateMutation.isPending}>
                {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

