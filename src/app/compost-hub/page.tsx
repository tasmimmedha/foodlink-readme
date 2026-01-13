"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Recycle } from "lucide-react";

export default function CompostHubDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Compost Hub Dashboard"
        description="Manage compost collection, track waste processing, and coordinate pickups"
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Recycle className="h-5 w-5" />
            Compost Hub Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Compost Hub dashboard is coming soon. This will include collection management, waste processing tracking, and pickup coordination.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

