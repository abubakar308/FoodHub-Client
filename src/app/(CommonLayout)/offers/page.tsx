import MealCard from "@/components/meals/MealCard";
import { getAllMeals } from "@/services/meal";
import { BadgePercent, Sparkles } from "lucide-react";

export const metadata = {
  title: "Special Offers | QuickPlatter",
  description: "Grab the best deals and discounts on your favorite meals.",
};

export default async function OffersPage() {
  const mealsRes = await getAllMeals({ limit: 100 });
  const allMeals = mealsRes?.data?.data || [];

  // Filter for discounted meals
  const discountedMeals = allMeals.filter(
    (meal: any) =>
      meal.discountPrice && Number(meal.discountPrice) < Number(meal.price)
  );

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 py-20 lg:py-32">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-[120px]" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-primary mb-6 animate-fade-in">
              <BadgePercent className="h-4 w-4" />
              Exclusive Deals
            </div>
            
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
              Hot <span className="text-primary">Offers</span> & <br />
              Daily Specials
            </h1>
            
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
              Save big on our most popular dishes! From limited-time discounts to 
              exclusive provider specials, find the best value for your next meal.
            </p>
          </div>
        </div>
      </section>

      {/* Meals Grid */}
      <section className="-mt-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-[40px] border border-border bg-background/60 p-8 backdrop-blur-xl md:p-12 shadow-2xl">
          {discountedMeals.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {discountedMeals.map((meal: any) => (
                <div key={meal.id} className="animate-in fade-in slide-in-from-bottom-5 duration-500">
                  <MealCard meal={meal} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="rounded-full bg-muted p-6 mb-6">
                <Sparkles className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">No active offers right now</h2>
              <p className="mt-2 text-muted-foreground max-w-sm">
                Check back soon! Our providers are constantly updating their menus with fresh deals.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
