"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/helpers";

interface ExpiryStatusBadgeProps {
  expiryDate: string | Date;
  className?: string;
}

export function ExpiryStatusBadge({ expiryDate, className }: ExpiryStatusBadgeProps) {
  const expiry = typeof expiryDate === "string" ? new Date(expiryDate) : expiryDate;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiryDateOnly = new Date(expiry);
  expiryDateOnly.setHours(0, 0, 0, 0);

  const diffTime = expiryDateOnly.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let variant: "default" | "destructive" | "secondary" | "outline" = "default";
  let label = "";

  if (diffDays < 0) {
    variant = "destructive";
    label = "Expired";
  } else if (diffDays === 0) {
    variant = "destructive";
    label = "Expires Today";
  } else if (diffDays <= 3) {
    variant = "destructive";
    label = `Expires in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
  } else if (diffDays <= 7) {
    variant = "secondary";
    label = `Expires in ${diffDays} days`;
  } else {
    variant = "default";
    label = "Fresh";
  }

  return (
    <Badge variant={variant} className={cn("text-xs", className)}>
      {label}
    </Badge>
  );
}

