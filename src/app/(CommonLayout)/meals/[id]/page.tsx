"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getMealById, getRelatedMeals } from "@/services/meal";
import {
  Loader2,
  UtensilsCrossed,
  ArrowLeft,
  Star,
  User,
  Store,
  Clock3,
  Tag,
  Flame,
  Soup,
  CalendarDays,
} from "lucide-react";

type Review = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    id?: string;
    name?: string;
    avatar?: string;
  };
};

type RelatedMeal = {
  id: string;
  title: string;
  imageUrl?: string | null;
  price: number | string;
  discountPrice?: number | string | null;
};

type Meal = {
  id: string;
  title: string;
  description?: string;
  shortDescription?: string | null;
  ingredients?: string | null;
  price: number | string;
  discountPrice?: number | string | null;
  imageUrl?: string | null;
  preparationTime?: number | null;
  calories?: number | null;
  averageRating?: number | null;
  totalReviews?: number | null;
  tags?: string | null;
  createdAt?: string;
  updatedAt?: string;
  category?: {
    id?: string;
    name?: string;
  } | null;
  provider?: {
    id?: string;
    restaurantName?: string;
    restaurantLogo?: string | null;
    address?: string;
    phone?: string;
  } | null;
  reviews?: Review[];
};

export default function MealDetailsView({ id }: { id: string }) {
  const [meal, setMeal] = useState<Meal | null>(null);
  const [relatedMeals, setRelatedMeals] = useState<RelatedMeal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        setLoading(true);

        const res = await getMealById(id);
        const mealData = res?.data?.data ?? res?.data ?? null;

        setMeal(mealData);

        if (mealData?.category?.id) {
          const relatedRes = await getRelatedMeals(
            mealData.category.id,
            mealData.id
          );
          const relatedData = relatedRes?.data?.data || [];
          setRelatedMeals(relatedData);
        } else {
          setRelatedMeals([]);
        }
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
    !!meal?.discountPrice &&
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

  const totalReviews = meal?.reviews?.length || meal?.totalReviews || 0;

  const ingredientList = meal?.ingredients
    ? meal.ingredients
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
    : [];

  const formatDate = (date?: string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

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
          The meal you are looking for may have been removed or the link is
          incorrect.
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
      <div className="mb-8">
        <Link
          href="/meals"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to meals
        </Link>
      </div>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-square w-full overflow-hidden rounded-[32px] border border-border bg-muted shadow-sm">
          {meal.imageUrl ? (
            <Image
              src={meal.imageUrl}
              alt={meal.title}
              fill
              priority
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
            {meal.description ||
              meal.shortDescription ||
              "No description available."}
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

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Category
              </p>
              <p className="mt-2 font-semibold text-foreground">
                {meal.category?.name || "N/A"}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Preparation Time
              </p>
              <p className="mt-2 font-semibold text-foreground">
                {meal.preparationTime ? `${meal.preparationTime} min` : "N/A"}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Calories
              </p>
              <p className="mt-2 font-semibold text-foreground">
                {meal.calories ? `${meal.calories} kcal` : "N/A"}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Reviews
              </p>
              <p className="mt-2 font-semibold text-foreground">
                {totalReviews}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Created At
              </p>
              <p className="mt-2 inline-flex items-center gap-2 font-semibold text-foreground">
                <CalendarDays className="h-4 w-4 text-primary" />
                {formatDate(meal.createdAt)}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Updated At
              </p>
              <p className="mt-2 inline-flex items-center gap-2 font-semibold text-foreground">
                <CalendarDays className="h-4 w-4 text-primary" />
                {formatDate(meal.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-foreground">Overview</h2>
          <p className="mt-4 leading-8 text-muted-foreground">
            {meal.description ||
              meal.shortDescription ||
              "No overview available."}
          </p>

          {ingredientList.length > 0 && (
            <>
              <h3 className="mt-8 text-lg font-bold text-foreground">
                Ingredients
              </h3>

              <div className="mt-4 flex flex-wrap gap-2">
                {ingredientList.map((ingredient, index) => (
                  <span
                    key={`${ingredient}-${index}`}
                    className="rounded-full border border-border bg-muted px-3 py-1.5 text-sm text-muted-foreground"
                  >
                    <Soup className="mr-1 inline h-3.5 w-3.5" />
                    {ingredient}
                  </span>
                ))}
              </div>
            </>
          )}

          {meal.tags && (
            <>
              <h3 className="mt-8 text-lg font-bold text-foreground">Tags</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {meal.tags
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean)
                  .map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary"
                    >
                      <Flame className="mr-1 inline h-3.5 w-3.5" />
                      {tag}
                    </span>
                  ))}
              </div>
            </>
          )}
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-foreground">Provider Info</h2>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <Store className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Restaurant
                </p>
                <p className="font-semibold text-foreground">
                  {meal.provider?.restaurantName || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock3 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Prep Time
                </p>
                <p className="font-semibold text-foreground">
                  {meal.preparationTime ? `${meal.preparationTime} min` : "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Average Rating
                </p>
                <p className="font-semibold text-foreground">
                  {averageRating} / 5
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <div className="mb-6 flex items-center gap-3">
          <h2 className="text-2xl font-bold text-foreground">
            Customer Reviews
          </h2>
          <span className="rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground">
            {totalReviews}
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
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-muted text-muted-foreground">
                      {review.user?.avatar ? (
                        <Image
                          src={review.user.avatar}
                          alt={review.user?.name || "User"}
                          width={40}
                          height={40}
                          className="h-10 w-10 object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
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

      {relatedMeals.length > 0 && (
        <div className="mt-20">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-foreground">
              Related Meals
            </h2>
            <Link
              href="/meals"
              className="text-sm font-semibold text-primary transition hover:underline"
            >
              View all meals
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedMeals.map((item) => {
              const relatedHasDiscount =
                !!item.discountPrice &&
                Number(item.discountPrice) < Number(item.price);

              return (
                <Link
                  key={item.id}
                  href={`/meals/${item.id}`}
                  className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
                        <UtensilsCrossed size={36} />
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="line-clamp-1 font-bold text-card-foreground">
                      {item.title}
                    </h3>

                    <div className="mt-3 flex items-center gap-2">
                      <span className="font-bold text-primary">
                        ৳{relatedHasDiscount ? item.discountPrice : item.price}
                      </span>

                      {relatedHasDiscount && (
                        <span className="text-sm text-muted-foreground line-through">
                          ৳{item.price}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}