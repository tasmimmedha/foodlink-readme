"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/helpers";

interface DashboardHeaderProps {
  userName?: string;
  householdName?: string;
  className?: string;
}

export function DashboardHeader({
  userName = "Family Member",
  householdName = "Smith Family",
  className,
}: DashboardHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("mb-8", className)}
    >
      <h1 className="text-2xl sm:text-3xl font-bold font-heading mb-2">
        Welcome back, {userName.split(" ")[0]}! 👋
      </h1>
      <p className="text-sm sm:text-base text-muted-foreground">
        {householdName} • Let's reduce waste together
      </p>
    </motion.div>
  );
}

