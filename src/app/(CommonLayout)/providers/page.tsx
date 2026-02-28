"use client";

import { useEffect, useState } from "react";
import ProviderCard from "@/components/provider/ProviderCard";
import { getProviders, Provider } from "@/services/provider";


export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      if (res.success && res.data) {
        setProviders(res.data as Provider[]);
      }
      setLoading(false);
    };

    fetchProviders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading restaurants...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-black">Restaurants</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {providers.map((provider) => (
          <ProviderCard key={provider.id} provider={provider} />
        ))}
      </div>
    </div>
  );
}