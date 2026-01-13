"use client";

import { PageHeader } from "@/components/shared/page-header";
import { ModuleSectionHeader } from "@/components/shared/module-section-header";
import { EmptyState } from "@/components/shared/empty-state";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import { useShoppingListItems } from "@/hooks/use-query-shopping";
import { ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ShoppingPage() {
  const { data: items, isLoading } = useShoppingListItems();

  return (
    <div>
      <PageHeader
        title="Shopping List"
        description="Manage your shopping list and track items to purchase"
      />
      <ModuleSectionHeader
        title="Shopping Items"
        action={{
          label: "Add Item",
          onClick: () => {
            // TODO: Open add item modal
          },
        }}
      />
      {isLoading ? (
        <SkeletonLoader variant="card" count={6} />
      ) : !items || items.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="No items in shopping list"
          description="Start by adding items to your shopping list"
          action={{
            label: "Add Item",
            onClick: () => {
              // TODO: Open add item modal
            },
          }}
        />
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className={item.completed ? "line-through text-muted-foreground" : ""}>
                    {item.name}
                  </CardTitle>
                  <div className="flex gap-2">
                    {item.category && <Badge variant="secondary">{item.category}</Badge>}
                    {item.priority && (
                      <Badge
                        variant={
                          item.priority === "high"
                            ? "destructive"
                            : item.priority === "medium"
                              ? "default"
                              : "outline"
                        }
                      >
                        {item.priority}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Quantity: {item.quantity} {item.unit || ""}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

