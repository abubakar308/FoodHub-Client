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

// স্ট্যাটাস ফ্লো ডিফাইন করা হয়েছে যেন উল্টাপাল্টা আপডেট না হয়
const NEXT_STATUS_MAP: Record<string, string | null> = {
  PLACED: "PREPARING",
  PREPARING: "READY",
  READY: "DELIVERED",
  DELIVERED: null, // শেষ ধাপ
  CANCELLED: null, // বন্ধ
};

export default function ProviderOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
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

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[500px] gap-4 text-center">
      <Loader2 className="animate-spin text-green-600" size={48} />
      <p className="text-slate-500 font-medium animate-pulse">Incoming orders are being fetched...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6 px-4">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Active Orders</h1>
          <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
            <ShoppingBag size={14} /> Handle your real-time customer requests
          </p>
        </div>
        <div className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-xl shadow-slate-200">
          {orders.length} TOTAL ORDERS
        </div>
      </header>

      <div className="grid gap-8">
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[40px] border border-dashed">
            <Utensils className="mx-auto text-slate-200 mb-4" size={60} />
            <p className="text-slate-400 font-medium">No orders in the queue right now.</p>
          </div>
        ) : orders.map((order) => {
          const nextStep = NEXT_STATUS_MAP[order.status];
          const isProcessing = updatingId === order.id;

          return (
            <div key={order.id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:border-green-100 transition-all duration-300">
              {/* Header: Customer & Price */}
              <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center border border-slate-200 shrink-0">
                    <User className="text-slate-400" size={24} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-xl leading-tight">{order.customer.name}</h3>
                    <p className="text-slate-400 text-sm mb-2">{order.customer.email}</p>
                    <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 w-fit">
                      <MapPin className="text-rose-500" size={14} />
                      <span className="text-xs font-bold">{order.address}</span>
                    </div>
                  </div>
                </div>

                <div className="md:text-right flex flex-col justify-between items-start md:items-end">
                  <div className="mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Revenue</span>
                    <p className="text-3xl font-black text-green-600">৳{Number(order.totalPrice).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold">
                    <Clock size={12} />
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    <span className="mx-1">•</span>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Items Summary (Compact Grid) */}
              <div className="bg-slate-50/80 px-6 md:px-8 py-6 border-y border-slate-50">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="h-10 w-10 relative rounded-lg overflow-hidden shrink-0 border border-slate-50">
                        <Image src={item.meal.imageUrl} alt={item.meal.title} fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{item.meal.title}</p>
                        <p className="text-[10px] font-bold text-green-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-6 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex flex-col gap-1.5 w-full sm:w-auto">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Status</span>
                  <div className={cn("px-4 py-2 rounded-xl text-xs font-black border w-fit shadow-sm", getStatusBadge(order.status))}>
                    {order.status}
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Cancel Button - Only show if not delivered/cancelled */}
                  {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
                    <Button
                      variant="ghost"
                      disabled={isProcessing}
                      onClick={() => handleStatusChange(order.id, "CANCELLED")}
                      className="text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-2xl font-bold transition-all px-4"
                    >
                      <Ban size={18} className="mr-2" /> Cancel
                    </Button>
                  )}

                  {/* Smart Next-Step Button */}
                  {nextStep ? (
                    <Button
                      disabled={isProcessing}
                      onClick={() => handleStatusChange(order.id, nextStep)}
                      className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl px-8 py-6 shadow-lg shadow-green-100 transition-all flex items-center gap-2"
                    >
                      {isProcessing ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <>
                          Move to {nextStep} <ChevronRight size={18} />
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-sm bg-slate-100 px-6 py-3 rounded-2xl border border-slate-200">
                      <CheckCircle2 size={18} className="text-green-500" />
                      Process Completed
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