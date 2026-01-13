"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/helpers";

export interface RoleCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  delay?: number;
  onClick: () => void;
}

export function RoleCard({
  id,
  title,
  description,
  icon: Icon,
  delay = 0,
  onClick,
}: RoleCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "group relative w-full p-6 rounded-2xl border transition-all duration-200",
        "bg-white dark:bg-gray-900",
        "border-gray-200 dark:border-gray-800",
        "shadow-sm hover:shadow-md",
        "hover:border-green-400",
        "hover:bg-green-50/80 dark:hover:bg-green-950/20",
        "focus:outline-none focus:ring-4 focus:ring-green-500/40 focus:ring-offset-2",
        "text-left overflow-hidden"
      )}
      aria-label={`Select ${title} role: ${description}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="relative z-10 flex flex-col items-start gap-4">
        {/* Icon */}
        <motion.div
          className={cn(
            "p-3 rounded-xl transition-all duration-200",
            "bg-gray-50 dark:bg-gray-800",
            "group-hover:bg-green-100/70 dark:group-hover:bg-green-900/40"
          )}
        >
          <Icon className="h-8 w-8 text-gray-700 dark:text-gray-300" />
        </motion.div>

        {/* Title and Description */}
        <div className="flex-1 w-full">
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors duration-200">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Arrow indicator */}
        <div className="text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-all duration-200 group-hover:translate-x-1">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </div>
      </div>
    </motion.button>
  );
}

