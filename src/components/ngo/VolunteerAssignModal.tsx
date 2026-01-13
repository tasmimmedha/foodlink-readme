"use client";

import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { NGOPickupSchedule } from "@/lib/server";

interface VolunteerAssignModalProps {
  open: boolean;
  pickupId?: string;
  defaultValues?: {
    volunteerName?: string;
    volunteerContact?: string;
    scheduledFor?: string;
    vehicleType?: NGOPickupSchedule["vehicleType"];
  };
  onClose: () => void;
  onSubmit: (values: { volunteerName: string; volunteerContact: string; scheduledFor: string; vehicleType: NGOPickupSchedule["vehicleType"]; notes?: string }) => Promise<void> | void;
  isSubmitting?: boolean;
}

const VEHICLES: NGOPickupSchedule["vehicleType"][] = ["van", "car", "bike", "on-foot"];

export function VolunteerAssignModal({ open, pickupId, defaultValues, onClose, onSubmit, isSubmitting }: VolunteerAssignModalProps) {
  const form = useForm({
    values: {
      volunteerName: defaultValues?.volunteerName ?? "",
      volunteerContact: defaultValues?.volunteerContact ?? "",
      scheduledFor: defaultValues?.scheduledFor ?? new Date().toISOString().slice(0, 16),
      vehicleType: defaultValues?.vehicleType ?? "van",
      notes: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit({
      volunteerName: values.volunteerName,
      volunteerContact: values.volunteerContact,
      scheduledFor: values.scheduledFor,
      vehicleType: values.vehicleType,
      notes: values.notes,
    });
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-3xl border-none bg-white/95 p-6 shadow-xl backdrop-blur-xl dark:bg-slate-900/95">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-white">
            Assign volunteer {pickupId ? `#${pickupId.slice(0, 4)}` : ""}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Volunteer name</Label>
            <Input placeholder="Nasir Chowdhury" {...form.register("volunteerName", { required: true })} />
          </div>
          <div className="space-y-2">
            <Label>Contact</Label>
            <Input placeholder="+880 17..." {...form.register("volunteerContact", { required: true })} />
          </div>
          <div className="space-y-2">
            <Label>Pickup time</Label>
            <Input type="datetime-local" {...form.register("scheduledFor", { required: true })} />
          </div>
          <div className="space-y-2">
            <Label>Vehicle</Label>
            <Select value={form.watch("vehicleType")} onValueChange={(value: NGOPickupSchedule["vehicleType"]) => form.setValue("vehicleType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle" />
              </SelectTrigger>
              <SelectContent>
                {VEHICLES.map((vehicle) => (
                  <SelectItem key={vehicle} value={vehicle}>
                    {vehicle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Input placeholder="Insulated bag + gloves" {...form.register("notes")} />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Assigning..." : "Assign volunteer"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}


