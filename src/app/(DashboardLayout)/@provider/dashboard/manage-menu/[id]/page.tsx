"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
    const formData = new FormData(form);

    try {
      await updateMeal(mealId as string, {
        title: (formData.get("title") as string) || "",
        description: (formData.get("description") as string) || "",
        price: Number(formData.get("price")) || 0,
        imageUrl: (formData.get("imageUrl") as string) || ""
      });

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
            <label className="text-sm font-medium">Image URL</label>
            <Input
              name="imageUrl"
              type="text"
              defaultValue={meal.imageUrl}
              required
            />
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