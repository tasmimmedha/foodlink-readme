"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/helpers";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  className?: string;
  iconColor?: string;
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  className,
  iconColor = "text-primary",
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className={cn(
        "h-full hover:shadow-xl transition-all duration-300 border-2 rounded-2xl bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm",
        className
      )}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">{title}</p>
              <div className="flex items-baseline gap-2 flex-wrap">
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
                {trend && (
                  <div
                    className={cn(
                      "flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-lg",
                      trend.isPositive 
                        ? "text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/30" 
                        : "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/30"
                    )}
                  >
                    {trend.isPositive ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span>{Math.abs(trend.value)}%</span>
                  </div>
                )}
              </div>
              {description && (
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{description}</p>
              )}
            </div>
            <div className={cn(
              "p-3.5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex-shrink-0 shadow-sm",
              iconColor
            )}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

