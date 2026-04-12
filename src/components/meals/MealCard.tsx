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
} from "lucide-react";

type Meal = {
  id: string;
  title: string;
  imageUrl?: string;
  description?: string;
  shortDescription?: string | null;
  price: number | string;
  discountPrice?: number | string | null;
  preparationTime?: number;
  averageRating?: number;
  category?: { name: string };
  provider?: { restaurantName: string };
};

export default function MealCard({ meal }: { meal: Meal }) {
  const hasDiscount =
    meal.discountPrice &&
    Number(meal.discountPrice) < Number(meal.price);

  return (
    <Link href={`/meals/${meal.id}`} className="group block h-full">
      <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
        <div className="absolute top-4 right-4 z-20 opacity-0 transition group-hover:opacity-100">
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

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          <div className="absolute bottom-3 left-3">
            {hasDiscount ? (
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                  ৳{meal.discountPrice}
                </span>
                <span className="text-xs text-white/80 line-through">
                  ৳{meal.price}
                </span>
              </div>
            ) : (
              <span className="rounded-full bg-background/80 px-3 py-1 text-xs font-bold text-foreground">
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

          <div className="mt-5">
            <Button asChild className="w-full rounded-full font-semibold gap-2">
              <span>View Details</span>
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}