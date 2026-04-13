"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Loader2,
  Store,
  MapPin,
  Phone,
  RefreshCw,
  UtensilsCrossed,
} from "lucide-react";
import { getProviders, type Provider } from "@/services/provider";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const res = await getProviders();
      const data = Array.isArray(res?.data) ? (res.data as Provider[]) : [];
      setProviders(data);
    } catch {
      toast.error("Failed to load providers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  if (loading)
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between rounded-3xl border border-border bg-card px-6 py-5 shadow-sm">
           <div className="space-y-2">
              <Skeleton className="h-8 w-64 rounded-xl" />
              <Skeleton className="h-4 w-48 rounded-lg" />
           </div>
           <Skeleton className="h-10 w-24 rounded-xl" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
               <div className="flex items-center gap-4 border-b border-border p-5">
                  <Skeleton className="h-14 w-14 rounded-2xl" />
                  <div className="space-y-2">
                     <Skeleton className="h-5 w-32 rounded-md" />
                     <Skeleton className="h-3 w-24 rounded-md" />
                  </div>
               </div>
               <div className="p-5 space-y-3">
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-2/3 rounded-md" />
                  <Skeleton className="h-4 w-1/2 rounded-md" />
               </div>
            </div>
          ))}
        </div>
      </section>
    );

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between rounded-3xl border border-border bg-card px-6 py-5 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-3xl">
            Providers Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {providers.length} providers registered on the platform
          </p>
        </div>
        <button
          onClick={fetchProviders}
          className="flex items-center gap-2 rounded-xl border border-border bg-muted px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-accent"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {providers.length === 0 ? (
        <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border bg-muted/40">
          <Store className="h-10 w-10 text-muted-foreground/30" />
          <p className="text-sm font-medium text-muted-foreground">
            No providers found
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:shadow-md"
            >
              {/* Logo / header */}
              <div className="flex items-center gap-4 border-b border-border p-5">
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl bg-muted">
                  {(provider as any).restaurantLogo ? (
                    <Image
                      src={(provider as any).restaurantLogo}
                      alt={provider.restaurantName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                      <Store className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-base font-bold text-foreground">
                    {provider.restaurantName}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    ID: {provider.id.slice(0, 8)}…
                  </p>
                </div>
              </div>

              <div className="space-y-3 p-5">
                {provider.address && (
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <span>{provider.address}</span>
                  </div>
                )}
                {provider.phone && (
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                    <span>{provider.phone}</span>
                  </div>
                )}
                {provider.meals && provider.meals.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <UtensilsCrossed className="h-4 w-4 flex-shrink-0 text-primary" />
                    <span>{provider.meals.length} meals listed</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
