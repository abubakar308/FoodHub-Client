"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { addToCart } from "@/services/order";
import { ShoppingCart, Utensils, Store, ArrowUpRight } from "lucide-react";

type Meal = {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  price: number;
  category: { name: string };
  provider: { restaurantName: string };
};

export default function MealCard({ meal }: { meal: Meal }) {
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await addToCart(meal.id);
      if (res?.success) {
        toast.success(`${meal.title} added to cart! 😋`);
      } else {
        toast.error(res?.message || "Failed to add to cart");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Link href={`/meals/${meal.id}`} className="group block h-full">
      <div className="relative flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/10 hover:-translate-y-2">
        
        {/* Hover Arrow Indicator */}
        <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg text-green-600">
            <ArrowUpRight size={18} />
          </div>
        </div>

        {/* Image Section */}
        <div className="relative h-56 w-full overflow-hidden">
          {meal?.imageUrl ? (
            <Image
              src={meal.imageUrl}
              alt={meal.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
              <Utensils size={40} strokeWidth={1} />
            </div>
          )}

          {/* Price Badge */}
          <div className="absolute bottom-4 left-4 z-10">
            <span className="rounded-2xl bg-slate-900/80 backdrop-blur-md px-4 py-1.5 text-sm font-black text-white shadow-xl border border-white/20">
              ৳ {meal.price}
            </span>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col p-5">
          {/* Category & Provider */}
          <div className="flex items-center justify-between mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span className="bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-lg text-green-600">
              {meal.category?.name}
            </span>
            <div className="flex items-center gap-1 max-w-[120px]">
              <Store size={12} className="text-slate-300" />
              <span className="truncate">{meal.provider?.restaurantName}</span>
            </div>
          </div>

          <h3 className="text-xl font-extrabold text-slate-800 leading-tight group-hover:text-green-600 transition-colors line-clamp-1">
            {meal.title}
          </h3>

          <p className="mt-2 text-sm text-slate-500 line-clamp-2 flex-1 leading-relaxed">
            {meal.description}
          </p>

          {/* Add to Cart Button */}
          <div className="mt-5">
            <Button 
              onClick={handleAddToCart} 
              className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold gap-2 shadow-lg shadow-green-100 transition-all active:scale-95"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}