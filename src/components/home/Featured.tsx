import Link from "next/link";
import MealCard from "../meals/MealCard";
import { ArrowRight, Sparkles, Utensils } from "lucide-react";
import { getAllMeals } from "@/services/meal";

export default async function Featured() {
 
  const mealsResponse = await getAllMeals();
 
  const meals = mealsResponse?.data?.data || [];

  const featuredMeals = meals.slice(0, 4);

  return (
    <section className="mx-auto max-w-7xl px-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-green-600 font-black text-xs uppercase tracking-[3px]">
            <Sparkles size={16} />
            <span>Chef's Choice</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900">
            Featured <span className="text-green-600">Meals</span> 🍽️
          </h2>
          <p className="text-slate-500 text-lg max-w-xl leading-relaxed">
            Handpicked deliciousness from our top-rated local providers. 
            Freshly prepared and ready for your table.
          </p>
        </div>
        
        <Link
          href="/meals"
          className="group flex items-center gap-2 bg-slate-50 hover:bg-green-600 hover:text-white px-6 py-3 rounded-2xl text-slate-900 font-bold text-sm transition-all duration-300 shadow-sm"
        >
          View All Dishes
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Featured Grid */}
      {featuredMeals.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featuredMeals.map((meal: any) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 py-24 text-center">
          <div className="bg-white h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
             <Utensils className="text-slate-200" size={40} />
          </div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">
            Kitchen is warming up! 🍳
          </h3>
          <p className="text-slate-500 mt-2 max-w-xs mx-auto">
            Our providers are busy preparing their signature dishes. Check back in a few.
          </p>
        </div>
      )}
    </section>
  );
}