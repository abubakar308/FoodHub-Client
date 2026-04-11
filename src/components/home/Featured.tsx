import Link from "next/link";
import MealCard from "../meals/MealCard";
import { ArrowRight, Sparkles, Utensils, ChefHat } from "lucide-react";
import { getAllMeals } from "@/services/meal";

type Meal = {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  price: string | number;
  discountPrice?: string | number | null;
  imageUrl?: string | null;
  isAvailable?: boolean;
  isFeatured?: boolean;
  averageRating?: number;
  totalReviews?: number;
  preparationTime?: number | null;
  calories?: number | null;
  tags?: string | null;
  category?: {
    id: string;
    name: string;
    slug?: string | null;
  } | null;
  provider?: {
    id: string;
    restaurantName?: string | null;
    restaurantLogo?: string | null;
    averageRating?: number;
    totalReviews?: number;
  } | null;
};

export default async function Featured() {
  const mealsResponse = await getAllMeals();

  const meals: Meal[] = mealsResponse?.data?.data || [];

  const featuredFromApi = meals.filter((meal) => meal.isFeatured);
  const featuredMeals =
    featuredFromApi.length > 0 ? featuredFromApi.slice(0, 4) : meals.slice(0, 4);

  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <Sparkles className="h-4 w-4" />
              Chef’s Choice
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl lg:text-5xl">
                Featured <span className="text-primary">Meals</span>
              </h2>

              <p className="text-base leading-7 text-muted-foreground md:text-lg">
                Handpicked dishes from trusted providers, curated for quality,
                freshness, and a truly satisfying dining experience.
              </p>
            </div>
          </div>

          <Link
            href="/meals"
            className="group inline-flex items-center gap-2 self-start rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground shadow-sm transition-all duration-300 hover:border-primary/30 hover:bg-primary hover:text-primary-foreground hover:shadow-md"
          >
            View All Meals
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Featured Grid */}
        {featuredMeals.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {featuredMeals.map((meal) => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </div>

            {/* Bottom note */}
            <div className="mt-10 flex justify-center">
              <p className="rounded-full border border-border bg-muted/40 px-4 py-2 text-sm text-muted-foreground">
                Showing {featuredMeals.length} curated meal
                {featuredMeals.length > 1 ? "s" : ""} for quick discovery
              </p>
            </div>
          </>
        ) : (
          <div className="rounded-[32px] border border-dashed border-border bg-card/60 px-6 py-16 text-center shadow-sm md:px-10 md:py-24">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-border bg-background shadow-sm">
              <ChefHat className="h-9 w-9 text-muted-foreground" />
            </div>

            <h3 className="text-2xl font-bold tracking-tight text-foreground">
              Fresh dishes are coming soon
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground md:text-base">
              Our providers are preparing their best meals for you. Once dishes
              are added or marked as featured, they will appear here
              automatically.
            </p>

            <div className="mt-8">
              <Link
                href="/meals"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Browse All Meals
                <Utensils className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}