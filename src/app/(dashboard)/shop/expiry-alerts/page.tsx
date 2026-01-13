"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ExpiryAlertCard } from "@/components/shop/ExpiryAlertCard";
import {
  useExpiringItems,
  useUpdateSKU,
  useAddSurplusItem,
} from "@/hooks/use-query-shop";
import { useToast } from "@/components/ui/use-toast";
import { ShopInventoryItem } from "@/lib/server";
import { ensureShopSeedData } from "@/lib/server/shop.seed";

export default function ExpiryAlertsPage() {
  const [seedReady, setSeedReady] = useState(false);
  const queryClient = useQueryClient();
  const { data } = useExpiringItems({ enabled: seedReady });

  useEffect(() => {
    ensureShopSeedData()
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["shop", "inventory", "expiring"] });
        setSeedReady(true);
      })
      .catch((err) => {
        console.error("Failed to seed shop data:", err);
        setSeedReady(true);
      });
  }, [queryClient]);
  const updateSku = useUpdateSKU();
  const addSurplus = useAddSurplusItem();
  const { toast } = useToast();

  const handleMarkDown = (item: ShopInventoryItem) => {
    updateSku.mutate({
      id: item.id,
      data: { markdownStatus: "active" },
    });
    toast({ title: "Markdown scheduled", description: `${item.name} discounted` });
  };

  const handleMoveToSurplus = (item: ShopInventoryItem) => {
    addSurplus.mutate({
      skuName: item.name,
      quantity: item.stockQuantity,
      unit: item.unit,
      expiryWindowStart: new Date().toISOString(),
      expiryWindowEnd: item.expiryDate,
      condition: "near-expiry",
      imageData: item.imageData,
    });
    toast({ title: "Moved to surplus queue", description: item.name });
  };

  const handleWaste = (item: ShopInventoryItem) => {
    updateSku.mutate({
      id: item.id,
      data: { stockQuantity: 0 },
    });
    toast({ title: "Logged waste", description: `${item.name} set to zero stock` });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Expiry alerts</h1>
        <p className="text-sm text-slate-500">
          Prioritize markdowns or surplus donations based on urgency.
        </p>
      </div>

      <AlertSection
        title="Expiring today"
        items={data?.today ?? []}
        level="high"
        onMarkDown={handleMarkDown}
        onSurplus={handleMoveToSurplus}
        onWaste={handleWaste}
      />
      <AlertSection
        title="Expiring in 2 days"
        items={data?.twoDays ?? []}
        level="medium"
        onMarkDown={handleMarkDown}
        onSurplus={handleMoveToSurplus}
        onWaste={handleWaste}
      />
      <AlertSection
        title="Expiring in 3-5 days"
        items={data?.threeToFive ?? []}
        level="low"
        onMarkDown={handleMarkDown}
        onSurplus={handleMoveToSurplus}
        onWaste={handleWaste}
      />
    </div>
  );
}

function AlertSection({
  title,
  items,
  level,
  onMarkDown,
  onSurplus,
  onWaste,
}: {
  title: string;
  items: ShopInventoryItem[];
  level: "high" | "medium" | "low";
  onMarkDown: (item: ShopInventoryItem) => void;
  onSurplus: (item: ShopInventoryItem) => void;
  onWaste: (item: ShopInventoryItem) => void;
}) {
  if (items.length === 0) return null;
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <ExpiryAlertCard
            key={item.id}
            item={item}
            level={level}
            daysToExpire={Math.max(
              0,
              Math.floor((new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            )}
            onMarkDown={onMarkDown}
            onMoveToSurplus={onSurplus}
            onMarkWaste={onWaste}
          />
        ))}
      </div>
    </section>
  );
}

