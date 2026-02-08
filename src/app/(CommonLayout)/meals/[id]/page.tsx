import { mealsService } from "@/services/meals.service";

// const mealResponse = {
//   success: true,
//   data: {
//     title: "Chicken Burger",
//     description: "Crispy chicken burger . this burger is so delicious",
//     price: 6.5,
//     category: { name: "Burger" },
//     provider: { restaurant: "Burger House" },
//   },
// };

export default async function MealDetailsPage({ 
    params, 
}: {
  params: Promise<{ id: string }>;
}) {

const { id } = await params;

console.log(id)
  const meal = await mealsService.getMealById(`${id}`);
  console.log(meal)

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Image */}
        <div className="flex h-80 items-center justify-center rounded bg-gray-100 text-gray-400">
          Meal Image
        </div>

        {/* Details */}
        <div>
          <span className="text-sm text-green-600">{meal.data.data.category.name}</span>

          <h1 className="mt-2 text-3xl font-bold text-black">{meal.data.data.title}</h1>

          <p className="mt-4 text-gray-600">{meal.data.data.description}</p>

          <p className="mt-4 text-2xl font-semibold text-green-600">
            ${meal.data.data.price}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Restaurant: {meal.data.data.provider.restaurantName}
          </p>

          <button className="mt-6 w-full rounded bg-green-600 py-3 text-white font-medium hover:bg-green-700">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}