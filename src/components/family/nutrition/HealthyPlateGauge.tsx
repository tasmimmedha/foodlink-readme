"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHealthyPlateStatus } from "@/hooks/use-query-family";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import { motion } from "framer-motion";

export function HealthyPlateGauge() {
  const { data: plateStatus, isLoading } = useHealthyPlateStatus();

  if (isLoading) {
    return <SkeletonLoader variant="card" count={1} />;
  }

  if (!plateStatus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Healthy Plate</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No data available
          </p>
        </CardContent>
      </Card>
    );
  }

  const sections = [
    { name: "Protein", value: plateStatus.protein, color: "#3b82f6", ideal: 25 },
    { name: "Carbs", value: plateStatus.carbs, color: "#10b981", ideal: 35 },
    { name: "Vegetables", value: plateStatus.vegetables, color: "#22c55e", ideal: 30 },
    { name: "Fruits", value: plateStatus.fruits, color: "#f59e0b", ideal: 10 },
    { name: "Grains", value: plateStatus.grains, color: "#eab308", ideal: 15 },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Healthy Plate Balance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Plate Balance Score</p>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className={`text-5xl font-bold ${getScoreColor(plateStatus.score)}`}
          >
            {plateStatus.score}
          </motion.div>
          <p className="text-sm text-muted-foreground mt-1">out of 100</p>
        </div>

        {/* Visual Plate */}
        <div className="relative w-64 h-64 mx-auto">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Plate circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-muted"
            />
            
            {/* Sections */}
            {sections.map((section, index) => {
              const startAngle = (index / sections.length) * 360 - 90;
              const endAngle = ((index + 1) / sections.length) * 360 - 90;
              const percentage = section.value / 100;
              
              const startAngleRad = (startAngle * Math.PI) / 180;
              const endAngleRad = (endAngle * Math.PI) / 180;
              
              const x1 = 100 + 90 * Math.cos(startAngleRad);
              const y1 = 100 + 90 * Math.sin(startAngleRad);
              const x2 = 100 + 90 * Math.cos(endAngleRad);
              const y2 = 100 + 90 * Math.sin(endAngleRad);
              
              const largeArc = percentage > 0.5 ? 1 : 0;
              
              return (
                <g key={section.name}>
                  <path
                    d={`M 100 100 L ${x1} ${y1} A 90 90 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={section.color}
                    fillOpacity={0.3}
                  />
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: percentage }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                    d={`M 100 100 L ${x1} ${y1} A 90 90 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={section.color}
                    fillOpacity={0.6}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="space-y-2">
          {sections.map((section) => (
            <div key={section.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: section.color }}
                />
                <span className="text-sm font-medium">{section.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${section.value}%` }}
                    transition={{ delay: 0.5 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: section.color }}
                  />
                </div>
                <span className="text-sm font-semibold w-12 text-right">
                  {section.value}%
                </span>
                <span className="text-xs text-muted-foreground w-8">
                  (ideal: {section.ideal}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

