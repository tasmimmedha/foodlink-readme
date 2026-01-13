"use client";

import { useEffect, useState } from "react";
import { RestaurantInventoryItem } from "@/lib/server/db";
import {
  addStockItem,
  deleteStockItem,
  getRestaurantInventory,
} from "@/lib/server/restaurant.inventory.server";
import { RestaurantInventoryCard } from "@/components/restaurant/RestaurantInventoryCard";
import { InvoiceUpload } from "@/components/restaurant/InvoiceUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/page-header";
import { toast } from "@/components/ui/use-toast";

const INITIAL_FORM = {
  name: "",
  quantity: 0,
  unit: "kg",
  category: "produce",
  expiryDate: "",
  storageType: "fresh" as const,
  batchCode: "",
  alertTags: "",
};

export default function RestaurantInventoryPage() {
  const [items, setItems] = useState<RestaurantInventoryItem[]>([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [invoice, setInvoice] = useState<{ fileName: string; data: string }>();

  const loadItems = async () => {
    const data = await getRestaurantInventory();
    setItems(data);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleChange = <K extends keyof typeof INITIAL_FORM>(key: K, value: (typeof INITIAL_FORM)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAdd = async () => {
    if (!form.name || !form.expiryDate) {
      toast({ title: "Missing information", description: "Please fill in item name and expiry date.", variant: "destructive" });
      return;
    }
    try {
      await addStockItem({
        name: form.name,
        quantity: form.quantity,
        unit: form.unit,
        category: form.category,
        expiryDate: new Date(form.expiryDate).toISOString(),
        storageType: form.storageType,
        batchCode: form.batchCode,
        alertTags: form.alertTags.split(",").map((tag) => tag.trim()).filter(Boolean),
        status: "normal",
        invoiceImage: invoice?.data,
      });
      toast({ title: "Stock added", description: `${form.name} has been added to inventory.` });
      setForm(INITIAL_FORM);
      setInvoice(undefined);
      await loadItems();
    } catch (error) {
      console.error("Error adding stock:", error);
      toast({ title: "Unable to add stock", description: "Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        description="Manage commercial batches, track expiries, and keep invoices on file."
      />
      <div className="rounded-3xl border border-white/60 bg-white/80 dark:bg-gray-900/70 p-6 shadow-lg space-y-4">
        <h1 className="text-xl font-semibold text-gray-900">Add Inventory Batch</h1>
        <div className="grid md:grid-cols-2 gap-4">
          <Input placeholder="Item name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
          <Input placeholder="Category" value={form.category} onChange={(e) => handleChange("category", e.target.value)} />
          <Input
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) => handleChange("quantity", Number(e.target.value))}
          />
          <Input placeholder="Unit" value={form.unit} onChange={(e) => handleChange("unit", e.target.value)} />
          <Input
            placeholder="Expiry date"
            type="datetime-local"
            value={form.expiryDate}
            onChange={(e) => handleChange("expiryDate", e.target.value)}
          />
          <Input
            placeholder="Storage type"
            value={form.storageType}
            onChange={(e) => handleChange("storageType", e.target.value as any)}
          />
          <Input placeholder="Batch code" value={form.batchCode} onChange={(e) => handleChange("batchCode", e.target.value)} />
          <Input placeholder="Alert tags" value={form.alertTags} onChange={(e) => handleChange("alertTags", e.target.value)} />
        </div>
        <InvoiceUpload onUpload={setInvoice} />
        <Button onClick={handleAdd} className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500">
          Add Stock
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {items.map((item) => (
          <RestaurantInventoryCard
            key={item.id}
            item={item}
            onDelete={async (id) => {
              const item = items.find(i => i.id === id);
              if (confirm(`Delete "${item?.name || 'this item'}" from inventory?`)) {
                try {
                  await deleteStockItem(id);
                  toast({ title: "Item deleted", description: `${item?.name || 'Item'} has been removed from inventory.` });
                  loadItems();
                } catch (error) {
                  console.error("Error deleting item:", error);
                  toast({ title: "Unable to delete item", variant: "destructive" });
                }
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}

