"use client";

import {
  useSurplusQueue,
  useAddSurplusItem,
  useAssignSurplus,
  useUpdateSurplusStatus,
} from "@/hooks/use-query-shop";
import { SurplusAddForm } from "@/components/shop/SurplusAddForm";
import { SurplusItemCard } from "@/components/shop/SurplusItemCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ShopSurplusItem } from "@/lib/server";
import { toast } from "@/components/ui/use-toast";

export default function SurplusPage() {
  const { data: queue = [] } = useSurplusQueue();
  const addMutation = useAddSurplusItem();
  const assignMutation = useAssignSurplus();
  const statusMutation = useUpdateSurplusStatus();
  const [assignItem, setAssignItem] = useState<ShopSurplusItem | null>(null);
  const [destinationName, setDestinationName] = useState("");
  const [pickupTime, setPickupTime] = useState(new Date().toISOString().slice(0, 16));
  const [destinationType, setDestinationType] = useState<"ngo" | "community-kitchen">("ngo");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Surplus donation queue</h1>
        <p className="text-sm text-slate-500">
          Track items marked for donation and coordinate pickups with NGO partners.
        </p>
      </div>

      <SurplusAddForm
        onSubmit={async (values) => {
          try {
            await addMutation.mutateAsync(values);
            toast({ title: "Surplus added", description: "Item has been added to the surplus queue." });
          } catch (error) {
            console.error("Error adding surplus:", error);
            toast({ title: "Unable to add surplus", description: "Please try again.", variant: "destructive" });
          }
        }}
        isSubmitting={addMutation.isPending}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {queue.map((item) => (
          <SurplusItemCard
            key={item.id}
            item={item}
            onAssign={(record) => {
              setAssignItem(record);
              setDestinationName(record.destinationName ?? "");
              setPickupTime(record.pickupTime ?? new Date().toISOString().slice(0, 16));
              setDestinationType(record.destinationType ?? "ngo");
            }}
            onStatusChange={async (record, status) => {
              try {
                await statusMutation.mutateAsync({ id: record.id, status });
                toast({ title: "Status updated", description: `Item status changed to ${status}.` });
              } catch (error) {
                console.error("Error updating status:", error);
                toast({ title: "Unable to update status", variant: "destructive" });
              }
            }}
          />
        ))}
        {queue.length === 0 && (
          <p className="text-sm text-slate-500">No surplus items pending action.</p>
        )}
      </div>

      <Dialog open={Boolean(assignItem)} onOpenChange={() => setAssignItem(null)}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Assign pickup</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Destination type</Label>
              <select
                className="h-10 rounded-2xl border border-slate-200 px-3 text-sm"
                value={destinationType}
                onChange={(event) => setDestinationType(event.target.value as "ngo" | "community-kitchen")}
              >
                <option value="ngo">NGO</option>
                <option value="community-kitchen">Community kitchen</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label>Destination name</Label>
              <Input value={destinationName} onChange={(event) => setDestinationName(event.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Pickup time</Label>
              <Input
                type="datetime-local"
                value={pickupTime}
                onChange={(event) => setPickupTime(event.target.value)}
              />
            </div>
            <Button
              onClick={async () => {
                if (!assignItem) return;
                try {
                  await assignMutation.mutateAsync({
                    id: assignItem.id,
                    assignment: {
                      destinationName,
                      destinationType,
                      pickupTime,
                    },
                  });
                  toast({ title: "Assignment saved", description: `Item assigned to ${destinationName}.` });
                  setAssignItem(null);
                } catch (error) {
                  console.error("Error assigning item:", error);
                  toast({ title: "Unable to assign item", variant: "destructive" });
                }
              }}
              disabled={assignMutation.isPending}
            >
              {assignMutation.isPending ? "Saving..." : "Save assignment"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

