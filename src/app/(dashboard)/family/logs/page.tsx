"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { RecentLogs } from "@/components/family/RecentLogs";
import { useRecentLogs } from "@/hooks/use-query-family";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Share2 } from "lucide-react";
import { formatDate } from "@/lib/helpers";

export default function LogsPage() {
  const [filter, setFilter] = useState<string>("all");
  const { data: logs, isLoading } = useRecentLogs(100);

  const filteredLogs = (logs || []).filter((log) => {
    if (filter === "all") return true;
    if (filter === "consumed") return !log.wasWasted && !log.notes?.toLowerCase().includes("shared");
    if (filter === "wasted") return log.wasWasted;
    if (filter === "shared") return log.notes?.toLowerCase().includes("shared") || log.notes?.toLowerCase().includes("donated");
    return true;
  });

  const stats = {
    total: logs?.length || 0,
    consumed: logs?.filter((log) => !log.wasWasted && !log.notes?.toLowerCase().includes("shared")).length || 0,
    wasted: logs?.filter((log) => log.wasWasted).length || 0,
    shared: logs?.filter((log) => log.notes?.toLowerCase().includes("shared") || log.notes?.toLowerCase().includes("donated")).length || 0,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Consumption Logs"
        description="Track all your food consumption and waste"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Logs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.consumed}</div>
            <div className="text-sm text-muted-foreground">Consumed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.wasted}</div>
            <div className="text-sm text-muted-foreground">Wasted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.shared}</div>
            <div className="text-sm text-muted-foreground">Shared</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex justify-end">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter logs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Logs</SelectItem>
            <SelectItem value="consumed">Consumed</SelectItem>
            <SelectItem value="wasted">Wasted</SelectItem>
            <SelectItem value="shared">Shared</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Logs List */}
      {isLoading ? (
        <SkeletonLoader variant="card" count={10} />
      ) : filteredLogs.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg font-medium mb-2">No logs found</p>
          <p className="text-sm">Start logging your food consumption to see activity here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log) => {
            const consumedDate = new Date(log.consumedAt);
            const isShared = log.notes?.toLowerCase().includes("shared") || log.notes?.toLowerCase().includes("donated");

            return (
              <Card key={log.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {log.wasWasted ? (
                        <XCircle className="h-6 w-6 text-red-500" />
                      ) : isShared ? (
                        <Share2 className="h-6 w-6 text-blue-500" />
                      ) : (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-lg">{log.foodName}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {log.quantity} {log.unit || "unit"}
                            {log.category && ` • ${log.category}`}
                          </p>
                          {log.notes && (
                            <p className="text-sm text-muted-foreground mt-2 italic">
                              "{log.notes}"
                            </p>
                          )}
                        </div>
                        <Badge
                          variant={log.wasWasted ? "destructive" : isShared ? "default" : "secondary"}
                        >
                          {log.wasWasted ? "Wasted" : isShared ? "Shared" : "Consumed"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">
                        {formatDate(consumedDate.toISOString())}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

