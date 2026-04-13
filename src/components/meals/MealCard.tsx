"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Utensils,
  Store,
  ArrowUpRight,
  Star,
  Clock,
  ShoppingCart,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { addToCart } from "@/services/order";

type Meal = {
  id: string;
  title: string;
  imageUrl?: string | null;
  description?: string | null;
  shortDescription?: string | null;
  price: number | string;
  discountPrice?: number | string | null;
  preparationTime?: number | null;
  averageRating?: number | null;
  category?: { name?: string | null } | null;
  provider?: { restaurantName?: string | null } | null;
};

export default function MealCard({ meal }: { meal: Meal }) {
  const hasDiscount =
    meal.discountPrice &&
    Number(meal.discountPrice) < Number(meal.price);

  const { invalidateCart, refetch } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setAdding(true);
      const res = await addToCart(meal.id);
      if (res.success) {
        toast.success("Added to cart");
        await refetch();
        await invalidateCart();
      } else {
        toast.error(res.message || "Failed to add to cart");
      }
    } catch (err) {
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group block h-full relative">
      <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
        <Link href={`/meals/${meal.id}`} className="absolute inset-0 z-10" aria-label={`View ${meal.title}`} />
        
        <div className="absolute top-4 right-4 z-20 opacity-0 transition group-hover:opacity-100 pointer-events-none">
          <div className="rounded-full bg-background/80 p-2 text-primary shadow-md backdrop-blur">
            <ArrowUpRight size={18} />
          </div>
        </div>

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

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          <div className="absolute bottom-3 left-3">
            {hasDiscount ? (
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                  ৳{meal.discountPrice}
                </span>
                <span className="text-xs text-white/90 line-through">
                  ৳{meal.price}
                </span>
              </div>
            ) : (
              <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-bold text-foreground backdrop-blur-sm">
                ৳{meal.price}
              </span>
            )}
          </div>

          {hasDiscount && (
            <div className="absolute top-3 left-3 rounded-full bg-red-500 px-2 py-1 text-xs text-white">
              SALE
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span className="rounded-full bg-muted px-2 py-1">
              {meal.category?.name || "Meal"}
            </span>

            <div className="flex max-w-[120px] items-center gap-1">
              <Store size={12} />
              <span className="truncate">
                {meal.provider?.restaurantName || "Provider"}
              </span>
            </div>
          </div>

          <h3 className="line-clamp-1 text-lg font-bold text-card-foreground transition group-hover:text-primary">
            {meal.title}
          </h3>

          <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">
            {meal.shortDescription || meal.description || "Delicious meal"}
          </p>

          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star size={14} className="text-yellow-500" />
              {meal.averageRating || "0.0"}
            </div>

            {meal.preparationTime ? (
              <div className="flex items-center gap-1">
                <Clock size={14} />
                {meal.preparationTime} min
              </div>
            ) : null}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 relative z-20">
            <Button asChild className="w-full rounded-full font-semibold" variant="outline">
              <Link href={`/meals/${meal.id}`}>Details</Link>
            </Button>
            <Button 
               onClick={handleAddToCart}
               disabled={adding}
               className="w-full rounded-full font-semibold gap-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {adding ? <Loader2 size={16} className="animate-spin" /> : <ShoppingCart size={16} />}
              <span>Add</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}