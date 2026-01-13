"use client";

import type { NGOPartnerProfile } from "@/lib/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Clock, Phone, TrendingUp } from "lucide-react";

interface PartnerCardProps {
  partner: NGOPartnerProfile;
  onSelect?: (partner: NGOPartnerProfile) => void;
}

export function PartnerCard({ partner, onSelect }: PartnerCardProps) {
  return (
    <Card
      className="cursor-pointer rounded-3xl border-slate-100 bg-white/90 shadow-lg shadow-emerald-100/50 transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-black/40"
      onClick={() => onSelect?.(partner)}
    >
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={partner.avatar} alt={partner.name} />
            <AvatarFallback>{partner.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">{partner.name}</p>
            <p className="text-sm text-slate-500">{partner.type.replace("-", " ")}</p>
          </div>
          <Badge className="ml-auto rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-200">
            {(partner.acceptanceRate * 100).toFixed(0)}% acceptance
          </Badge>
        </div>
        <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-500" />
            {partner.location} • {partner.distanceKm.toFixed(1)} km
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-indigo-500" />
            {partner.operatingHours}
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-slate-400" />
            {partner.contactPhone}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
          <div className="flex items-center gap-1 text-emerald-500">
            <TrendingUp className="h-4 w-4" />
            Avg {partner.avgDonationKg}kg
          </div>
          <span>Last donation {new Date(partner.lastDonationAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}


