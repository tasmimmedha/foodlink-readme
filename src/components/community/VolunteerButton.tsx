"use client";

import { Button } from "@/components/ui/button";
import { Loader2, HandHeart } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/helpers";

interface VolunteerButtonProps {
  onVolunteer: () => Promise<void> | void;
  label?: string;
  className?: string;
}

export function VolunteerButton({ onVolunteer, label = "Join as Volunteer", className }: VolunteerButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      await onVolunteer();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      className={cn(
        "relative overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl",
        className
      )}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <HandHeart className="h-4 w-4 mr-2" />}
      {loading ? "Updating..." : label}
    </Button>
  );
}

