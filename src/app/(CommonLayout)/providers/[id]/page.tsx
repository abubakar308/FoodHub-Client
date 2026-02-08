import MealCard from "@/components/meals/MealCard";

const providerResponse = {
  success: true,
  data: {
    restaurantName: "Burger House",
    address: "Dhaka",
    meals: [
      {
        id: "233f66d5",
        title: "Chicken Burger",
        description: "Crispy chicken burger . this burger is so delicious",
        price: 6.5,
        category: { name: "Burger" },
        provider: { restaurantName: "Burger House" },
      },
      {
        id: "23c5986c",
        title: "Club Sandwich",
        description: "Triple-layer sandwich with chicken, lettuce, and mayo",
        price: 5.5,
        category: { name: "Sandwich" },
        provider: { restaurantName: "Burger House" },
      },
    ],
  },
};

export default function ProviderDetailsPage() {
  const provider = providerResponse.data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      {/* Provider Info */}
      <div className="mb-8 rounded-lg bg-green-600 p-6 text-white">
        <h1 className="text-3xl font-bold">{provider.restaurantName}</h1>
        <p className="text-sm">{provider.address}</p>
      </div>

      {/* Meals */}
      <h2 className="mb-4 text-xl font-semibold text-black">Menu</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {provider.meals.map((meal) => (
          <MealCard key={meal.id} meal={meal} />
        ))}
      </div>
    </div>
  );
}