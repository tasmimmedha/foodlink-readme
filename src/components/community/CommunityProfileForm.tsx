"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommunityProfile } from "@/lib/server/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const profileSchema = z.object({
  username: z.string().min(3),
  communityRole: z.enum(["member", "champion", "organizer"]),
  bio: z.string().optional(),
  preferredItems: z.string().optional(),
  avoidItems: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
  allergens: z.string().optional(),
  acceptsHotMeals: z.boolean(),
  distancePreference: z.enum(["1km", "3km", "5km", "any"]),
  visibility: z.enum(["public", "community", "private"]),
  notificationsEnabled: z.boolean(),
  notifyOnClaim: z.boolean(),
  notifyOnMessages: z.boolean(),
});

type ProfileValues = z.infer<typeof profileSchema>;

interface CommunityProfileFormProps {
  profile: CommunityProfile | null;
  onSave: (values: ProfileValues) => Promise<void> | void;
  saving?: boolean;
}

export function CommunityProfileForm({ profile, onSave, saving }: CommunityProfileFormProps) {
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile?.username ?? "",
      communityRole: profile?.communityRole ?? "member",
      bio: profile?.bio ?? "",
      preferredItems: profile?.preferredItems?.join(", ") ?? "",
      avoidItems: profile?.avoidItems?.join(", ") ?? "",
      dietaryRestrictions: profile?.dietaryRestrictions?.join(", ") ?? "",
      allergens: profile?.allergens?.join(", ") ?? "",
      acceptsHotMeals: profile?.acceptsHotMeals ?? true,
      distancePreference: profile?.distancePreference ?? "3km",
      visibility: profile?.visibility ?? "community",
      notificationsEnabled: profile?.notificationsEnabled ?? true,
      notifyOnClaim: profile?.notifyOnClaim ?? true,
      notifyOnMessages: profile?.notifyOnMessages ?? true,
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        username: profile.username,
        communityRole: profile.communityRole,
        bio: profile.bio ?? "",
        preferredItems: profile.preferredItems.join(", "),
        avoidItems: profile.avoidItems.join(", "),
        dietaryRestrictions: profile.dietaryRestrictions.join(", "),
        allergens: profile.allergens.join(", "),
        acceptsHotMeals: profile.acceptsHotMeals,
        distancePreference: profile.distancePreference,
        visibility: profile.visibility,
        notificationsEnabled: profile.notificationsEnabled,
        notifyOnClaim: profile.notifyOnClaim,
        notifyOnMessages: profile.notifyOnMessages,
      });
    }
  }, [profile, form]);

  const submit = async (values: ProfileValues) => {
    await onSave(values);
  };

  return (
    <Card className="border-none bg-white/90 dark:bg-gray-900/80 shadow-xl shadow-emerald-100/40">
      <CardHeader>
        <CardTitle>Community Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Username</Label>
              <Input {...form.register("username")} />
            </div>
            <div>
              <Label>Community Role</Label>
              <Select
                value={form.watch("communityRole")}
                onValueChange={(value) => form.setValue("communityRole", value as ProfileValues["communityRole"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="champion">Champion</SelectItem>
                  <SelectItem value="organizer">Organizer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Bio</Label>
            <Textarea rows={3} {...form.register("bio")} />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Preferred Items</Label>
              <Input placeholder="vegetables, dairy" {...form.register("preferredItems")} />
            </div>
            <div>
              <Label>Avoids</Label>
              <Input placeholder="fried food" {...form.register("avoidItems")} />
            </div>
            <div>
              <Label>Dietary Needs</Label>
              <Input placeholder="vegetarian" {...form.register("dietaryRestrictions")} />
            </div>
            <div>
              <Label>Allergens</Label>
              <Input placeholder="peanuts" {...form.register("allergens")} />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label>Distance Preference</Label>
              <Select
                value={form.watch("distancePreference")}
                onValueChange={(value) => form.setValue("distancePreference", value as ProfileValues["distancePreference"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1km">1 km</SelectItem>
                  <SelectItem value="3km">3 km</SelectItem>
                  <SelectItem value="5km">5 km</SelectItem>
                  <SelectItem value="any">Any distance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Visibility</Label>
              <Select
                value={form.watch("visibility")}
                onValueChange={(value) => form.setValue("visibility", value as ProfileValues["visibility"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="community">Community Only</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 p-4 rounded-2xl border bg-emerald-50/50 dark:bg-emerald-950/30">
              <div className="flex items-center justify-between">
                <Label htmlFor="hot">Accept hot meals</Label>
                <Switch
                  id="hot"
                  checked={form.watch("acceptsHotMeals")}
                  onCheckedChange={(checked) => form.setValue("acceptsHotMeals", checked)}
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <ToggleField
              label="Notifications"
              description="Get updates and reminders"
              checked={form.watch("notificationsEnabled")}
              onChange={(value) => form.setValue("notificationsEnabled", value)}
            />
            <ToggleField
              label="Claim alerts"
              description="Alert me when someone claims"
              checked={form.watch("notifyOnClaim")}
              onChange={(value) => form.setValue("notifyOnClaim", value)}
            />
            <ToggleField
              label="Message alerts"
              description="Inbox & admin messages"
              checked={form.watch("notifyOnMessages")}
              onChange={(value) => form.setValue("notifyOnMessages", value)}
            />
          </div>

          <Button type="submit" disabled={saving} className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500">
            {saving ? "Saving..." : "Save profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ToggleField({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="rounded-2xl border p-4 bg-white dark:bg-gray-950/40">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        <Switch checked={checked} onCheckedChange={onChange} />
      </div>
    </div>
  );
}

