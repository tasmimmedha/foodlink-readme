"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  useShopInventory,
  useAddSKU,
  useUpdateSKU,
  useDeleteSKU,
  useAddSurplusItem,
} from "@/hooks/use-query-shop";
import { useQueryClient } from "@tanstack/react-query";
import { InventoryFilterBar } from "@/components/shop/InventoryFilterBar";
import { Button } from "@/components/ui/button";
import { AddSKUForm } from "@/components/shop/AddSKUForm";
import { SKUCard } from "@/components/shop/SKUCard";
import { SKUDetailModal } from "@/components/shop/SKUDetailModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { ShopInventoryItem } from "@/lib/server";
import { useToast } from "@/components/ui/use-toast";

export default function ShopInventoryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>();
  const [storage, setStorage] = useState<"frozen" | "chilled" | "ambient" | undefined>();
  const [detailItem, setDetailItem] = useState<ShopInventoryItem | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    if (searchParams.get("action") === "add") {
      setShowAdd(true);
      // Clean up URL
      router.replace("/shop/inventory", { scroll: false });
    }
  }, [searchParams, router]);

  const { data: inventory = [], isLoading } = useShopInventory({
    search,
    category,
    storageType: storage,
  });
  const queryClient = useQueryClient();
  const addMutation = useAddSKU();
  const updateMutation = useUpdateSKU();
  const deleteMutation = useDeleteSKU();
  const addSurplusMutation = useAddSurplusItem();
  const { toast } = useToast();

  const categories = Array.from(new Set(inventory.map((item) => item.category))).sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Retail inventory</h1>
          <p className="text-sm text-slate-500">Manage SKUs, pricing, and stock levels</p>
        </div>
        <div className="flex gap-2">
          <Button className="rounded-full gap-2" onClick={() => setShowAdd(true)}>
            <Plus className="h-4 w-4" />
            Add SKU
          </Button>
          <Button
            variant="ghost"
            className="rounded-full text-rose-600"
            onClick={async () => {
              const zeroStockItems = inventory.filter((item) => item.stockQuantity === 0);
              if (zeroStockItems.length === 0) {
                toast({ title: "No items to clean", description: "All items have stock." });
                return;
              }
              if (confirm(`Delete ${zeroStockItems.length} items with zero stock?`)) {
                try {
                  await Promise.all(zeroStockItems.map((item) => deleteMutation.mutateAsync(item.id)));
                  toast({ title: "Cleaned up", description: `Removed ${zeroStockItems.length} items with zero stock.` });
                } catch (error) {
                  console.error("Error cleaning zero stock:", error);
                  toast({ title: "Unable to clean items", variant: "destructive" });
                }
              }
            }}
          >
            Clean zero stock
          </Button>
        </div>
      </div>

      <InventoryFilterBar
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        storageType={storage}
        onStorageChange={setStorage}
        categories={categories}
      />

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading inventory...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {inventory.map((item) => (
            <SKUCard
              key={item.id}
              item={item}
              onEdit={(sku) => {
                setDetailItem(sku);
              }}
              onMarkSurplus={(sku) => {
                addSurplusMutation.mutate(
                  {
                    skuName: sku.name,
                    quantity: sku.stockQuantity,
                    unit: sku.unit,
                    expiryWindowStart: new Date().toISOString(),
                    expiryWindowEnd: sku.expiryDate,
                    condition: "near-expiry",
                    imageData: sku.imageData,
                  },
                  {
                    onSuccess: () => {
                      toast({
                        title: "Marked for surplus",
                        description: `${sku.name} ready for donation`,
                      });
                      queryClient.invalidateQueries({ queryKey: ["shop", "surplus"] });
                    },
                    onError: () => {
                      toast({
                        title: "Error",
                        description: "Failed to mark item as surplus",
                        variant: "destructive",
                      });
                    },
                  }
                );
              }}
              onOpenDetail={(sku) => setDetailItem(sku)}
            />
          ))}
          {inventory.length === 0 && (
            <p className="text-sm text-slate-500">
              No items match your filters. Try adding a new SKU.
            </p>
          )}
        </div>
      )}

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-2xl rounded-3xl">
          <DialogHeader>
            <DialogTitle>Add new SKU</DialogTitle>
          </DialogHeader>
          <AddSKUForm
            onSubmit={async (values) => {
              try {
                await addMutation.mutateAsync(values);
                toast({ title: "SKU added", description: `${values.name} has been added to inventory.` });
                setShowAdd(false);
              } catch (error) {
                console.error("Error adding SKU:", error);
                toast({ title: "Unable to add SKU", description: "Please try again.", variant: "destructive" });
              }
            }}
            isSubmitting={addMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <SKUDetailModal
        open={Boolean(detailItem)}
        item={detailItem}
        onClose={() => setDetailItem(null)}
        onEdit={async (sku) => {
          try {
            await updateMutation.mutateAsync({ id: sku.id, data: { markdownStatus: "scheduled" } });
            toast({ title: "SKU updated", description: `${sku.name} markdown scheduled.` });
          } catch (error) {
            console.error("Error updating SKU:", error);
            toast({ title: "Unable to update SKU", variant: "destructive" });
          }
        }}
        onMarkDown={async (sku) => {
          try {
            await updateMutation.mutateAsync({ id: sku.id, data: { markdownStatus: "active" } });
            toast({ title: "Markdown activated", description: `${sku.name} is now on markdown.` });
          } catch (error) {
            console.error("Error activating markdown:", error);
            toast({ title: "Unable to activate markdown", variant: "destructive" });
          }
        }}
      />
    </div>
  );
}

