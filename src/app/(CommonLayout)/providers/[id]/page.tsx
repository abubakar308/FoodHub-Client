"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProvider, Provider } from "@/services/provider";
import MealCard from "@/components/meals/MealCard";

export default function ProviderDetailPage() {
  const params = useParams();
  const { id } = params;
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProvider = async () => {
      if (!id) return;
      const res = await getProvider(id as string);
      if (res.success && res.data) setProvider(res.data);
      setLoading(false);
    };
    fetchProvider();
  }, [id]);

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500 text-lg">Loading provider...</p>
    );

  if (!provider)
    return (
      <p className="text-center mt-10 text-red-500 text-lg font-medium">
        Provider not found
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
      {/* Provider Info */}
      <div className="bg-white rounded-lg shadow p-6 sm:p-8 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-900">
          {provider.restaurantName}
        </h1>
        <div className="text-gray-600 space-y-1 sm:space-y-0 sm:flex sm:space-x-6">
          <p className="text-sm sm:text-base">
            <span className="font-medium text-gray-700">Address:</span> {provider.address}
          </p>
          <p className="text-sm sm:text-base">
            <span className="font-medium text-gray-700">Phone:</span> {provider.phone || "N/A"}
          </p>
        </div>
      </div>

      {/* Menu Section */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800">
          Menu
        </h2>

        {provider.meals && provider.meals.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {provider.meals.map((meal) => {
              const mappedMeal = {
                ...meal,
                category: { name: "Default Category" }, // replace with actual category if available
                provider: { restaurantName: provider.restaurantName },
              };
              return <MealCard key={meal.id} meal={mappedMeal} />;
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-10">
            No meals available.
          </p>
        )}
      </div>
    </div>
  );
}