"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getCategories } from "@/services/categories";
import { getAllMeals, updateMeal } from "@/services/meal";


type Meal = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
};

export default function EditMealPage() {
  const router = useRouter();
  const params = useParams();
  const mealId = params.id;

  const [loading, setLoading] = useState(false);
  const [meal, setMeal] = useState<Meal | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const mealsRes = await getAllMeals();
        const currentMeal = mealsRes?.data?.data?.find((m: Meal) => m.id === mealId);
        setMeal(currentMeal || null);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load meal or categories");
      }
    };
    load();
  }, [mealId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!meal) return;

    setLoading(true);
    const form = e.currentTarget;
    const payload = new FormData();

    const titleEl = form.elements.namedItem("title") as HTMLInputElement;
    const priceEl = form.elements.namedItem("price") as HTMLInputElement;
    const descEl = form.elements.namedItem("description") as HTMLTextAreaElement;
    const fileEl = form.elements.namedItem("imageUrl") as HTMLInputElement;

    if (titleEl) payload.append("title", titleEl.value);
    if (priceEl) payload.append("price", priceEl.value);
    if (descEl) payload.append("description", descEl.value);
    
    if (fileEl && fileEl.files && fileEl.files.length > 0) {
      payload.append("imageUrl", fileEl.files[0]);
    }

    try {
      await updateMeal(mealId as string, payload);

      toast.success("Meal updated successfully 🎉");
      router.push("/meals");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to update meal");
    } finally {
      setLoading(false);
    }
  };

  if (!meal) return <p className="text-center p-10">Loading meal...</p>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="mb-4 text-3xl font-bold">Edit Meal</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Meal Title</label>
            <Input name="title" defaultValue={meal.title} required />
          </div>

          {/* Price + Category */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Price</label>
              <Input
                name="price"
                type="number"
                defaultValue={meal.price}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              name="description"
              defaultValue={meal.description}
              rows={4}
              required
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Update Meal Image</label>
            <input
              name="imageUrl"
              type="file"
              accept="image/*"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {meal.imageUrl && (
              <p className="text-xs text-muted-foreground mt-2">
                Leave empty to preserve the current image.
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Meal"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}