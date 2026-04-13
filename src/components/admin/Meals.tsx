"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, Trash2, UtensilsCrossed, RefreshCw } from "lucide-react";
import { getAllMeals } from "@/services/meal";
import { deleteMeal } from "@/services/meal";

type Meal = {
  id: string;
  title: string;
  price: number | string;
  discountPrice?: number | string | null;
  imageUrl?: string | null;
  isAvailable?: boolean;
  isFeatured?: boolean;
  calories?: number | null;
  preparationTime?: number | null;
  createdAt?: string;
  category?: { name?: string } | null;
  provider?: { restaurantName?: string } | null;
};

export default function AdminMealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchMeals = async () => {
    setLoading(true);
    try {
      const res = await getAllMeals({ limit: 100 });
      const data = res?.data?.data || [];
      setMeals(data);
    } catch {
      toast.error("Failed to load meals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const handleDelete = (mealId: string) => {
    if (!confirm("Are you sure you want to delete this meal?")) return;
    setDeletingId(mealId);
    startTransition(async () => {
      try {
        await deleteMeal(mealId);
        toast.success("Meal deleted successfully");
        setMeals((prev) => prev.filter((m) => m.id !== mealId));
      } catch {
        toast.error("Failed to delete meal");
      } finally {
        setDeletingId(null);
      }
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-3xl">
            Meals Management
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {meals.length} meals listed on the platform
          </p>
        </div>
        <button
          onClick={fetchMeals}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {meals.length === 0 ? (
        <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
          <UtensilsCrossed className="h-10 w-10 text-slate-400" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            No meals found
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="px-4 py-4 text-left font-bold text-slate-500 dark:text-slate-400">
                    Meal
                  </th>
                  <th className="px-4 py-4 text-left font-bold text-slate-500 dark:text-slate-400">
                    Category
                  </th>
                  <th className="px-4 py-4 text-left font-bold text-slate-500 dark:text-slate-400">
                    Provider
                  </th>
                  <th className="px-4 py-4 text-left font-bold text-slate-500 dark:text-slate-400">
                    Price
                  </th>
                  <th className="px-4 py-4 text-left font-bold text-slate-500 dark:text-slate-400">
                    Status
                  </th>
                  <th className="px-4 py-4 text-left font-bold text-slate-500 dark:text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {meals.map((meal) => (
                  <tr
                    key={meal.id}
                    className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                          {meal.imageUrl ? (
                            <Image
                              src={meal.imageUrl}
                              alt={meal.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                              <UtensilsCrossed className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <span className="max-w-[180px] truncate font-semibold text-slate-900 dark:text-white">
                          {meal.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                      {meal.category?.name || "—"}
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                      {meal.provider?.restaurantName || "—"}
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-900 dark:text-white">
                      ৳{meal.discountPrice ?? meal.price}
                      {meal.discountPrice && (
                        <span className="ml-1 text-xs text-slate-400 line-through">
                          ৳{meal.price}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          meal.isAvailable
                            ? "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {meal.isAvailable ? "Available" : "Unavailable"}
                      </span>
                      {meal.isFeatured && (
                        <span className="ml-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleDelete(meal.id)}
                        disabled={deletingId === meal.id || isPending}
                        className="flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                      >
                        {deletingId === meal.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
