"use client";

import { PriceEditor } from "@/components/shop/PriceEditor";
import { DiscountSuggestionCard } from "@/components/shop/DiscountSuggestionCard";
import { BulkPriceUpdateForm } from "@/components/shop/BulkPriceUpdateForm";
import {
  usePriceMap,
  useDiscountSuggestions,
  useShopInventory,
  useUpdatePrice,
  useMarkdownCandidates,
} from "@/hooks/use-query-shop";
import { ShopInventoryItem } from "@/lib/server";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PriceMappingPage() {
  const { data: priceMap = [] } = usePriceMap();
  const { data: suggestions = [] } = useDiscountSuggestions();
  const { data: inventory = [] } = useShopInventory();
  const { data: markdownCandidates = [] } = useMarkdownCandidates();
  const updatePriceMutation = useUpdatePrice();

  const featuredSku: ShopInventoryItem | undefined = useMemo(
    () => inventory.find((item) => item.markdownStatus !== "none") ?? inventory[0],
    [inventory]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Price mapping & markdowns</h1>
        <p className="text-sm text-slate-500">
          Update prices via percentage or fixed markdowns, and review change history.
        </p>
      </div>

      {featuredSku && (
        <PriceEditor
          currentPrice={featuredSku.price}
          onApply={(newPrice, payload) =>
            updatePriceMutation.mutate({
              skuId: featuredSku.id,
              newPrice,
              method: payload.method,
              changeValue: payload.value,
              notes: "Manual adjustment",
            })
          }
        />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-3xl border-slate-100 bg-white/95 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Discount suggestions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {suggestions.map((suggestion) => {
              const targetSku = inventory.find((item) => item.id === suggestion.skuId);
              return (
                <DiscountSuggestionCard
                  key={suggestion.id}
                  suggestion={suggestion}
                  onApply={() => {
                    if (!targetSku) return;
                    const newPrice = Number(
                      (targetSku.price * (1 - suggestion.suggestedDiscountPct / 100)).toFixed(2)
                    );
                    updatePriceMutation.mutate({
                      skuId: suggestion.skuId,
                      newPrice,
                      method: "percentage",
                      changeValue: suggestion.suggestedDiscountPct,
                      notes: suggestion.reason,
                    });
                  }}
                />
              );
            })}
            {suggestions.length === 0 && (
              <p className="text-sm text-slate-500">No suggestions pending action.</p>
            )}
          </CardContent>
        </Card>

        <BulkPriceUpdateForm
          selectionCount={markdownCandidates.length}
          onApply={(payload) => {
            markdownCandidates.slice(0, 5).forEach((item) => {
              const newPrice =
                payload.method === "percentage"
                  ? Number((item.price * (1 - payload.value / 100)).toFixed(2))
                  : Math.max(0, item.price - payload.value);
              updatePriceMutation.mutate({
                skuId: item.id,
                newPrice,
                method: payload.method,
                changeValue: payload.value,
                notes: "Bulk markdown",
              });
            });
          }}
          disabled={markdownCandidates.length === 0}
        />
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white/95 p-5 shadow-lg">
        <p className="text-sm font-semibold text-slate-600">Recent price changes</p>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          {priceMap.slice(0, 6).map((entry) => (
            <div
              key={entry.id}
              className="flex flex-wrap items-center justify-between rounded-2xl border border-slate-100 px-3 py-2"
            >
              <div>
                <p className="font-semibold">{entry.skuName}</p>
                <p className="text-xs text-slate-400">
                  {new Date(entry.effectiveAt).toLocaleString()} · {entry.method} change
                </p>
              </div>
              <p>
                ৳{entry.oldPrice.toFixed(2)} →{" "}
                <span className="font-semibold text-emerald-600">
                  ৳{entry.newPrice.toFixed(2)}
                </span>
              </p>
            </div>
          ))}
          {priceMap.length === 0 && <p>No price changes recorded yet.</p>}
        </div>
      </div>
    </div>
  );
}

