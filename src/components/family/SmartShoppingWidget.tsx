"use client";

import { SectionCard } from "@/components/shared/section-card";
import { GlowButton } from "@/components/shared/glow-button";
import { useSmartShoppingList } from "@/hooks/use-query-family";
import { ShoppingCart, TrendingDown, ArrowRight } from "lucide-react";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import { AnimatedCounter } from "@/components/landing/AnimatedCounter";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/helpers";
import Link from "next/link";

export function SmartShoppingWidget() {
  const { data, isLoading } = useSmartShoppingList();

  if (isLoading) {
    return (
      <SectionCard title="Smart Shopping List">
        <SkeletonLoader variant="card" count={3} />
      </SectionCard>
    );
  }

  const shoppingList = data || {
    items: [],
    totalEstimatedCost: 0,
    bestStore: "",
    savings: 0,
  };

  const priorityColors = {
    high: "destructive",
    medium: "default",
    low: "secondary",
  } as const;

  return (
    <SectionCard
      title="Smart Shopping List"
      description="AI-powered shopping list with price comparisons"
    >
      <div className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-[#f9fafb] rounded-lg border border-blue-200/50">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              <span className="text-xs text-blue-700">Total Items</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">
              <AnimatedCounter value={shoppingList.items.length} />
            </div>
          </div>

          <div className="p-4 bg-[#f9fafb] rounded-lg border border-green-200/50">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-5 w-5 text-green-600" />
              <span className="text-xs text-green-700">Savings</span>
            </div>
            <div className="text-2xl font-bold text-green-900">
              <AnimatedCounter
                value={shoppingList.savings}
                prefix="$"
                suffix=""
              />
            </div>
          </div>
        </div>

        {/* Estimated Cost */}
        <div className="p-4 bg-[#f9fafb] rounded-lg border border-purple-200/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-purple-900">
                Estimated Total Cost
              </div>
              <div className="text-2xl font-bold text-purple-900 mt-1">
                {formatCurrency(shoppingList.totalEstimatedCost)}
              </div>
            </div>
            {shoppingList.bestStore && (
              <div className="text-right">
                <div className="text-xs text-purple-700">Best Store</div>
                <div className="text-sm font-semibold text-purple-900">
                  {shoppingList.bestStore}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Top Items Preview */}
        {shoppingList.items.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-3 text-muted-foreground">
              Top Items
            </h4>
            <div className="space-y-2">
              {shoppingList.items.slice(0, 5).map((item) => (
                 <Card
                   key={item.id}
                   className="p-3 bg-[#f9fafb] border-muted-foreground/10 hover:bg-[#f3f4f6] transition-colors"
                 >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{item.name}</span>
                      <Badge
                        variant={priorityColors[item.priority]}
                        className="text-xs"
                      >
                        {item.priority}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {item.quantity} {item.unit || "units"}
                      {item.estimatedPrice &&
                        ` • ${formatCurrency(item.estimatedPrice)}`}
                    </div>
                  </div>
                  {item.stores.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {item.stores.length} stores
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* View Full List Button */}
        <Link href="/family/shopping-list">
          <GlowButton className="w-full" size="lg">
            View Full Smart Shopping List
            <ArrowRight className="h-4 w-4 ml-2" />
          </GlowButton>
        </Link>
      </div>
    </SectionCard>
  );
}

