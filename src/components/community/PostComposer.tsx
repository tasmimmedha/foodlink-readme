"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Sparkles, Upload } from "lucide-react";
import { cn } from "@/lib/helpers";

const composerSchema = z.object({
  type: z.enum(["surplus", "leftover"]),
  title: z.string().min(3),
  description: z.string().min(5),
  quantity: z.coerce.number().min(1),
  unit: z.string().min(1),
  pickupWindow: z.string().min(3),
  category: z.string().min(2),
  dietaryTags: z.string().optional(),
  allergens: z.string().optional(),
});

type ComposerValues = z.infer<typeof composerSchema>;

interface PostComposerProps {
  onCreate: (values: ComposerValues & { image?: string }) => Promise<void> | void;
  submitting?: boolean;
}

export function PostComposer({ onCreate, submitting }: PostComposerProps) {
  const [image, setImage] = useState<string>();
  const form = useForm<ComposerValues>({
    resolver: zodResolver(composerSchema),
    defaultValues: {
      type: "surplus",
      unit: "kg",
      category: "produce",
    },
  });

  const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const submit = async (values: ComposerValues) => {
    await onCreate({ ...values, image });
    form.reset();
    setImage(undefined);
  };

  return (
    <Card className="border-none bg-white/90 dark:bg-gray-900/80 shadow-2xl shadow-emerald-100/50">
      <CardContent className="p-6 space-y-5">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-emerald-500">
          <Sparkles className="h-4 w-4" />
          Share with community
        </div>

        <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
          <ToggleGroup
            type="single"
            value={form.watch("type")}
            onValueChange={(value) => value && form.setValue("type", value as "surplus" | "leftover")}
            className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 p-1"
          >
            <ToggleGroupItem
              value="surplus"
              className={cn(
                "flex-1 rounded-xl py-2 text-sm font-semibold",
                form.watch("type") === "surplus"
                  ? "bg-white shadow text-emerald-600"
                  : "text-emerald-500 hover:text-emerald-600"
              )}
            >
              Surplus Pantry
            </ToggleGroupItem>
            <ToggleGroupItem
              value="leftover"
              className={cn(
                "flex-1 rounded-xl py-2 text-sm font-semibold",
                form.watch("type") === "leftover"
                  ? "bg-white shadow text-emerald-600"
                  : "text-emerald-500 hover:text-emerald-600"
              )}
            >
              Leftover Meal
            </ToggleGroupItem>
          </ToggleGroup>

          <div className="grid md:grid-cols-2 gap-4">
            <Input placeholder="Title" {...form.register("title")} />
            <Input placeholder="Category (produce, dairy...)" {...form.register("category")} />
            <Input placeholder="Quantity" type="number" {...form.register("quantity")} />
            <Input placeholder="Unit (kg, portions, etc.)" {...form.register("unit")} />
            <Input placeholder="Pickup window e.g. 5-8 PM" {...form.register("pickupWindow")} />
            {form.watch("type") === "leftover" && (
              <>
                <Input placeholder="Dietary tags (comma separated)" {...form.register("dietaryTags")} />
                <Input placeholder="Allergens (comma separated)" {...form.register("allergens")} />
              </>
            )}
          </div>

          <Textarea placeholder="Describe the surplus or meal..." rows={3} {...form.register("description")} />

          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-emerald-600 cursor-pointer">
              <Upload className="h-4 w-4" />
              Upload photo
              <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </label>
            {image && <span className="text-xs text-gray-500">Image ready · {Math.round(image.length / 1024)} kb</span>}
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
          >
            {submitting ? "Posting..." : "Share with neighbors"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

