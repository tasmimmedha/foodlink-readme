"use client";

import { DataCard } from "./data-card";
import { cn } from "@/lib/helpers";

interface KPIWidgetProps {
  kpis: Array<{
    title: string;
    value: string | number;
    icon?: React.ComponentType<{ className?: string }>;
    description?: string;
    trend?: {
      value: number;
      isPositive: boolean;
    };
  }>;
  className?: string;
}

export function KPIWidget({ kpis, className }: KPIWidgetProps) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", className)}>
      {kpis.map((kpi, index) => (
        <DataCard
          key={index}
          title={kpi.title}
          value={kpi.value}
          icon={kpi.icon}
          description={kpi.description}
          trend={kpi.trend}
        />
      ))}
    </div>
  );
}

