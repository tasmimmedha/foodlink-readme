"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock } from "lucide-react";
import { formatDate } from "@/lib/helpers";
import { cn } from "@/lib/helpers";

interface LeftoverCardProps {
  id: string;
  title: string;
  description: string;
  location: string;
  availableUntil: string;
  imageUrl?: string;
  category?: string;
  onClaim?: (id: string) => void;
  className?: string;
}

export function LeftoverCard({
  id,
  title,
  description,
  location,
  availableUntil,
  imageUrl,
  category,
  onClaim,
  className,
}: LeftoverCardProps) {
  return (
    <Card className={cn("overflow-hidden hover:shadow-md transition-shadow", className)}>
      {imageUrl && (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          {category && <Badge variant="secondary">{category}</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Available until {formatDate(availableUntil)}</span>
          </div>
        </div>
        {onClaim && (
          <Button onClick={() => onClaim(id)} className="w-full">
            Claim Leftover
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

