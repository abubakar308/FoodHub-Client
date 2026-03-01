"use client";

import React, { useState, useEffect } from "react"; // React ইমপোর্ট করা হয়েছে
import { Button } from "@/components/ui/button";
import { mealsService } from "@/services/meals.service";
import { addToCart } from "@/services/order";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, ShoppingCart, UtensilsCrossed, ArrowLeft } from "lucide-react";
import Link from "next/link";

type Meal = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: { name: string };
  provider?: { restaurantName: string };
};

export default function MealDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // ১. params-কে unwrapping করা (Next.js 15+ এর জন্য প্রয়োজনীয়)
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        setLoading(true);
        const res = await mealsService.getMealById(id);
        const mealData = res?.data?.data || res?.data;
        setMeal(mealData || null);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load meal details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMeal();
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!meal) return;
    try {
      setAdding(true);
      const res = await addToCart(meal.id);
      if (res?.success) toast.success(`${meal.title} added to cart!`);
      else toast.error(res?.message || "Failed to add to cart");
    } catch (err) {
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="animate-spin text-green-600" size={40} />
      <p className="text-slate-500 font-medium tracking-wide">Cooking up the details...</p>
    </div>
  );

  if (!meal) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="bg-slate-100 p-6 rounded-full mb-6 text-slate-400">
        <UtensilsCrossed size={48} />
      </div>
      <h2 className="text-3xl font-black text-slate-900 tracking-tight">Dish Not Found</h2>
      <p className="text-slate-500 mt-2 max-w-sm">
        It seems this delicious meal has been removed from our kitchen.
      </p>
      <Button asChild className="mt-8 bg-green-600 hover:bg-green-700 rounded-2xl px-8 h-12 shadow-lg shadow-green-100 font-bold">
        <Link href="/meals">
          <ArrowLeft className="mr-2" size={18} /> Back to Menu
        </Link>
      </Button>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-20">
        
        {/* Left: Enhanced Image Section */}
        <div className="relative w-full lg:w-1/2 aspect-square rounded-[48px] overflow-hidden shadow-2xl border-[12px] border-white bg-slate-100">
          {meal.imageUrl ? (
            <Image
              src={meal.imageUrl}
              alt={meal.title}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              priority
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-300">
               <UtensilsCrossed size={64} strokeWidth={1} />
            </div>
          )}
        </div>

        {/* Right: Modern Details Section */}
        <div className="lg:w-1/2 flex flex-col justify-center py-4">
          <div className="space-y-6">
            {meal.category?.name && (
              <span className="inline-flex bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-green-100">
                {meal.category.name}
              </span>
            )}

            <h1 className="text-5xl lg:text-6xl font-black text-slate-900 leading-none tracking-tighter">
              {meal.title}
            </h1>

            <p className="text-slate-500 text-lg leading-relaxed font-medium">
              {meal.description}
            </p>

            <div className="pt-4">
               <div className="flex items-baseline gap-2">
                 <span className="text-5xl font-black text-green-600 tracking-tighter">
                   ৳{Number(meal.price).toLocaleString()}
                 </span>
                 <span className="text-slate-400 font-bold">/ portion</span>
               </div>
               {meal.provider?.restaurantName && (
                 <p className="mt-4 text-sm font-bold text-slate-400 flex items-center gap-2">
                   Prepared with ❤️ by <span className="text-slate-900 underline decoration-green-200 underline-offset-4">{meal.provider.restaurantName}</span>
                 </p>
               )}
            </div>
          </div>

          <div className="mt-12">
            <Button
              onClick={handleAddToCart}
              disabled={adding}
              className="w-full h-18 rounded-[24px] bg-slate-900 hover:bg-green-600 text-white text-xl font-black shadow-2xl transition-all duration-300 active:scale-95 py-8"
            >
              {adding ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <ShoppingCart className="mr-3" size={24} />
              )}
              {adding ? "Adding..." : `Add to Cart`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}