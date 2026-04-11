"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getCategories } from "@/services/categories";
import { Loader2, Utensils, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

type Category = {
  id: string;
  name: string;
  slug: string | null;
  icon?: string | null;
};

const colors = [
  "bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
  "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  "bg-green-50 text-green-600 border-green-100 hover:bg-green-600 dark:bg-green-500/10 dark:text-green-400",
  "bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
  "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
  "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
];

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();

        const data = res?.data || res;
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  /* ================= Loading ================= */
  if (loading)
    return (
      <section className="py-16 flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-muted-foreground font-medium animate-pulse">
          Loading categories...
        </p>
      </section>
    );

  /* ================= Error ================= */
  if (error)
    return (
      <section className="py-16">
        <div className="text-center rounded-2xl border border-destructive/20 bg-destructive/10 p-6 max-w-md mx-auto">
          <p className="text-destructive font-semibold">{error}</p>
        </div>
      </section>
    );

  if (!categories.length) return null;

  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            What are you <span className="text-primary">craving?</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Explore meals by category and discover your next favorite dish
          </p>
          <div className="h-1.5 w-20 bg-primary/20 rounded-full mx-auto mt-4" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories.map((cat, index) => {
            const colorStyle = colors[index % colors.length];

            // ✅ slug fallback
            const slug =
              cat.slug ||
              cat.name.toLowerCase().replace(/\s+/g, "-");

            return (
              <Link
                key={cat.id}
                href={`/meals?category=${slug}`}
                className={cn(
                  "group relative flex flex-col items-center justify-center gap-3 h-32 rounded-[28px] border p-4 text-center transition-all duration-300 overflow-hidden",
                  "bg-card border-border hover:-translate-y-2 hover:shadow-xl",
                  colorStyle,
                  "hover:text-white"
                )}
              >
                {/* Background Decor */}
                <div className="absolute -right-2 -bottom-2 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Hash size={60} />
                </div>

                {/* Icon */}
                <div className="bg-background/80 dark:bg-white/10 group-hover:bg-white/20 p-3 rounded-xl transition-all">
                  <Utensils className="h-6 w-6 group-hover:scale-110 transition-transform" />
                </div>

                {/* Name */}
                <span className="text-sm font-bold tracking-tight">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/categories"
            className="text-primary font-semibold hover:underline"
          >
            View All Categories →
          </Link>
        </div>
      </div>
    </section>
  );
}