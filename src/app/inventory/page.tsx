"use client";

import { PageHeader } from "@/components/shared/page-header";
import { ModuleSectionHeader } from "@/components/shared/module-section-header";
import { InventoryItemCard } from "@/components/shared/inventory-item-card";
import { EmptyState } from "@/components/shared/empty-state";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import { useInventoryItems } from "@/hooks/use-query-inventory";
import { Package } from "lucide-react";

export default function InventoryPage() {
  const { data: items, isLoading } = useInventoryItems();

  return (
    <div>
      <PageHeader
        title="Inventory"
        description="Manage your food inventory and track expiry dates"
      />
      <ModuleSectionHeader
        title="All Items"
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
          icon={Package}
          title="No items in inventory"
          description="Start by adding items to your inventory"
          action={{
            label: "Add Item",
            onClick: () => {
              // TODO: Open add item modal
            },
          }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <InventoryItemCard
              key={item.id}
              id={item.id}
              name={item.name}
              quantity={item.quantity}
              unit={item.unit}
              expiryDate={item.expiryDate}
              category={item.category}
              location={item.location}
            />
          ))}
        </div>
      )}
    </div>
  );
}

