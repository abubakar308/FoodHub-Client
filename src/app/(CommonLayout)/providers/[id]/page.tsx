"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProvider, Provider } from "@/services/provider";
import MealCard from "@/components/meals/MealCard";
import { 
  Loader2, 
  MapPin, 
  Phone, 
  UtensilsCrossed, 
  ArrowLeft, 
  Store, 
  Clock 
} from "lucide-react";
import Link from "next/link";

export default function ProviderDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProvider = async () => {
      if (!id) return;
      try {
        const res = await getProvider(id as string);
        if (res.success && res.data) setProvider(res.data);
      } catch (error) {
        console.error("Error fetching provider:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProvider();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="animate-spin text-green-600" size={40} />
      <p className="text-slate-500 font-medium animate-pulse">Loading Restaurant Profile...</p>
    </div>
  );

  if (!provider) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <UtensilsCrossed size={64} className="text-slate-300 mb-4" />
      <h2 className="text-2xl font-black text-slate-800">Restaurant Not Found</h2>
      <Link href="/providers" className="mt-4 text-green-600 font-bold flex items-center gap-2 hover:underline">
        <ArrowLeft size={18} /> Back to all restaurants
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* 1. Profile Banner Section */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
          <Link href="/providers" className="inline-flex items-center gap-2 text-slate-400 hover:text-green-600 font-bold text-sm mb-8 transition-colors">
            <ArrowLeft size={16} /> BACK TO LIST
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 bg-green-50 text-green-600 px-3 py-1 rounded-lg w-fit text-xs font-black uppercase tracking-widest">
                <Store size={14} /> Verified Provider
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
                {provider.restaurantName}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-slate-500">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                  <MapPin size={18} className="text-green-600" />
                  <span className="text-sm font-medium">{provider.address}</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                  <Phone size={18} className="text-blue-500" />
                  <span className="text-sm font-medium">{provider.phone || "No Contact info"}</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                  <Clock size={18} className="text-amber-500" />
                  <span className="text-sm font-medium tracking-tight">Open: 09:00 AM - 10:00 PM</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="bg-slate-900 text-white p-6 rounded-[32px] text-center min-w-[140px]">
                <p className="text-3xl font-black">{provider.meals?.length || 0}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Items</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Menu Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Signature <span className="text-green-600">Menu</span>
            </h2>
            <div className="h-1 w-12 bg-green-500 rounded-full mt-2" />
          </div>
        </div>

        {provider.meals && provider.meals.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {provider.meals.map((meal) => {
              const mappedMeal = {
                ...meal,
                category: { name: (meal as any).category?.name || "Delicious Food" },
                provider: { restaurantName: provider.restaurantName },
              };
              return <MealCard key={meal.id} meal={mappedMeal as any} />;
            })}
          </div>
        ) : (
          <div className="bg-white rounded-[40px] border border-slate-100 py-20 text-center">
            <UtensilsCrossed size={48} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-xl font-bold text-slate-400">The kitchen is currently empty</h3>
            <p className="text-slate-400 text-sm">Follow this provider for menu updates!</p>
          </div>
        )}
      </div>
    </div>
  );
}