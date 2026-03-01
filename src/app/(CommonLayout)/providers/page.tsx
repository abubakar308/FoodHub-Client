"use client";

import { useEffect, useState } from "react";
import ProviderCard from "@/components/provider/ProviderCard";
import { getProviders, Provider } from "@/services/provider";
import { Loader2, Store, Search, Utensils } from "lucide-react";

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await getProviders();
        if (res.success && res.data) {
          setProviders(res.data as Provider[]);
        }
      } catch (error) {
        console.error("Failed to load providers");
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  // লোডিং স্টেট (একটি ক্লিনার লেআউট সহ)
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] gap-4">
        <Loader2 className="animate-spin text-green-600" size={40} />
        <p className="text-slate-500 font-medium animate-pulse">
          Opening restaurant doors...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero-ish Header Section */}
      <div className="bg-white border-b border-slate-100 mb-10">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600 font-black text-xs uppercase tracking-widest">
                <Store size={16} />
                <span>Our Partners</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                Top <span className="text-green-600">Restaurants</span> & Chefs
              </h1>
              <p className="text-slate-500 text-lg max-w-2xl leading-relaxed font-medium">
                Discover the best local food providers near you. From home-run kitchens 
                to premium restaurants.
              </p>
            </div>

            {/* Optional: Results Count */}
            <div className="bg-slate-100 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 border border-slate-200">
              {providers.length} Places found
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-20">
        {providers.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {providers.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[40px] border border-slate-100 shadow-sm">
            <div className="bg-slate-50 p-6 rounded-full mb-4">
              <Utensils className="text-slate-300" size={48} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No restaurants found</h3>
            <p className="text-slate-500 mt-2">Check back later for new providers.</p>
          </div>
        )}
      </div>
    </div>
  );
}