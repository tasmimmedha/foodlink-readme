"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ShoppingPriceCompare } from "@/components/family/ShoppingPriceCompare";
import {
  useShoppingList,
  useAddShoppingItem,
  useUpdateShoppingItem,
  useDeleteShoppingItem,
  useComputeMissingItems,
} from "@/hooks/use-query-family";
import { Button } from "@/components/ui/button";
import { Plus, Check, X, DollarSign, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

export default function ShoppingListPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", quantity: "", unit: "" });

  const { data: shoppingList, isLoading } = useShoppingList(false);
  const addMutation = useAddShoppingItem();
  const updateMutation = useUpdateShoppingItem();
  const deleteMutation = useDeleteShoppingItem();
  const computeMutation = useComputeMissingItems();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addMutation.mutateAsync({
        name: formData.name,
        quantity: parseFloat(formData.quantity) || 1,
        unit: formData.unit || undefined,
        priority: "medium",
      });
      toast({
        title: "Success",
        description: `${formData.name} has been added to your shopping list.`,
      });
      setDialogOpen(false);
      setFormData({ name: "", quantity: "", unit: "" });
    } catch (error) {
      console.error("Error adding item:", error);
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTogglePurchased = async (id: string, purchased: boolean) => {
    try {
      await updateMutation.mutateAsync({ id, input: { purchased: !purchased } });
      const item = items.find(i => i.id === id);
      toast({
        title: purchased ? "Marked as not purchased" : "Marked as purchased",
        description: `${item?.name || 'Item'} ${purchased ? 'removed from' : 'added to'} purchased list.`,
      });
    } catch (error) {
      console.error("Error updating item:", error);
      toast({
        title: "Error",
        description: "Failed to update item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    const item = items.find(i => i.id === id);
    if (confirm(`Remove "${item?.name || 'this item'}" from shopping list?`)) {
      try {
        await deleteMutation.mutateAsync(id);
        toast({
          title: "Removed",
          description: `${item?.name || 'Item'} has been removed from shopping list.`,
        });
      } catch (error) {
        console.error("Error deleting item:", error);
        toast({
          title: "Error",
          description: "Failed to remove item. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleComputeMissing = async () => {
    try {
      await computeMutation.mutateAsync();
      toast({
        title: "Success",
        description: "Shopping list has been updated with missing items.",
      });
    } catch (error) {
      console.error("Error computing missing items:", error);
      toast({
        title: "Error",
        description: "Failed to generate missing items. Please try again.",
        variant: "destructive",
      });
    }
  };

  const items = shoppingList || [];
  const highPriority = items.filter((item) => item.priority === "high");
  const mediumPriority = items.filter((item) => item.priority === "medium");
  const lowPriority = items.filter((item) => item.priority === "low");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shopping List"
        description="Smart shopping list with price comparisons"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleComputeMissing} disabled={computeMutation.isPending}>
              <RefreshCw className={`h-4 w-4 mr-2 ${computeMutation.isPending ? "animate-spin" : ""}`} />
              Auto-generate
            </Button>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        }
      />

      {/* Summary Stats */}
      {items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{items.length}</div>
              <div className="text-sm text-muted-foreground">Total Items</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {items.filter((i) => i.purchased).length}
              </div>
              <div className="text-sm text-muted-foreground">Purchased</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {items.filter((i) => i.priority === "high" && !i.purchased).length}
              </div>
              <div className="text-sm text-muted-foreground">High Priority</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">
                ${items.reduce((sum, i) => sum + (i.estimatedPrice || 0), 0).toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Estimated Total</div>
            </CardContent>
          </Card>
        </div>
      )}

      {isLoading ? (
        <SkeletonLoader variant="card" count={5} />
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg font-medium mb-2">Your shopping list is empty</p>
          <p className="text-sm mb-4">Add items manually or auto-generate from inventory</p>
          <Button onClick={handleComputeMissing} disabled={computeMutation.isPending}>
            <RefreshCw className={`h-4 w-4 mr-2 ${computeMutation.isPending ? "animate-spin" : ""}`} />
            Auto-generate from inventory
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {highPriority.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3 text-red-600">High Priority</h3>
              <div className="space-y-2">
                {highPriority.map((item) => (
                  <ShoppingListItem
                    key={item.id}
                    item={item}
                    onTogglePurchased={handleTogglePurchased}
                    onDelete={handleDelete}
                    onPriceCompare={() => setSelectedItem(item.name)}
                  />
                ))}
              </div>
            </div>
          )}

          {mediumPriority.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3 text-orange-600">Medium Priority</h3>
              <div className="space-y-2">
                {mediumPriority.map((item) => (
                  <ShoppingListItem
                    key={item.id}
                    item={item}
                    onTogglePurchased={handleTogglePurchased}
                    onDelete={handleDelete}
                    onPriceCompare={() => setSelectedItem(item.name)}
                  />
                ))}
              </div>
            </div>
          )}

          {lowPriority.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Low Priority</h3>
              <div className="space-y-2">
                {lowPriority.map((item) => (
                  <ShoppingListItem
                    key={item.id}
                    item={item}
                    onTogglePurchased={handleTogglePurchased}
                    onDelete={handleDelete}
                    onPriceCompare={() => setSelectedItem(item.name)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Shopping Item</DialogTitle>
            <DialogDescription>Add a new item to your shopping list</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g., Bananas, Milk"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="1"
                />
              </div>
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="e.g., kg, pieces"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={addMutation.isPending}>
                {addMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {selectedItem && (
        <ShoppingPriceCompare
          itemName={selectedItem}
          open={!!selectedItem}
          onOpenChange={(open) => !open && setSelectedItem(null)}
        />
      )}
    </div>
  );
}

function ShoppingListItem({ item, onTogglePurchased, onDelete, onPriceCompare }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3 p-4 rounded-lg border hover:shadow-md transition-all"
    >
      <button
        onClick={() => onTogglePurchased(item.id, item.purchased)}
        className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
          item.purchased
            ? "bg-primary border-primary text-white"
            : "border-muted-foreground/30 hover:border-primary"
        }`}
      >
        {item.purchased && <Check className="h-4 w-4" />}
      </button>
      <div className="flex-1">
        <p className={`font-medium ${item.purchased ? "line-through text-muted-foreground" : ""}`}>
          {item.name}
        </p>
        <p className="text-sm text-muted-foreground">
          {item.quantity} {item.unit || "unit"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {item.estimatedPrice && (
          <Badge variant="outline" className="gap-1">
            <DollarSign className="h-3 w-3" />
            {item.estimatedPrice.toFixed(2)}
          </Badge>
        )}
        <Button variant="ghost" size="sm" onClick={() => onPriceCompare()}>
          Compare
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}

