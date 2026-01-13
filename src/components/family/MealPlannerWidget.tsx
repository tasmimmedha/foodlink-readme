"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SectionCard } from "@/components/shared/section-card";
import { GlowButton } from "@/components/shared/glow-button";
import { useMealPlan } from "@/hooks/use-query-family";
import { Calendar, Plus } from "lucide-react";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/helpers";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function MealPlannerWidget() {
  const { data, isLoading } = useMealPlan();
  const [currentDate, setCurrentDate] = useState<string | null>(null);

  // Calculate current date only on client after mount
  useEffect(() => {
    setCurrentDate(new Date().toISOString());
  }, []);

  if (isLoading) {
    return (
      <SectionCard title="Meal Planner">
        <SkeletonLoader variant="card" count={1} />
      </SectionCard>
    );
  }

  const mealPlan = data || {
    week: currentDate || new Date().toISOString(),
    meals: [],
  };

  // Generate week days if not provided
  const weekStart = new Date(mealPlan.week);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return {
      day: daysOfWeek[date.getDay()],
      date: date.toISOString(),
      dateNum: date.getDate(),
    };
  });

  // Match meals to days - handle both string and object formats
  const mealsByDay = weekDays.map((day) => {
    const meal = mealPlan.meals.find(
      (m) => {
        const mealDate = new Date(m.date);
        const dayDate = new Date(day.date);
        return mealDate.toDateString() === dayDate.toDateString();
      }
    );
    return {
      ...day,
      breakfast: typeof meal?.breakfast === 'string' ? meal.breakfast : meal?.breakfast?.name || '',
      lunch: typeof meal?.lunch === 'string' ? meal.lunch : meal?.lunch?.name || '',
      dinner: typeof meal?.dinner === 'string' ? meal.dinner : meal?.dinner?.name || '',
    };
  });

  return (
    <SectionCard
      title="Meal Planner"
      description="Plan your weekly meals"
      headerAction={
        <Link href="/family/meal-planner">
        <GlowButton size="default" className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Meal</span>
        </GlowButton>
        </Link>
      }
    >
      <div className="space-y-3">
        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Week of {formatDate(weekStart)}</span>
          </div>
        </div>

        {/* Weekly Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {mealsByDay.map((day, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
              className="flex flex-col"
            >
              {/* Day Header */}
              <div className="text-center mb-2">
                <div className="text-xs font-semibold text-muted-foreground">
                  {day.day}
                </div>
                <div className="text-lg font-bold">{day.dateNum}</div>
              </div>

              {/* Meals */}
              <div className="flex-1 space-y-1">
                 {day.breakfast ? (
                   <div className="p-2 bg-[#f9fafb] rounded text-xs border border-blue-200/50">
                     <div className="font-medium text-blue-900">B</div>
                     <div className="text-blue-700 truncate">{day.breakfast}</div>
                   </div>
                 ) : (
                   <Button
                     variant="outline"
                     size="sm"
                     className="w-full p-2 h-auto text-xs border-dashed"
                   >
                     + Breakfast
                   </Button>
                 )}

                 {day.lunch ? (
                   <div className="p-2 bg-[#f9fafb] rounded text-xs border border-green-200/50">
                     <div className="font-medium text-green-900">L</div>
                     <div className="text-green-700 truncate">{day.lunch}</div>
                   </div>
                 ) : (
                   <Button
                     variant="outline"
                     size="sm"
                     className="w-full p-2 h-auto text-xs border-dashed"
                   >
                     + Lunch
                   </Button>
                 )}

                 {day.dinner ? (
                   <div className="p-2 bg-[#f9fafb] rounded text-xs border border-purple-200/50">
                     <div className="font-medium text-purple-900">D</div>
                     <div className="text-purple-700 truncate">{day.dinner}</div>
                   </div>
                 ) : (
                   <Button
                     variant="outline"
                     size="sm"
                     className="w-full p-2 h-auto text-xs border-dashed"
                   >
                     + Dinner
                   </Button>
                 )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

