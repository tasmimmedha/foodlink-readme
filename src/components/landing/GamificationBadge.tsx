"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Award, Zap } from "lucide-react";
import { cn } from "@/lib/helpers";

interface GamificationBadgeProps {
  title: string;
  points?: number;
  icon?: "trophy" | "star" | "award" | "zap";
  variant?: "default" | "gold" | "neon";
  className?: string;
}

const iconMap = {
  trophy: Trophy,
  star: Star,
  award: Award,
  zap: Zap,
};

export function GamificationBadge({
  title,
  points,
  icon = "star",
  variant = "default",
  className,
}: GamificationBadgeProps) {
  const Icon = iconMap[icon];

  const variantStyles = {
    default: "bg-gradient-to-r from-primary to-primary/80",
    gold: "bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-foreground",
    neon: "bg-gradient-to-r from-[#00FFC2] to-[#00D4FF] text-foreground",
  };

  return (
    <motion.div
      className={cn("inline-block", className)}
      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Badge
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 text-sm font-semibold shadow-lg",
          variantStyles[variant]
        )}
      >
        <Icon className="h-4 w-4" />
        <span>{title}</span>
        {points && (
          <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-xs">
            +{points}
          </span>
        )}
      </Badge>
    </motion.div>
  );
}

