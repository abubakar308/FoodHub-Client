import Link from "next/link";
import MealCard from "../meals/MealCard";
import { mealsService } from "@/services/meals.service";

export default async function Featured() {
  // Fetch meals from service
  const mealsResponse = await mealsService.getMeals();
  const meals = mealsResponse?.data?.data || [];

  // Take only first 4 for featured
  const featuredMeals = meals.slice(0, 4);

  return (
    <section className="mx-auto max-w-7xl px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Featured Meals 🍽️
          </h2>
          <p className="text-gray-500 text-base max-w-2xl mt-2">
            Explore meals from trusted providers. Fresh, tasty, and ready to order.
          </p>
        </div>
        <Link
          href="/meals"
          className="text-green-600 text-sm font-medium hover:underline"
        >
          View all meals
        </Link>
      </div>

      {/* Featured Grid */}
      {featuredMeals.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featuredMeals.map((meal: any) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h3 className="text-xl font-semibold text-gray-700">
            No featured meals yet
          </h3>
          <p className="text-gray-500 mt-2">
            Providers haven’t added meals. Check back later.
          </p>
        </div>
      )}
    </section>
  );
}