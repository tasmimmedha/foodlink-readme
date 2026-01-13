"use client";

import { useEffect, useState } from "react";
import { RestaurantSurplusItem } from "@/lib/server/db";
import { addSurplusOffer, getSurplusItems } from "@/lib/server/restaurant.surplus.server";
import { SurplusUploadForm } from "@/components/restaurant/SurplusUploadForm";
import { SurplusItemCard } from "@/components/restaurant/SurplusItemCard";
import { PageHeader } from "@/components/shared/page-header";
import { toast } from "@/components/ui/use-toast";

export default function RestaurantSurplusPage() {
  const [items, setItems] = useState<RestaurantSurplusItem[]>([]);

  const loadItems = async () => {
    const data = await getSurplusItems();
    setItems(data);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      await addSurplusOffer({
        title: values.title,
        description: values.description,
        quantity: values.quantity,
        unit: values.unit,
        category: values.category,
        storageType: values.storageType,
        pickupWindow: { start: values.pickupWindowStart, end: values.pickupWindowEnd },
        tags: values.tags.split(",").map((tag: string) => tag.trim()).filter(Boolean),
        image: values.image,
      });
      toast({ title: "Surplus posted", description: `${values.title} has been added to surplus donations.` });
      await loadItems();
    } catch (error) {
      console.error("Error adding surplus:", error);
      toast({ title: "Unable to add surplus", description: "Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Surplus Donations"
        description="Publish hot surplus, assign pickups, and keep food moving instead of wasting."
      />
      <SurplusUploadForm onSubmit={handleSubmit} />
      <div className="grid md:grid-cols-2 gap-4">
        {items.map((item) => (
          <SurplusItemCard key={item.id} item={item} onUpdated={loadItems} />
        ))}
      </div>
    </div>
  );
}

