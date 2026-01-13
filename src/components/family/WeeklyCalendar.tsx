"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay } from "date-fns";
import { cn } from "@/lib/helpers";
import type { WeeklyMealPlan } from "@/lib/server";

interface WeeklyCalendarProps {
  mealPlan: WeeklyMealPlan;
  onMealClick?: (date: string, mealType: "breakfast" | "lunch" | "dinner" | "snack") => void;
  className?: string;
}

const MEAL_TYPES: Array<{ type: "breakfast" | "lunch" | "dinner" | "snack"; label: string; color: string }> = [
  { type: "breakfast", label: "Breakfast", color: "bg-yellow-100 border-yellow-300 text-yellow-800" },
  { type: "lunch", label: "Lunch", color: "bg-blue-100 border-blue-300 text-blue-800" },
  { type: "dinner", label: "Dinner", color: "bg-purple-100 border-purple-300 text-purple-800" },
];

export function WeeklyCalendar({
  mealPlan,
  onMealClick,
  className,
}: WeeklyCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const goToPreviousWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));
  const goToNextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));
  const goToToday = () => setCurrentWeek(new Date());

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Weekly Meal Plan</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={goToNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {format(weekStart, "MMM d")} - {format(addDays(weekStart, 6), "MMM d, yyyy")}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Header */}
          <div className="grid grid-cols-8 gap-2">
            <div className="text-sm font-medium text-muted-foreground">Meal</div>
            {days.map((day) => (
              <div
                key={day.toISOString()}
                className={cn(
                  "text-center text-sm font-medium",
                  isSameDay(day, new Date()) && "text-primary font-bold"
                )}
              >
                <div>{format(day, "EEE")}</div>
                <div className={cn(
                  "text-xs mt-1",
                  isSameDay(day, new Date()) && "text-primary"
                )}>
                  {format(day, "d")}
                </div>
              </div>
            ))}
          </div>

          {/* Meal rows */}
          {MEAL_TYPES.map((mealType) => (
            <div key={mealType.type} className="grid grid-cols-8 gap-2">
              <div className="text-sm font-medium flex items-center">{mealType.label}</div>
              {days.map((day) => {
                const dateStr = format(day, "yyyy-MM-dd");
                const meal = mealPlan[dateStr]?.[mealType.type];

                return (
                  <div
                    key={`${dateStr}-${mealType.type}`}
                    className={cn(
                      "min-h-[60px] p-2 rounded border-2 cursor-pointer transition-all hover:shadow-md",
                      meal
                        ? `${mealType.color} border-current`
                        : "border-dashed border-muted-foreground/30 hover:border-muted-foreground/50",
                      isSameDay(day, new Date()) && "ring-2 ring-primary ring-offset-2"
                    )}
                    onClick={() => onMealClick?.(dateStr, mealType.type)}
                  >
                    {meal ? (
                      <div>
                        <p className="text-xs font-semibold truncate">{meal.name}</p>
                        {meal.servings && (
                          <p className="text-xs opacity-75 mt-1">{meal.servings} servings</p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Plus className="h-4 w-4 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

