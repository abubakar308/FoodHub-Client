"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success(`Added ${meal.title} to cart`);
  };

  return (
    <Link href={`/meals/${meal.id}`} className="group block h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden">
           {/* Image Section */}
               <div className="relative w-full lg:w-1/2 h-80 lg:h-28rem rounded-xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center">
                 {meal.imageUrl ? (
                   <Image
                     src={meal?.imageUrl}
                     alt={meal.title}
                     fill
                     className="object-cover"
                   />
                 ) : (
                   <span className="text-gray-400">No Image Available</span>
                 )}
               </div>

          {/* price badge */}
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-green-600 shadow">
            ${meal.price}
          </span>

          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to from-black/30 via-black/0 to-transparent" />
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
              {meal.category.name}
            </span>

            <span className="truncate max-w-120px">
              {meal.provider.restaurantName}
            </span>
          </div>

          {/* action */}
          <Button
            size="sm"
            onClick={handleAddToCart}
            className="mt-4 w-full bg-green-600 text-white hover:bg-green-700 transition"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
}