"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateInventoryItem, useUpdateInventoryItem } from "@/hooks/use-query-family";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import type { InventoryItemResponse } from "@/lib/server";
import { useEffect } from "react";

interface InventoryAddDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem?: InventoryItemResponse | null;
}

export function InventoryAddDrawer({ open, onOpenChange, editingItem }: InventoryAddDrawerProps) {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    unit: "",
    category: "",
    location: "",
    expiryDate: "",
  });

  const createMutation = useCreateInventoryItem();
  const updateMutation = useUpdateInventoryItem();

  // Populate form when editing
  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || "",
        quantity: editingItem.quantity?.toString() || "",
        unit: editingItem.unit || "",
        category: editingItem.category || "",
        location: editingItem.location || "",
        expiryDate: editingItem.expiryDate ? new Date(editingItem.expiryDate).toISOString().split('T')[0] : "",
      });
    } else {
      setFormData({
        name: "",
        quantity: "",
        unit: "",
        category: "",
        location: "",
        expiryDate: "",
      });
    }
  }, [editingItem, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        // Update existing item
        await updateMutation.mutateAsync({
          id: editingItem.id,
          input: {
            name: formData.name,
            quantity: parseFloat(formData.quantity) || 1,
            unit: formData.unit || undefined,
            category: formData.category || undefined,
            location: formData.location || undefined,
            expiryDate: formData.expiryDate || undefined,
          },
        });
        toast({
          title: "Success",
          description: `${formData.name} has been updated.`,
        });
      } else {
        // Create new item
        await createMutation.mutateAsync({
          name: formData.name,
          quantity: parseFloat(formData.quantity) || 1,
          unit: formData.unit || undefined,
          category: formData.category || undefined,
          location: formData.location || undefined,
          expiryDate: formData.expiryDate || undefined,
        });
        toast({
          title: "Success",
          description: `${formData.name} has been added to your inventory.`,
        });
      }
      onOpenChange(false);
      setFormData({
        name: "",
        quantity: "",
        unit: "",
        category: "",
        location: "",
        expiryDate: "",
      });
    } catch (error) {
      console.error("Error saving inventory item:", error);
      toast({
        title: "Error",
        description: `Failed to ${editingItem ? 'update' : 'add'} inventory item. Please try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{editingItem ? "Edit Inventory Item" : "Add Inventory Item"}</SheetTitle>
          <SheetDescription>
            {editingItem ? "Update item details" : "Add a new item to your family inventory"}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <Label htmlFor="name">Item Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g., Milk, Eggs, Tomatoes"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
                placeholder="1"
              />
            </div>
            <div>
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="e.g., kg, liter, pieces"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
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
          </div>

          <div>
            <Label htmlFor="location">Storage Location</Label>
            <Select
              value={formData.location}
              onValueChange={(value) => setFormData({ ...formData, location: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fridge">Fridge</SelectItem>
                <SelectItem value="freezer">Freezer</SelectItem>
                <SelectItem value="pantry">Pantry</SelectItem>
                <SelectItem value="counter">Counter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              id="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingItem ? "Update Item" : "Add Item"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

