"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/services/order";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, ShoppingCart, UtensilsCrossed, ArrowLeft, Star, User } from "lucide-react";
import Link from "next/link";
import { getMealById } from "@/services/meal";
import { useCart } from "@/context/CartContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";

// --- Types Updated ---
type Review = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: { name: string };
};

type Meal = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: { name: string };
  provider?: { restaurantName: string };
  reviews: Review[]; 
};

export default function MealDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (mealId: string) => {
      const { data } = await axiosInstance.post("/api/cart", { mealId });
      return data;
    },
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(`${meal?.title} added to cart!`);
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      } else {
        toast.error(res?.message || "Failed to add to cart");
      }
    },
    onError: () => {
      toast.error("Failed to add to cart");
    },
  });

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        setLoading(true);
        const res = await getMealById(id);
        const mealData = res?.data?.data || res?.data;
        setMeal(mealData || null);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load meal details");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchMeal();
  }, [id]);

  const averageRating = meal?.reviews?.length 
    ? (meal.reviews.reduce((acc, rev) => acc + rev.rating, 0) / meal.reviews.length).toFixed(1)
    : null;

  const handleAddToCart = () => {
    if (!meal) return;
    mutation.mutate(meal.id);
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
      <h2 className="text-3xl font-black text-slate-900 tracking-tight">Meal Not Found</h2>
      <Button asChild className="mt-8 bg-green-600 rounded-2xl font-bold">
        <Link href="/meals"><ArrowLeft className="mr-2" size={18} /> Back to Menu</Link>
      </Button>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 space-y-20">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-20">
        
        {/* Left: Image Section */}
        <div className="relative w-full lg:w-1/2 aspect-square rounded-[48px] overflow-hidden shadow-2xl border-[12px] border-white bg-slate-100">
          {meal.imageUrl ? (
            <Image src={meal.imageUrl} alt={meal.title} fill className="object-cover" priority />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-300"><UtensilsCrossed size={64} /></div>
          )}
        </div>

        {/* Right: Details Section */}
        <div className="lg:w-1/2 flex flex-col justify-center py-4">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              {meal.category?.name && (
                <span className="bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-green-100">
                  {meal.category.name}
                </span>
              )}
              {averageRating && (
                <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full text-xs font-black border border-yellow-100">
                  <Star size={14} className="fill-yellow-500 text-yellow-500" /> {averageRating}
                </div>
              )}
            </div>

            <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter">{meal.title}</h1>
            <p className="text-slate-500 text-lg leading-relaxed font-medium">{meal.description}</p>

            <div className="pt-4">
               <div className="flex items-baseline gap-2">
                 <span className="text-5xl font-black text-green-600 tracking-tighter">৳{meal.price}</span>
                 <span className="text-slate-400 font-bold">/ portion</span>
               </div>
               {meal.provider?.restaurantName && (
                 <p className="mt-4 text-sm font-bold text-slate-400">
                   Prepared by <span className="text-slate-900 underline decoration-green-200">{meal.provider.restaurantName}</span>
                 </p>
               )}
            </div>
          </div>

          <div className="mt-12">
            <Button onClick={handleAddToCart} disabled={mutation.isPending} className="w-full h-18 rounded-[24px] bg-slate-900 hover:bg-green-600 text-white text-xl font-black py-8 shadow-2xl transition-all active:scale-95">
              {mutation.isPending ? <Loader2 className="animate-spin mr-2" /> : <ShoppingCart className="mr-3" size={24} />}
              {mutation.isPending ? "Adding..." : `Add to Cart`}
            </Button>
          </div>
        </div>
      </div>

      {/* --- Review Section --- */}
      <div className="space-y-10 pb-10">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Customer Reviews</h2>
          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-bold">
            {meal.reviews?.length || 0}
          </span>
        </div>

        {meal.reviews && meal.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {meal.reviews.map((review) => (
              <div key={review.id} className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{review.user?.name || "Anonymous"}</p>
                      <p className="text-xs text-slate-400 font-medium">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-slate-600 font-medium italic">"{review.comment}"</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-[40px] p-12 text-center border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold text-lg">No reviews yet. Be the first to try this dish!</p>
          </div>
        )}
      </div>
    </div>
  );
}