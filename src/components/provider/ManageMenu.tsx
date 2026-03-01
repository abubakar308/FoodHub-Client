"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  MoreHorizontal, 
  Utensils, 
  Loader2,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { getProfile } from "@/services/provider";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ManageMealsPage() {
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadMeals() {
      try {
        const response = await getProfile();

        console.log(response)
       
        setMeals(response?.data?.meals || []);
      } catch (error) {
        toast.error("Failed to load your menu items");
      } finally {
        setLoading(false);
      }
    }
    loadMeals();
  }, []);

  const filteredMeals = meals.filter((meal) =>
    meal.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 text-green-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading your delicious menu...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
     
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Manage Menu</h1>
          <p className="text-slate-500 text-sm">You have total {meals.length} items in your kitchen</p>
        </div>
        <Link href="/dashboard/add-menu">
          <Button className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-6 py-6 shadow-lg shadow-green-100 transition-all">
            <Plus className="mr-2 h-5 w-5" /> Add New Meal
          </Button>
        </Link>
      </div>

      <div className="relative group max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors" size={20} />
        <input
          type="text"
          placeholder="Search meals by title..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

    
      {filteredMeals.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-slate-300">
          <div className="bg-slate-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Utensils className="h-10 w-10 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No Meals Found</h3>
          <p className="text-slate-500 mb-6">Start adding your first meal to show up here.</p>
          <Link href="/dashboard/add-menu">
            <Button variant="outline" className="rounded-xl border-green-200 text-green-700 hover:bg-green-50">
              Create First Meal
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeals.map((meal) => (
            <div key={meal.id} className="group bg-white rounded-[24px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
             
              <div className="relative h-52 w-full overflow-hidden">
                <Image
                  src={meal.imageUrl}
                  alt={meal.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                   <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${
                     meal.isAvailable ? "bg-green-500/90 text-white" : "bg-rose-500/90 text-white"
                   }`}>
                     {meal.isAvailable ? (
                       <><CheckCircle2 size={12} /> Active</>
                     ) : (
                       <><XCircle size={12} /> Out of Stock</>
                     )}
                   </div>
                </div>
              </div>

              {/* কন্টেন্ট */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-extrabold text-slate-800 text-lg leading-tight truncate flex-1 pr-2">
                    {meal.title}
                  </h3>
                  <p className="text-green-600 font-black text-lg">৳{meal.price}</p>
                </div>
                
                <p className="text-slate-500 text-sm line-clamp-2 mb-6 min-h-[40px]">
                  {meal.description}
                </p>

               
                <div className="flex items-center gap-2">
                  <Button variant="secondary" className="flex-1 bg-slate-50 hover:bg-green-50 hover:text-green-700 border border-slate-100 rounded-xl font-bold transition-colors">
                    <Edit2 size={16} className="mr-2" /> Edit
                  </Button>
                  
                  <Button variant="ghost" className="bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded-xl transition-all">
                    <Trash2 size={18} />
                  </Button>
                  
                  <Button variant="ghost" className="text-slate-400 hover:text-slate-900 rounded-xl">
                    <MoreHorizontal size={20} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}