"use client";

import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";
import { usePriceComparisons } from "@/hooks/use-query-family";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import { cn } from "@/lib/helpers";

interface ShoppingPriceCompareProps {
  itemName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShoppingPriceCompare({
  itemName,
  open,
  onOpenChange,
}: ShoppingPriceCompareProps) {
  const { data: comparison, isLoading } = usePriceComparisons(itemName);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Price Comparison: {itemName}</DialogTitle>
          <DialogDescription>
            Compare prices across local stores to find the best deal
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <SkeletonLoader variant="card" count={3} />
        ) : comparison ? (
          <div className="space-y-4 mt-4">
            {comparison.stores.map((store, index) => {
              const isBestPrice = store.storeName === comparison.bestPrice.storeName;
              const isAvailable = store.available;

              return (
                <motion.div
                  key={store.storeName}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all",
                    isBestPrice && isAvailable
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isAvailable ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <p className="font-semibold">{store.storeName}</p>
                        <p className="text-sm text-muted-foreground">
                          {store.unit || "per unit"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-2xl font-bold">${store.price.toFixed(2)}</p>
                        {!isAvailable && (
                          <p className="text-xs text-red-500">Out of stock</p>
                        )}
                      </div>
                      {isBestPrice && isAvailable && (
                        <Badge className="bg-primary text-primary-foreground">
                          Best Price
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            <div className="mt-6 p-4 rounded-lg bg-muted">
              <p className="text-sm font-medium mb-2">💡 Money Saving Tip</p>
              <p className="text-sm text-muted-foreground">
                Save ${(comparison.stores[0].price - comparison.bestPrice.price).toFixed(2)} by
                shopping at {comparison.bestPrice.storeName}!
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No price comparison available for this item</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

