"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllMeals } from "@/services/meal";
import { BadgePercent, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Meal = {
  id: string;
  title: string;
  slug: string;
  price: string;
  discountPrice?: string | null;
  imageUrl?: string;
};

export default function OffersSection() {
  const [offers, setOffers] = useState<Meal[]>([]);

  useEffect(() => {
    const loadOffers = async () => {
      const res = await getAllMeals();
      const meals = res?.data?.data || [];

      const discounted = meals.filter(
        (meal: Meal) => meal.discountPrice && Number(meal.discountPrice) < Number(meal.price)
      );

      setOffers(discounted.slice(0, 3));
    };

    loadOffers();
  }, []);

  if (!offers.length) return null;

  return (
    <section className="bg-muted/40 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
            Special <span className="text-primary">Offers</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Grab the best deals from our top meals today
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {offers.map((meal) => {
            const discount =
              100 -
              (Number(meal.discountPrice) / Number(meal.price)) * 100;

            return (
              <Link
                key={meal.id}
                href={`/meals/${meal.slug}`}
                className="group rounded-3xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-xl transition-all"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={meal.imageUrl}
                    className="h-full w-full object-cover group-hover:scale-105 transition"
                  />

                  <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <BadgePercent size={14} />
                    {Math.round(discount)}% OFF
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-card-foreground">
                    {meal.title}
                  </h3>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-primary font-bold text-lg">
                      ৳{meal.discountPrice}
                    </span>
                    <span className="line-through text-muted-foreground text-sm">
                      ৳{meal.price}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-sm text-primary font-semibold">
                    Order Now
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}