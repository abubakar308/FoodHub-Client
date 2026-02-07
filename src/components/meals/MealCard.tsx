"use client";

import Link from "next/link";
import { toast } from "sonner";
// import { CartUtils } from "@/utils/cart.utils";
import { Button } from "@/components/ui/button";

type Meal = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: {
    name: string;
  };
  provider: {
    restaurantName: string;
  };
};

export default function MealCard({ meal }: { meal: Meal }) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();

    // CartUtils.addToCart({
    //   id: meal.id,
    //   name: meal.title,
    //   price: meal.price,
    //   restaurantId: "unknown", // Ideally backend provides this or we fetch it
    //   restaurantName: meal.provider.restaurant,
    //   qty: 1,
    // });
    toast.success(`Added ${meal.title} to cart`);
  };

  return (
    <Link href={`/meals/${meal.id}`} className="block h-full">
      <div className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition h-full flex flex-col">
        {/* Image */}
        <div className="mb-4 flex h-40 items-center justify-center rounded bg-gray-100 text-gray-400">
          Meal Image
        </div>

        <h3 className="text-lg font-semibold text-black">{meal.title}</h3>

        <p className="mt-1 text-sm text-gray-600 line-clamp-2 flex-1">
          {meal.description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="font-semibold text-green-600">${meal.price}</span>

          <span className="text-xs text-gray-500">{meal.category.name}</span>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
            <p className="text-xs text-gray-500">
            by {meal.provider.restaurantName}
            </p>
            <Button size="sm" variant="outline" onClick={handleAddToCart} className="hover:bg-green-50 hover:text-green-600 hover:border-green-200">
                Add to Cart
            </Button>
        </div>
      </div>
    </Link>
  );
}