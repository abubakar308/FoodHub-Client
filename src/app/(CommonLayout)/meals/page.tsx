import MealCard from "@/components/meals/MealCard";
import { mealsService } from "@/services/meals.service";

export default async function page() {
  const meals = await mealsService.getMeals();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-black">Browse Meals</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {meals.data.data.map((meal: any) => (
          <MealCard key={meal.id} meal={meal} />
        ))}
      </div>
    </div>
  );
}