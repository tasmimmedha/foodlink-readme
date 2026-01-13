"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterPanelProps {
  title?: string;
  filters: {
    label: string;
    options: FilterOption[];
    selected?: string[];
    onSelect?: (filterKey: string, value: string) => void;
    onRemove?: (filterKey: string, value: string) => void;
  }[];
  onClearAll?: () => void;
  className?: string;
}

export function FilterPanel({ title = "Filters", filters, onClearAll, className }: FilterPanelProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          {onClearAll && (
            <Button variant="ghost" size="sm" onClick={onClearAll}>
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {filters.map((filter) => (
          <div key={filter.label} className="space-y-2">
            <h4 className="text-sm font-medium">{filter.label}</h4>
            <div className="flex flex-wrap gap-2">
              {filter.options.map((option) => {
                const isSelected = filter.selected?.includes(option.value);
                return (
                  <Badge
                    key={option.value}
                    variant={isSelected ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      if (isSelected) {
                        filter.onRemove?.(filter.label, option.value);
                      } else {
                        filter.onSelect?.(filter.label, option.value);
                      }
                    }}
                  >
                    {option.label}
                    {isSelected && (
                      <X className="ml-1 h-3 w-3" onClick={(e) => {
                        e.stopPropagation();
                        filter.onRemove?.(filter.label, option.value);
                      }} />
                    )}
                  </Badge>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

