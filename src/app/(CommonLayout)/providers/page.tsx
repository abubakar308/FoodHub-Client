import ProviderCard from "@/components/provider/ProviderCard";

const providersResponse = {
  success: true,
  data: [
    {
      id: "bd385e93",
      restaurantName: "Burger House",
      address: "Dhaka",
    },
    {
      id: "03effdd3",
      restaurantName: "Pizza Palace",
      address: "Dhaka",
    },
    {
      id: "385f3bac",
      restaurantName: "Sandwich Corner",
      address: "Baridhara Dhaka",
    },
  ],
};
export default function page() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-black">Restaurants</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {providersResponse.data.map((provider) => (
          <ProviderCard key={provider.id} provider={provider} />
        ))}
      </div>
    </div>
  );
}