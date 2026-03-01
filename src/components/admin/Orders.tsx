"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { getAllOrders } from "@/services/admin";
import { 
  Package, 
  MapPin, 
  User, 
  Store, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  XCircle 
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
        return { color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 };
      case "PENDING":
        return { color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock };
      case "CANCELLED":
        return { color: "bg-rose-100 text-rose-700 border-rose-200", icon: XCircle };
      default:
        return { color: "bg-slate-100 text-slate-700 border-slate-200", icon: Package };
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      <p className="text-slate-500 animate-pulse">Fetching global orders...</p>
    </div>
  );

  if (!orders.length) return (
    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
      <Package className="mx-auto h-12 w-12 text-slate-300 mb-4" />
      <p className="text-xl font-semibold text-slate-600">No orders found.</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Order Management</h1>
          <p className="text-slate-500">Overview of all system transactions</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
          <span className="text-sm text-slate-500 font-medium">Total Volume: </span>
          <span className="text-lg font-bold text-green-600">
            ${orders.reduce((acc, curr) => acc + Number(curr.totalPrice), 0).toLocaleString()}
          </span>
        </div>
      </header>

      <div className="grid gap-6">
        {orders.map((order) => {
          const { color, icon: StatusIcon } = getStatusDetails(order.status);
          
          return (
            <div key={order.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:border-green-300 transition-all duration-300">
              {/* Top Banner: Order ID & Status */}
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <Package className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Order ID</span>
                    <p className="text-sm font-mono font-bold text-slate-700 leading-none mt-1">#{order.id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                   <div className="hidden sm:flex items-center gap-2 text-slate-500 text-xs font-medium">
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
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Restaurant</p>
                      <p className="font-bold text-slate-800">{order.provider.restaurantName}</p>
                      <p className="text-sm text-slate-500">{order.provider.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                      <User className="text-purple-600 h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customer</p>
                      <p className="font-bold text-slate-800">{order.customer.name}</p>
                      <p className="text-sm text-slate-500 font-medium">{order.customer.email}</p>
                    </div>
                  </div>
                </div>

                {/* Right Side: Items Summary */}
                <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                   <p className="text-xs font-bold text-slate-400 uppercase mb-2">Order Items</p>
                   {order.items.map((item) => (
                     <div key={item.id} className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg overflow-hidden border bg-white shrink-0">
                          <Image src={item.meal.imageUrl} alt={item.meal.title} width={40} height={40} className="object-cover h-full w-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-700 truncate">{item.meal.title}</p>
                          <p className="text-xs text-slate-500 font-medium">x{item.quantity} · ${item.price}</p>
                        </div>
                        <p className="text-sm font-bold text-slate-800">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                     </div>
                   ))}
                </div>
              </div>

              {/* Footer: Address & Price */}
              <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin size={16} className="text-rose-500 shrink-0" />
                  <span className="text-sm font-medium">{order.address}</span>
                </div>
                
                <div className="flex items-center gap-4 ml-auto">
                   <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Grand Total</p>
                      <p className="text-2xl font-black text-green-600 leading-none">${order.totalPrice}</p>
                   </div>
                   <button className="bg-slate-900 text-white p-2 rounded-xl hover:bg-green-600 transition-colors">
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