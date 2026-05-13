"use client";

import { getOrders, updateProviderOrderStatus } from "@/services/provider";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ShoppingBag,
  MapPin,
  User,
  Clock,
  CheckCircle2,
  Loader2,
  ChevronRight,
  Utensils,
  Ban
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "../ui/skeleton";


const NEXT_STATUS_MAP: Record<string, string | null> = {
  PLACED: "PREPARING",
  PREPARING: "READY",
  READY: "DELIVERED",
  DELIVERED: null,
  CANCELLED: null,
};

export default function ProviderOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      const data = await getOrders();

      setOrders(data || []);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await updateProviderOrderStatus(id, status);
      toast.success(`Order is now ${status}`);
      loadOrders();
    } catch (err) {
      toast.error("Status update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PLACED": return "bg-blue-100 text-blue-700 border-blue-200";
      case "PREPARING": return "bg-amber-100 text-amber-700 border-amber-200";
      case "READY": return "bg-purple-100 text-purple-700 border-purple-200";
      case "DELIVERED": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "CANCELLED": return "bg-rose-100 text-rose-700 border-rose-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  if (loading)
    return (
      <div className="max-w-6xl mx-auto space-y-8 py-8 px-4">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-border pb-10">
           <div className="space-y-3">
              <Skeleton className="h-12 w-72 rounded-xl" />
              <Skeleton className="h-5 w-56 rounded-lg" />
           </div>
           <Skeleton className="h-12 w-40 rounded-2xl" />
        </header>

        <div className="grid gap-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-[40px] border border-border bg-card overflow-hidden shadow-sm">
               <div className="p-8 md:p-10 flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex gap-6">
                     <Skeleton className="h-20 w-20 rounded-3xl" />
                     <div className="space-y-3">
                        <Skeleton className="h-8 w-64 rounded-md" />
                        <Skeleton className="h-5 w-40 rounded-md" />
                        <Skeleton className="h-10 w-48 rounded-2xl" />
                     </div>
                  </div>
                  <div className="md:text-right space-y-3">
                    <Skeleton className="h-12 w-32 rounded-xl" />
                    <Skeleton className="h-5 w-40 rounded-lg" />
                  </div>
               </div>
               <div className="bg-muted/30 p-8 md:px-10 border-y border-border">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <Skeleton className="h-16 rounded-3xl" />
                     <Skeleton className="h-16 rounded-3xl" />
                     <Skeleton className="h-16 rounded-3xl" />
                  </div>
               </div>
               <div className="p-8 md:px-10 flex flex-col sm:flex-row justify-between items-center gap-6">
                  <Skeleton className="h-12 w-40 rounded-2xl" />
                  <Skeleton className="h-14 w-64 rounded-2xl" />
               </div>
            </div>
          ))}
        </div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-8 px-4">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-border pb-10">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-foreground tracking-tight">Active Orders</h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <ShoppingBag size={18} className="text-primary" /> 
            Manage and track your real-time customer requests
          </p>
        </div>
        <div className="bg-primary shadow-xl shadow-primary/20 text-primary-foreground px-6 py-3 rounded-2xl font-black text-xs tracking-widest uppercase">
          {orders?.length || 0} Total Orders
        </div>
      </header>

      <div className="grid gap-10">
        {orders?.length === 0 ? (
          <div className="text-center py-24 bg-card rounded-[40px] border border-border border-dashed">
            <div className="mx-auto w-24 h-24 rounded-full bg-muted/30 flex items-center justify-center mb-6">
              <Utensils className="text-muted-foreground/40" size={48} />
            </div>
            <h3 className="text-xl font-bold text-foreground">Order Queue Empty</h3>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
              No orders in the queue right now. Go to your menu to see if your items are active.
            </p>
          </div>
        ) : orders?.map((order) => {
          const nextStep = NEXT_STATUS_MAP[order.status];
          const isProcessing = updatingId === order.id;

  
          return (
            <div key={order.id} className="bg-card rounded-[40px] border border-border shadow-sm overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-500 group">
              {/* Header: Customer & Price */}
              <div className="p-8 md:p-10 flex flex-col md:flex-row justify-between gap-8">
                <div className="flex items-start gap-6">
                  <div className="h-20 w-20 rounded-3xl bg-muted/30 flex items-center justify-center border border-border/50 shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <User className="text-muted-foreground/40" size={32} />
                  </div>
                  <div>
                    <h3 className="font-black text-foreground text-2xl tracking-tight leading-tight mb-1">{order.customer.name}</h3>
                    <p className="text-muted-foreground font-medium mb-4">{order.customer.email}</p>
                    <div className="flex items-center gap-2.5 text-foreground/80 bg-muted/40 px-4 py-2 rounded-2xl border border-border/50 w-fit shadow-sm">
                      <MapPin className="text-primary" size={16} />
                      <span className="text-xs font-bold">{order.address}</span>
                    </div>
                  </div>
                </div>

                <div className="md:text-right flex flex-col justify-between items-start md:items-end">
                  <div className="mb-4">
                    <span className="text-[10px] font-black text-muted-foreground tracking-[0.3em] uppercase opacity-60">Estimated Revenue</span>
                    <p className="text-4xl font-black text-primary drop-shadow-sm">৳{Number(order.totalPrice).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2.5 text-muted-foreground text-xs font-bold bg-muted/20 px-4 py-2 rounded-xl border border-border/30">
                    <Clock size={14} className="text-primary/70" />
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    <span className="mx-1 opacity-20">•</span>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Items Summary (Premium Grid) */}
              <div className="bg-muted/10 px-8 md:px-10 py-10 border-y border-border/30">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4 bg-background p-4 rounded-3xl border border-border/60 shadow-sm transition-all hover:bg-muted/10 hover:-translate-y-1">
                      <div className="h-16 w-16 relative rounded-2xl overflow-hidden shrink-0 border border-border/50 shadow-sm">
                        <Image src={item.meal.imageUrl} alt={item.meal.title} fill className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-black text-foreground truncate mb-1">{item.meal.title}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-md">Qty: {item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>


              {/* Action Footer */}
              <div className="p-8 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-8">
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60">Status Tracking</span>
                  <div className={cn("px-5 py-2.5 rounded-2xl text-[10px] font-black tracking-widest uppercase border w-fit shadow-sm", getStatusBadge(order.status))}>
                    {order.status}
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                  {/* Cancel Button - Only show if not delivered/cancelled */}
                  {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
                    <Button
                      variant="ghost"
                      disabled={isProcessing}
                      onClick={() => handleStatusChange(order.id, "CANCELLED")}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-2xl font-black text-xs uppercase tracking-widest transition-all px-6 py-6"
                    >
                      <Ban size={18} className="mr-2" /> Cancel Order
                    </Button>
                  )}

                  {/* Smart Next-Step Button */}
                  {nextStep ? (
                    <Button
                      disabled={isProcessing}
                      onClick={() => handleStatusChange(order.id, nextStep)}
                      className="flex-1 sm:flex-none bg-primary hover:opacity-90 text-primary-foreground font-black text-xs uppercase tracking-widest rounded-2xl px-10 py-6 shadow-xl shadow-primary/20 transition-all flex items-center gap-3 active:scale-95"
                    >
                      {isProcessing ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <>
                          Process to {nextStep} <ChevronRight size={18} />
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="flex items-center gap-3 text-muted-foreground font-black text-xs uppercase tracking-widest bg-muted/40 px-8 py-4 rounded-2xl border border-border/50 shadow-sm">
                      <CheckCircle2 size={20} className="text-primary" />
                      Order Completed
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}