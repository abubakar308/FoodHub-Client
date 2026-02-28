"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createMeal, getCategories } from "@/services/meal";

export default function CreateMealPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
  const load = async () => {
    const data = await getCategories();
    setCategories(data.data);
  };
  load();
}, []);

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);

  const form = e.currentTarget;
  const formData = new FormData(form);

  try {
    await createMeal(formData);   // ✅ await here

    toast.success("Meal created successfully 🎉");

    form.reset();                 // ✅ clear form

    router.push("/meals");
  } catch (err: any) {
    console.error(err);
    toast.error(err?.message || "Failed to create meal");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-3xl font-bold">Create New Meal</h1>
        <p className="mb-6 text-gray-500">
          Add a new meal for customers to order from your restaurant.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Meal Title</label>
            <Input name="title" placeholder="Chicken Biryani" required />
          </div>

          {/* Price + Category */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Price</label>
              <Input name="price" type="number" placeholder="9.99" required />
            </div>

            <div className="space-y-2">
             <select name="categoryId" className="w-full border rounded px-3 py-2">
  <option value="">Select category</option>

  {categories.map((cat: any) => (
    <option key={cat.id} value={cat.id}>
      {cat.name}
    </option>
  ))}
</select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              name="description"
              placeholder="Write something delicious about this meal..."
              rows={4}
              required
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Meal Image</label>

            <Input
              name="image"
              type="text"
              placeholder="https://example.com/image.jpg"
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
              {loading ? "Creating..." : "Create Meal"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}