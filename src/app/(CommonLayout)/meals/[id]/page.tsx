"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getMealById } from "@/services/meal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import axiosInstance from "@/lib/axiosInstance";
import {
  Loader2,
  ShoppingCart,
  UtensilsCrossed,
  ArrowLeft,
  Star,
  User,
  Store,
  Clock3,
  Tag,
} from "lucide-react";

type Review = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: { name?: string };
};

type Meal = {
  id: string;
  title: string;
  description: string;
  shortDescription?: string | null;
  price: number | string;
  discountPrice?: number | string | null;
  imageUrl?: string | null;
  preparationTime?: number | null;
  averageRating?: number | null;
  totalReviews?: number | null;
  category?: { name?: string } | null;
  provider?: { restaurantName?: string } | null;
  reviews?: Review[];
};

export default function MealDetailsView({ id }: { id: string }) {
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (mealId: string) => {
      const { data } = await axiosInstance.post("/addtocart", { mealId });
      return data;
    },
    onSuccess: async (res) => {
      if (res?.success) {
        toast.success(`${meal?.title} added to cart! 😋`);
        await queryClient.invalidateQueries({ queryKey: ["cart"] });
      } else {
        toast.error(res?.message || "Failed to add to cart");
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Please login first to add this meal to your cart.");
          return;
        }
        toast.error(error.response?.data?.message || "Failed to add to cart");
        return;
      }

      toast.error("Failed to add to cart");
    },
  });

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        setLoading(true);
        const res = await getMealById(id);
        const mealData = res?.data?.data || res?.data || null;
        setMeal(mealData);
      } catch (error) {
        console.error(error);
        setMeal(null);
        toast.error("Failed to load meal details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMeal();
  }, [id]);

  const hasDiscount =
    meal?.discountPrice &&
    Number(meal.discountPrice) < Number(meal.price);

  const averageRating = useMemo(() => {
    if (!meal) return "0.0";

    if (meal.reviews && meal.reviews.length > 0) {
      const avg =
        meal.reviews.reduce((acc, review) => acc + review.rating, 0) /
        meal.reviews.length;
      return avg.toFixed(1);
    }

    if (meal.averageRating) {
      return Number(meal.averageRating).toFixed(1);
    }

    return "0.0";
  }, [meal]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="font-medium text-muted-foreground">
          Cooking up the details...
        </p>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 rounded-full bg-muted p-6 text-muted-foreground">
          <UtensilsCrossed size={48} />
        </div>

        <h2 className="text-3xl font-extrabold text-foreground">
          Meal Not Found
        </h2>

        <p className="mt-3 max-w-md text-muted-foreground">
          The meal you are looking for may have been removed or the link is incorrect.
        </p>

        <Button asChild className="mt-8 rounded-full">
          <Link href="/meals">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Meals
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-[32px] border border-border bg-muted shadow-sm">
          {meal.imageUrl ? (
            <Image
              src={meal.imageUrl}
              alt={meal.title}
              fill
              priority
              loading="eager"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <UtensilsCrossed size={64} />
            </div>
          )}

          {hasDiscount && (
            <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow">
              <Tag className="h-3.5 w-3.5" />
              Discount Available
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            {meal.category?.name && (
              <span className="rounded-full border border-primary/15 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                {meal.category.name}
              </span>
            )}

            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              {averageRating}
            </span>

            {meal.preparationTime ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
                <Clock3 className="h-3.5 w-3.5" />
                {meal.preparationTime} min
              </span>
            ) : null}
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
            {meal.title}
          </h1>

          <p className="mt-4 text-base leading-7 text-muted-foreground">
            {meal.description || meal.shortDescription}
          </p>

          <div className="mt-6 flex flex-wrap items-end gap-3">
            <span className="text-4xl font-extrabold tracking-tight text-primary">
              ৳{hasDiscount ? meal.discountPrice : meal.price}
            </span>

            {hasDiscount && (
              <span className="text-lg font-semibold text-muted-foreground line-through">
                ৳{meal.price}
              </span>
            )}
          </div>

          {meal.provider?.restaurantName && (
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Store className="h-4 w-4" />
              Prepared by
              <span className="font-semibold text-foreground">
                {meal.provider.restaurantName}
              </span>
            </div>
          )}

          <Button
            onClick={() => mutation.mutate(meal.id)}
            disabled={mutation.isPending}
            className="mt-8 h-12 rounded-full text-base font-semibold"
          >
            {mutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ShoppingCart className="mr-2 h-4 w-4" />
            )}
            {mutation.isPending ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <div className="mb-6 flex items-center gap-3">
          <h2 className="text-2xl font-bold text-foreground">Customer Reviews</h2>
          <span className="rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground">
            {meal.reviews?.length || meal.totalReviews || 0}
          </span>
        </div>

        {meal.reviews && meal.reviews.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {meal.reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-3xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <User className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="font-semibold text-card-foreground">
                        {review.user?.name || "Anonymous"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={
                          index < review.rating
                            ? "h-4 w-4 fill-yellow-400 text-yellow-400"
                            : "h-4 w-4 text-muted"
                        }
                      />
                    ))}
                  </div>
                </div>

                <p className="leading-7 text-muted-foreground">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-border bg-muted/40 p-10 text-center">
            <p className="text-muted-foreground">
              No reviews yet. Be the first to try this dish.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}