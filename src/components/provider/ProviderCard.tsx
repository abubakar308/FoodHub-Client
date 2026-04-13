import Link from "next/link";
import { MapPin, Utensils, ArrowRight, Star } from "lucide-react";

type Provider = {
  id: string;
  restaurantName: string;
  address: string;
};

export default function ProviderCard({ provider }: { provider: Provider }) {
  return (
    <Link href={`/providers/${provider.id}`} className="group block">
      <div className="relative overflow-hidden rounded-[32px] border border-border bg-card p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-500/10 hover:border-primary/20">
        
        {/* Top Decorative Icon */}
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-500 group-hover:bg-primary group-hover:text-primary-foreground">
          <Utensils size={28} />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-foreground transition-colors group-hover:text-primary">
              {provider.restaurantName}
            </h3>
            {/* Mock Rating: if you have rating data, use it here */}
            <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-lg">
              <Star size={12} fill="currentColor" />
              <span>4.5</span>
            </div>
          </div>

          <div className="flex items-start gap-1.5 text-muted-foreground">
            <MapPin size={16} className="mt-0.5 shrink-0 text-muted-foreground/60" />
            <p className="text-sm font-medium leading-tight line-clamp-2">
              {provider.address}
            </p>
          </div>
        </div>

        {/* Action Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            View Menu
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:translate-x-1">
            <ArrowRight size={16} />
          </div>
        </div>

        {/* Subtle Background Glow on Hover */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-green-500/5 blur-3xl transition-opacity opacity-0 group-hover:opacity-100" />
      </div>
    </Link>
  );
}