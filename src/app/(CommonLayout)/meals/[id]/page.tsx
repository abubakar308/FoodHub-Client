import { mealsService } from "@/services/meals.service";
import Image from "next/image";

export default async function MealDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meal = await mealsService.getMealById(`${id}`);
  const data = meal.data.data;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
        {/* Image Section */}
        <div className="relative w-full lg:w-1/2 h-80 lg:h-28rem rounded-xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center">
          {data.imageUrl ? (
            <Image
              src={data?.imageUrl}
              alt={data.title}
              fill
              className="object-cover"
            />
          ) : (
            <span className="text-gray-400">No Image Available</span>
          )}
        </div>

        {/* Details Section */}
        <div className="lg:w-1/2 flex flex-col justify-between">
          <div>
            <span className="inline-block rounded-full bg-green-100 text-green-700 px-3 py-1 text-sm font-semibold">
              {data.category.name}
            </span>

            <h1 className="mt-4 text-3xl lg:text-4xl font-extrabold text-gray-900">
              {data.title}
            </h1>

            <p className="mt-4 text-gray-600 text-base lg:text-lg leading-relaxed">
              {data.description}
            </p>

            <p className="mt-6 text-3xl font-bold text-green-600">
              ${data.price.toFixed(2)}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Restaurant: <span className="font-medium">{data.provider.restaurantName}</span>
            </p>
          </div>

          <button className="mt-8 w-full lg:w-2/3 bg-green-600 hover:bg-green-700 transition-colors text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}