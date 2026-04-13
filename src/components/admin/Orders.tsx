"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { getAllOrders } from "@/services/admin";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Package, 
  MapPin, 
  User, 
  Store, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types remain the same as your provided code...
type Meal = { id: string; title: string; imageUrl: string; };
type OrderItem = { id: string; quantity: number; price: string; meal: Meal; };
type Provider = { restaurantName: string; address: string; phone: string; };
type Order = {
  id: string;
  status: string;
  totalPrice: string;
  createdAt: string;
  address: string;
  items: OrderItem[];
  provider: Provider;
  customer: { name: string; email: string; };
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const getStatusDetails = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return { color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20", icon: CheckCircle2 };
      case "PENDING":
        return { color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20", icon: Clock };
      case "CANCELLED":
        return { color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20", icon: XCircle };
      default:
        return { color: "bg-muted text-muted-foreground border-border", icon: Package };
    }
  };

  if (loading)
    return (
      <div className="max-w-6xl mx-auto space-y-8 py-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64 rounded-xl" />
            <Skeleton className="h-5 w-48 rounded-lg" />
          </div>
          <Skeleton className="h-12 w-32 rounded-2xl" />
        </header>

        <div className="grid gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
              <div className="px-6 py-4 bg-muted/40 border-b border-border flex justify-between">
                <div className="flex gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <Skeleton className="h-10 w-32 rounded-md" />
                </div>
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
              <div className="p-6 grid md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <div className="flex gap-4"><Skeleton className="h-10 w-10 rounded-full" /><Skeleton className="h-10 w-48 rounded-md" /></div>
                    <div className="flex gap-4"><Skeleton className="h-10 w-10 rounded-full" /><Skeleton className="h-10 w-48 rounded-md" /></div>
                 </div>
                 <Skeleton className="h-24 w-full rounded-2xl" />
              </div>
              <div className="px-6 py-4 border-t border-border flex justify-between items-center">
                 <Skeleton className="h-6 w-64 rounded-md" />
                 <Skeleton className="h-10 w-32 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  if (!orders.length) return (
    <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
      <Package className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
      <p className="text-xl font-semibold text-muted-foreground">No orders found.</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Order Management</h1>
          <p className="text-muted-foreground">Overview of all system transactions</p>
        </div>
        <div className="bg-card px-4 py-2 rounded-2xl shadow-sm border border-border">
          <span className="text-sm text-muted-foreground font-medium">Total Volume: </span>
          <span className="text-lg font-bold text-primary">
            ${orders.reduce((acc, curr) => acc + Number(curr.totalPrice), 0).toLocaleString()}
          </span>
        </div>
      </header>

      <div className="grid gap-6">
        {orders.map((order) => {
          const { color, icon: StatusIcon } = getStatusDetails(order.status);
          
          return (
            <div key={order.id} className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden hover:border-primary/20 transition-all duration-300">
              {/* Top Banner: Order ID & Status */}
              <div className="px-6 py-4 bg-muted/40 border-b border-border flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-background p-2 rounded-lg shadow-sm border border-border">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Order ID</span>
                    <p className="text-sm font-mono font-bold text-foreground leading-none mt-1">#{order.id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                   <div className="hidden sm:flex items-center gap-2 text-muted-foreground text-xs font-medium">
                      <Calendar size={14} />
                      {new Date(order.createdAt).toLocaleDateString()}
                   </div>
                   <span className={cn("flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border", color)}>
                     <StatusIcon size={14} />
                     {order.status}
                   </span>
                </div>
              </div>

              {/* Main Info Body */}
              <div className="p-6 grid md:grid-cols-2 gap-8">
                {/* Left Side: Parties */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <Store className="text-blue-600 h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Restaurant</p>
                      <p className="font-bold text-foreground">{order.provider.restaurantName}</p>
                      <p className="text-sm text-muted-foreground">{order.provider.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                      <User className="text-purple-600 h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Customer</p>
                      <p className="font-bold text-foreground">{order.customer.name}</p>
                      <p className="text-sm text-muted-foreground font-medium">{order.customer.email}</p>
                    </div>
                  </div>
                </div>

                {/* Right Side: Items Summary */}
                <div className="bg-muted/50 rounded-2xl p-4 space-y-3 border border-border">
                   <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Order Items</p>
                   {order.items.map((item) => (
                     <div key={item.id} className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg overflow-hidden border border-border bg-background shrink-0">
                          <Image src={item.meal.imageUrl} alt={item.meal.title} width={40} height={40} className="object-cover h-full w-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-foreground truncate">{item.meal.title}</p>
                          <p className="text-xs text-muted-foreground font-medium">x{item.quantity} · ${item.price}</p>
                        </div>
                        <p className="text-sm font-bold text-foreground">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                     </div>
                   ))}
                </div>
              </div>

              {/* Footer: Address & Price */}
              <div className="px-6 py-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin size={16} className="text-primary shrink-0" />
                  <span className="text-sm font-medium">{order.address}</span>
                </div>
                
                <div className="flex items-center gap-4 ml-auto">
                   <div className="text-right">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Grand Total</p>
                      <p className="text-2xl font-black text-primary leading-none">${order.totalPrice}</p>
                   </div>
                   <button className="bg-foreground text-background p-2 rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors">
                      <ArrowRight size={20} />
                   </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}