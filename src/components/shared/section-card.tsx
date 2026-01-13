"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/helpers";
import { ReactNode } from "react";

interface SectionCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
}

export function SectionCard({
  title,
  description,
  children,
  className,
  headerAction,
}: SectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="h-full"
    >
      <Card
        className={cn(
          "bg-white/80 dark:bg-gray-900/70 border border-gray-200/60 dark:border-gray-800/60 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl backdrop-blur-sm",
          className
        )}
      >
        {(title || description || headerAction) && (
          <CardHeader className="pb-3 border-b border-gray-100/60 dark:border-gray-800/60">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {title && (
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {title}
                  </CardTitle>
                )}
                {description && (
                  <CardDescription className="text-sm leading-relaxed">
                    {description}
                  </CardDescription>
                )}
              </div>
              {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
            </div>
          </CardHeader>
        )}
        <CardContent className={cn(
          !title && !description && "pt-4",
          title || description ? "pt-4" : ""
        )}>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}

