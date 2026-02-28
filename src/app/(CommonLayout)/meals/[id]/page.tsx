"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { mealsService } from "@/services/meals.service";
import { addToCart } from "@/services/order";
import Image from "next/image";
import { toast } from "sonner";

type Meal = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: { name: string };
  provider?: { restaurantName: string };
};

export default function MealDetailsPage({ params }: { params: { id: string } }) {
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  // Load meal client-side
  useState(() => {
    const fetchMeal = async () => {
      try {
        setLoading(true);
        const res = await mealsService.getMealById(params.id);
        setMeal(res?.data?.data || null);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load meal");
      } finally {
        setLoading(false);
      }
    };
    fetchMeal();
  });

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!meal) return;

    try {
      setAdding(true);
      const res = await addToCart(meal.id);
      if (res?.success) toast.success(`${meal.title} added to cart`);
      else toast.error(res?.message || "Failed to add to cart");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (loading || !meal) return <p className="text-center p-10">Loading meal...</p>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
        {/* Image Section */}
        <div className="relative w-full lg:w-1/2 h-80 lg:h-[28rem] rounded-xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center">
          {meal.imageUrl ? (
            <Image
              src={meal.imageUrl}
              alt={meal.title}
              fill
              className="object-cover"
            />
          ) : (
            <span className="text-gray-400">No Image Available</span>
          )}
        </div>

        {/* Details Section */}
        <div className="lg:w-1/2 flex flex-col justify-between">
          <div>
            {meal.category?.name && (
              <span className="inline-block rounded-full bg-green-100 text-green-700 px-3 py-1 text-sm font-semibold">
                {meal.category.name}
              </span>
            )}

            <h1 className="mt-4 text-3xl lg:text-4xl font-extrabold text-gray-900">
              {meal.title}
            </h1>

            <p className="mt-4 text-gray-600 text-base lg:text-lg leading-relaxed">
              {meal.description}
            </p>

            <p className="mt-6 text-3xl font-bold text-green-600">
              ${meal.price.toFixed(2)}
            </p>

            {meal.provider?.restaurantName && (
              <p className="mt-2 text-sm text-gray-500">
                Restaurant: <span className="font-medium">{meal.provider.restaurantName}</span>
              </p>
            )}
          </div>

          <Button
            onClick={handleAddToCart}
            className="mt-4 w-full"
            disabled={adding}
          >
            {adding ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}