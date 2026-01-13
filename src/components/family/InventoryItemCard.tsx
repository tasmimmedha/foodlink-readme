"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Package, MapPin, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/helpers";
import { cn } from "@/lib/helpers";
import type { InventoryItemResponse } from "@/lib/server";

interface InventoryItemCardProps {
  item: InventoryItemResponse;
  onEdit?: (item: InventoryItemResponse) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export function InventoryItemCard({
  item,
  onEdit,
  onDelete,
  className,
}: InventoryItemCardProps) {
  const [now, setNow] = useState<number | null>(null);

  // Calculate current time only on client after mount
  useEffect(() => {
    setNow(Date.now());
  }, []);

  const expiryDate = item.expiryDate ? new Date(item.expiryDate) : null;
  const daysUntilExpiry = expiryDate && now !== null
    ? Math.ceil((expiryDate.getTime() - now) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          "hover:shadow-xl transition-all cursor-pointer border-2",
          item.isExpired && "border-red-300/60 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20",
          item.isExpiringSoon && !item.isExpired && "border-orange-300/60 bg-gradient-to-br from-orange-50 to-amber-50/50 dark:from-orange-950/30 dark:to-amber-950/20",
          !item.isExpired && !item.isExpiringSoon && "border-gray-200/60 dark:border-gray-800/60",
          className
        )}
      >
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4 gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-gray-100 truncate">{item.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Package className="h-4 w-4" />
                  <span>
                    {item.quantity} {item.unit || "unit"}
                  </span>
                </div>
                {item.location && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      <span>{item.location}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {item.isExpired && (
                <Badge variant="destructive" className="font-semibold">Expired</Badge>
              )}
              {item.isExpiringSoon && !item.isExpired && (
                <Badge variant="outline" className="border-orange-500 text-orange-600 dark:border-orange-400 dark:text-orange-400 font-semibold">
                  Expiring Soon
                </Badge>
              )}
            </div>
          </div>

          {expiryDate && (
            <div className={cn(
              "flex items-center gap-2.5 text-sm mb-4 p-3 rounded-xl",
              item.isExpired && "bg-red-100/50 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/40",
              item.isExpiringSoon && !item.isExpired && "bg-orange-100/50 dark:bg-orange-900/20 border border-orange-200/50 dark:border-orange-800/40",
              !item.isExpired && !item.isExpiringSoon && "bg-muted/50"
            )}>
              <Calendar className={cn(
                "h-4 w-4 flex-shrink-0",
                item.isExpired && "text-red-600 dark:text-red-400",
                item.isExpiringSoon && !item.isExpired && "text-orange-600 dark:text-orange-400",
                !item.isExpired && !item.isExpiringSoon && "text-muted-foreground"
              )} />
              <span className="text-muted-foreground">Expires:</span>
              <span className={cn(
                "font-semibold",
                item.isExpired && "text-red-600 dark:text-red-400",
                item.isExpiringSoon && !item.isExpired && "text-orange-600 dark:text-orange-400"
              )}>
                {formatDate(expiryDate.toISOString())}
                {daysUntilExpiry !== null && (
                  <span className="ml-2 font-normal">
                    ({daysUntilExpiry === 0
                      ? "Today"
                      : daysUntilExpiry === 1
                      ? "Tomorrow"
                      : `${daysUntilExpiry} days`})
                  </span>
                )}
              </span>
            </div>
          )}

          {item.category && (
            <Badge variant="secondary" className="mb-4 font-medium">
              {item.category}
            </Badge>
          )}

          {(onEdit || onDelete) && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(item)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(item.id)}
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

