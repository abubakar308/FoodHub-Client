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
            Providers Management
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {providers.length} providers registered on the platform
          </p>
        </div>
        <button
          onClick={fetchProviders}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {providers.length === 0 ? (
        <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
          <Store className="h-10 w-10 text-slate-400" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            No providers found
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              {/* Logo / header */}
              <div className="flex items-center gap-4 border-b border-slate-100 p-5 dark:border-slate-800">
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
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
                  <h3 className="truncate text-base font-bold text-slate-900 dark:text-white">
                    {provider.restaurantName}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    ID: {provider.id.slice(0, 8)}…
                  </p>
                </div>
              </div>

              <div className="space-y-3 p-5">
                {provider.address && (
                  <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
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
