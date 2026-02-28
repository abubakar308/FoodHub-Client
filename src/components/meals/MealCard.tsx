"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { addToCart } from "@/services/order";

type Meal = {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  price: number;
  category: { name: string };
  provider: { restaurantName: string };
};

export default function MealCard({ meal }: { meal: Meal }) {
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();       // stop link navigation
    e.stopPropagation();

    const res = await addToCart(meal.id,);

    if (res?.success) {
      toast.success(`${meal.title} added to cart`);
    } else {
      toast.error(res?.message || "Failed to add to cart");
    }
  };

  return (
    <Link href={`/meals/${meal.id}`} className="group block h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden">
          {meal?.imageUrl ? (
            <Image
              src={meal.imageUrl}
              alt={meal.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
              No Image
            </div>
          )}

          {/* price badge */}
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-green-600 shadow">
            ${meal.price}
          </span>

          <div className="absolute inset-0 bg-gradient-to- from-black/30 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition">
            {meal.title}
          </h3>

          <p className="mt-1 text-sm text-gray-500 line-clamp-2 flex-1">
            {meal.description}
          </p>

          {/* meta */}
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <span className="rounded-full bg-gray-100 px-2 py-1">
              {meal.category?.name}
            </span>

            <span className="truncate max-w-120px">
              {meal.provider?.restaurantName}
            </span>
          </div>

          {/* Button */}
          <Button onClick={handleAddToCart} className="mt-4 w-full">
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
}