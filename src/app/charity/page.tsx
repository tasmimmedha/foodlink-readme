"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HandHeart } from "lucide-react";

export default function CharityDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Charity Dashboard"
        description="Manage donations, coordinate food distribution, and track impact"
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HandHeart className="h-5 w-5" />
            Charity Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Charity dashboard is coming soon. This will include donation management, food distribution tracking, and impact metrics.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

