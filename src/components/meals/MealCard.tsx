"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  ShoppingCart,
  Utensils,
  Store,
  ArrowUpRight,
  Loader2,
  Star,
  Clock,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";

type Meal = {
  id: string;
  title: string;
  imageUrl?: string;
  description?: string;
  price: number;
  discountPrice?: number | string | null;
  preparationTime?: number;
  averageRating?: number;
  category?: { name: string };
  provider?: { restaurantName: string };
};

export default function MealCard({ meal }: { meal: Meal }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (mealId: string) => {
      const { data } = await axiosInstance.post("/api/cart", { mealId });
      return data;
    },
    onSuccess: async (res) => {
      if (res?.success) {
        toast.success(`${meal.title} added to cart! 😋`);
        await queryClient.refetchQueries({ queryKey: ["cart"] });
      } else {
        toast.error(res?.message || "Failed to add to cart");
      }
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    mutation.mutate(meal.id);
  };

  const hasDiscount =
    meal.discountPrice &&
    Number(meal.discountPrice) < Number(meal.price);

  return (
    <Link href={`/meals/${meal.id}`} className="group block h-full">
      <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

        {/* Hover Arrow */}
        <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition">
          <div className="rounded-full bg-background/80 backdrop-blur p-2 shadow-md text-primary">
            <ArrowUpRight size={18} />
          </div>
        </div>

        {/* Image */}
        <div className="relative h-52 w-full overflow-hidden">
          {meal?.imageUrl ? (
            <Image
              src={meal.imageUrl}
              alt={meal.title}
              fill
              className="object-cover transition duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
              <Utensils size={40} />
            </div>
          )}

          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Price */}
          <div className="absolute bottom-3 left-3">
            {hasDiscount ? (
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                  ৳{meal.discountPrice}
                </span>
                <span className="text-xs line-through text-white/80">
                  ৳{meal.price}
                </span>
              </div>
            ) : (
              <span className="rounded-full bg-background/80 px-3 py-1 text-xs font-bold text-foreground">
                ৳{meal.price}
              </span>
            )}
          </div>

          {/* Discount badge */}
          {hasDiscount && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              SALE
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          
          {/* Category + Provider */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span className="rounded-full bg-muted px-2 py-1">
              {meal.category?.name}
            </span>

            <div className="flex items-center gap-1 max-w-[120px]">
              <Store size={12} />
              <span className="truncate">
                {meal.provider?.restaurantName}
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-card-foreground group-hover:text-primary transition line-clamp-1">
            {meal.title}
          </h3>

          {/* Description */}
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2 flex-1">
            {meal.description}
          </p>

          {/* Extra Info */}
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star size={14} className="text-yellow-500" />
              {meal.averageRating || "0.0"}
            </div>

            {meal.preparationTime && (
              <div className="flex items-center gap-1">
                <Clock size={14} />
                {meal.preparationTime} min
              </div>
            )}
          </div>

          {/* Button */}
          <div className="mt-5">
            <Button
              onClick={handleAddToCart}
              disabled={mutation.isPending}
              className="w-full rounded-full font-semibold gap-2"
            >
              {mutation.isPending ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <ShoppingCart size={18} />
              )}
              {mutation.isPending ? "Adding..." : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}