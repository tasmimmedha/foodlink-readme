"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useExpiringSoon } from "@/hooks/use-query-family";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import { formatDate } from "@/lib/helpers";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ExpiringSoonList() {
  const { data: items, isLoading } = useExpiringSoon();
  const [now, setNow] = useState<number | null>(null);

  // Calculate current time only on client after mount
  useEffect(() => {
    setNow(Date.now());
  }, []);

  // All hooks must be called before any early returns
  const expiringItems = useMemo(() => items || [], [items]);
  const itemsToShow = useMemo(() => expiringItems.slice(0, 5), [expiringItems]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expiring Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <SkeletonLoader variant="card" count={3} />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow border-amber-100/60 dark:border-amber-900/40">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2.5 text-lg">
              <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-amber-100 dark:bg-amber-900/40">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <span>Expiring Soon</span>
            </CardTitle>
            {expiringItems.length > 0 && (
              <Badge variant="destructive" className="text-xs font-semibold px-2.5 py-1">
                {expiringItems.length}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {expiringItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-muted-foreground"
            >
              <div className="flex items-center justify-center h-16 w-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <Clock className="h-8 w-8 text-emerald-600 dark:text-emerald-400 opacity-70" />
              </div>
              <p className="font-medium text-base">No items expiring soon!</p>
              <p className="text-sm mt-1.5">Great job managing your inventory</p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {itemsToShow.map((item, index) => {
                const expiryDate = item.expiryDate ? new Date(item.expiryDate) : null;
                const daysUntilExpiry = expiryDate && now !== null
                  ? Math.ceil((expiryDate.getTime() - now) / (1000 * 60 * 60 * 24))
                  : null;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-orange-50/80 to-amber-50/80 dark:from-orange-950/30 dark:to-amber-950/30 border border-orange-200/60 dark:border-orange-800/40 hover:shadow-md hover:border-orange-300 dark:hover:border-orange-700 transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">{item.name}</p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-xs text-muted-foreground">
                          {item.quantity} {item.unit || "unit"}
                        </span>
                        {daysUntilExpiry !== null && (
                          <>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                              {daysUntilExpiry === 0
                                ? "Expires today"
                                : daysUntilExpiry === 1
                                ? "Expires tomorrow"
                                : `${daysUntilExpiry} days left`}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    {expiryDate && (
                      <Badge variant="outline" className="ml-3 flex-shrink-0 text-xs border-orange-300 dark:border-orange-700">
                        {formatDate(expiryDate.toISOString())}
                      </Badge>
                    )}
                  </motion.div>
                );
              })}
              {expiringItems.length > 5 && (
                <Link href="/family/inventory?filter=expiring">
                  <Button variant="ghost" className="w-full mt-3 hover:bg-amber-50 dark:hover:bg-amber-950/30">
                    View all {expiringItems.length} items
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

