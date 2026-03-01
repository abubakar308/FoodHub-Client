"use client";

import { useState, useEffect } from "react";
import { getCategories } from "@/services/categories";
import { Loader2, Utensils, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

type Category = {
  id: string;
  name: string;
};

// ক্যাটাগরির জন্য কিছু সফট কালার কম্বিনেশন
const colors = [
  "bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-600",
  "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-600",
  "bg-green-50 text-green-600 border-green-100 hover:bg-green-600",
  "bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-600",
  "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-600",
  "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-600",
];

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        // API response structure অনুযায়ী data mapping করুন
        setCategories(Array.isArray(data) ? data : data?.data || []);
      } catch (err: any) {
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-green-600" size={32} />
        <p className="text-slate-400 font-medium animate-pulse">Finding fresh categories...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center bg-rose-50 rounded-3xl border border-rose-100 mx-4">
        <p className="text-rose-500 font-bold">{error}</p>
      </div>
    );

  if (!categories.length) return null;

  return (
    <section className="container mx-auto px-6 py-16">
      <div className="flex flex-col items-center mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
          What are you <span className="text-green-600">craving?</span>
        </h2>
        <div className="h-1.5 w-20 bg-green-500/20 rounded-full mt-4" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {categories.map((cat, index) => {
          const colorStyle = colors[index % colors.length];
          
          return (
            <div
              key={cat.id}
              className={cn(
                "group relative flex flex-col items-center justify-center gap-3 h-32 rounded-[32px] border-2 border-transparent p-4 text-center transition-all duration-300 cursor-pointer overflow-hidden",
                colorStyle,
                "hover:text-white hover:border-transparent hover:-translate-y-2 hover:shadow-2xl hover:shadow-current/20"
              )}
            >
              {/* Background Decor */}
              <div className="absolute -right-2 -bottom-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <Hash size={60} />
              </div>

              <div className="bg-white/80 group-hover:bg-white/20 p-3 rounded-2xl transition-colors shadow-sm">
                 <Utensils size={24} className="group-hover:scale-110 transition-transform" />
              </div>
              
              <span className="text-sm font-extrabold tracking-tight">
                {cat.name}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}