import Link from "next/link";

type Provider = {
  id: string;
  restaurantName: string;
  address: string;
};

export default function ProviderCard({ provider }: { provider: Provider }) {
  return (
    <Link href={`/providers/${provider.id}`}>
      <div className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition">
        <div className="mb-4 flex h-16 items-center justify-center rounded bg-green-50 text-green-600 text-xl">
          🍽️
        </div>

        <h3 className="text-lg font-semibold text-black">
          {provider.restaurantName}
        </h3>

        <p className="mt-1 text-sm text-gray-600">{provider.address}</p>
      </div>
    </Link>
  );
}