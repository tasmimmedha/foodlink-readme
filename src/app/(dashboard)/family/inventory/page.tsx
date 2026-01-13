"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { InventoryItemCard } from "@/components/family/InventoryItemCard";
import { InventoryAddDrawer } from "@/components/family/InventoryAddDrawer";
import { useInventory, useDeleteInventoryItem, useUpdateInventoryItem } from "@/hooks/use-query-family";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import type { InventoryItemResponse } from "@/lib/server";
import { toast } from "@/components/ui/use-toast";

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [expiringFilter, setExpiringFilter] = useState<string>("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItemResponse | null>(null);

  const filter: { category?: string; expiringSoon?: boolean } = {};
  if (categoryFilter !== "all") filter.category = categoryFilter;
  if (expiringFilter === "expiring") filter.expiringSoon = true;

  const { data: inventory, isLoading } = useInventory(filter);
  const deleteMutation = useDeleteInventoryItem();
  const updateMutation = useUpdateInventoryItem();

  const filteredItems = (inventory || []).filter((item) => {
    if (searchQuery) {
      return item.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const handleEdit = (item: InventoryItemResponse) => {
    setEditingItem(item);
    setDrawerOpen(true);
  };

  const handleDelete = async (id: string) => {
    const item = inventory?.find(i => i.id === id);
    if (confirm(`Are you sure you want to delete "${item?.name || 'this item'}"?`)) {
      try {
        await deleteMutation.mutateAsync(id);
        toast({
          title: "Success",
          description: `${item?.name || 'Item'} has been deleted from inventory.`,
        });
      } catch (error) {
        console.error("Error deleting item:", error);
        toast({
          title: "Error",
          description: "Failed to delete item. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        description="Manage your family food inventory"
        action={
          <Button onClick={() => {
            setEditingItem(null);
            setDrawerOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="dairy">Dairy</SelectItem>
            <SelectItem value="vegetables">Vegetables</SelectItem>
            <SelectItem value="fruits">Fruits</SelectItem>
            <SelectItem value="meat">Meat</SelectItem>
            <SelectItem value="seafood">Seafood</SelectItem>
            <SelectItem value="grains">Grains</SelectItem>
            <SelectItem value="bakery">Bakery</SelectItem>
            <SelectItem value="condiments">Condiments</SelectItem>
          </SelectContent>
        </Select>
        <Select value={expiringFilter} onValueChange={setExpiringFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Expiry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>
            <SelectItem value="expiring">Expiring Soon</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inventory Grid */}
      {isLoading ? (
        <SkeletonLoader variant="card" count={6} />
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg font-medium mb-2">No items found</p>
          <p className="text-sm">Add items to start tracking your inventory</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <InventoryItemCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <InventoryAddDrawer
        open={drawerOpen}
        onOpenChange={(open) => {
          setDrawerOpen(open);
          if (!open) {
            setEditingItem(null);
          }
        }}
        editingItem={editingItem}
      />
    </div>
  );
}

