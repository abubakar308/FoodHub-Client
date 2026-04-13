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
import { deleteMeal } from "@/services/meal";
import { Skeleton } from "@/components/ui/skeleton";
import { MealCardSkeleton } from "@/components/shared/Skeletons";

export default function ManageMealsPage() {
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadMeals() {
      try {
        const response = await getProfile();
        setMeals(response?.data?.meals || []);
      } catch (error) {
        toast.error("Failed to load your menu items");
      } finally {
        setLoading(false);
      }
    }
    loadMeals();
  }, []);


  const handleDelete = async (id: string, title: string) => {
    toast(`Are you sure you want to delete "${title}"?`, {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            const res = await deleteMeal(id);
           if (res?.success) {
      toast.success(`${title} removed successfully`);
      setMeals((prev) => prev.filter((meal) => meal.id !== id));
    } else {
  
      if (res?.error?.includes("OrderItem_mealId_fkey")) {
        toast.error(`Cannot delete "${title}" because it is part of an active order history. Try hiding it instead.`);
      } else {
        toast.error(res?.message || "Deletion failed");
      }
    }
          } catch (error) {
            toast.error("An unexpected error occurred");
          }
        },
      },
      cancel: { label: "Cancel", onClick: () => {} },
    });
  };

  const filteredMeals = meals.filter((meal) =>
    meal.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading)
    return (
      <div className="space-y-8 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64 rounded-xl" />
            <Skeleton className="h-4 w-48 rounded-lg" />
          </div>
          <Skeleton className="h-12 w-48 rounded-2xl" />
        </div>
        <Skeleton className="h-14 w-full max-w-md rounded-[20px]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <MealCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );

  return (
    <div className="space-y-8 p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Manage Menu</h1>
          <p className="text-muted-foreground text-sm">You have total {meals.length} items</p>
        </div>
        <Link href="/dashboard/add-menu">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-6 py-6 shadow-lg transition-all active:scale-95">
            <Plus className="mr-2 h-5 w-5" /> Add New Meal
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative group max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
        <input
          type="text"
          placeholder="Search meals..."
          className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-[20px] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredMeals.length === 0 ? (
        <div className="text-center py-20 bg-background rounded-[40px] border-2 border-dashed border-border">
          <Utensils className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground">No Meals Found</h3>
          <p className="text-muted-foreground mb-6">Start your menu by adding a meal</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMeals.map((meal) => (
            <div key={meal.id} className="group bg-card rounded-[32px] border border-border shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
              
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={meal.imageUrl || "/placeholder.jpg"}
                  alt={meal.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md text-white ${
                    meal.isAvailable ? "bg-green-500/90" : "bg-rose-500/90"
                  }`}>
                    {meal.isAvailable ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    {meal.isAvailable ? "Active" : "Hidden"}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-black text-foreground text-xl leading-tight truncate flex-1 pr-2">
                    {meal.title}
                  </h3>
                  <p className="text-primary font-black text-xl tracking-tighter">৳{meal.price}</p>
                </div>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-8 min-h-[40px] leading-relaxed">
                  {meal.description}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2">
                 
                  <Link href={`/dashboard/manage-menu/${meal.id}`} className="flex-1">
                    <Button 
                      variant="secondary" 
                      className="w-full bg-muted hover:bg-primary hover:text-primary-foreground border border-border rounded-2xl font-black py-6 transition-all"
                    >
                      <Edit2 size={18} className="mr-2" /> Edit
                    </Button>
                  </Link>
                  
                  <Button 
                    variant="ghost" 
                    className="bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-2xl h-12 w-12 transition-all"
                    onClick={() => handleDelete(meal.id, meal.title)}
                  >
                    <Trash2 size={20} />
                  </Button>
                  
                  <Button variant="ghost" className="text-slate-300 hover:text-slate-900 rounded-2xl h-12 w-12">
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