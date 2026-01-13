"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, CheckCircle2, XCircle, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRecentLogs } from "@/hooks/use-query-family";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import { formatDate } from "@/lib/helpers";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function RecentLogs() {
  const { data: logs, isLoading } = useRecentLogs(10);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <SkeletonLoader variant="card" count={5} />
        </CardContent>
      </Card>
    );
  }

  const recentLogs = logs || [];

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentLogs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No recent activity</p>
            <p className="text-sm mt-1">Start logging your food consumption</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentLogs.map((log, index) => {
              const consumedDate = new Date(log.consumedAt);
              const isShared = log.notes?.toLowerCase().includes("shared") || log.notes?.toLowerCase().includes("donated");

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="mt-1">
                    {log.wasWasted ? (
                      <XCircle className="h-5 w-5 text-red-500" />
                    ) : isShared ? (
                      <Share2 className="h-5 w-5 text-blue-500" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-semibold">{log.foodName}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {log.quantity} {log.unit || "unit"}
                          {log.notes && (
                            <>
                              {" • "}
                              <span className="italic">{log.notes}</span>
                            </>
                          )}
                        </p>
                      </div>
                      <Badge
                        variant={log.wasWasted ? "destructive" : isShared ? "default" : "secondary"}
                        className="shrink-0"
                      >
                        {log.wasWasted ? "Wasted" : isShared ? "Shared" : "Consumed"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDate(consumedDate.toISOString())}
                    </p>
                  </div>
                </motion.div>
              );
            })}
            <Link href="/family/logs">
              <Button variant="ghost" className="w-full mt-2">
                View all logs
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

