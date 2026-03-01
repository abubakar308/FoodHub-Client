import MealCard from "@/components/meals/MealCard";
import { getAllMeals } from "@/services/meal";

export default async function Page() {
  const meals = await getAllMeals();
  const data = meals?.data?.data || [];


  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      
      {/* Header */}
      <div className="mb-10 flex flex-col gap-2 text-center sm:text-left">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
          Discover Delicious Meals 🍽️
        </h1>
        <p className="text-gray-500 text-base max-w-2xl">
          Explore meals from trusted providers. Fresh, tasty, and ready to order.
        </p>
      </div>

      {/* Grid */}
      {data.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((meal: any) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h3 className="text-xl font-semibold text-gray-700">
            No meals available yet
          </h3>
          <p className="text-gray-500 mt-2">
            Providers haven’t added meals. Check back later.
          </p>
        </div>
      )}
    </section>
  );
}