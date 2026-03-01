"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { createReview, getOwnOrders } from "@/services/order";
import { useRouter } from "next/navigation";
import { Star, MessageSquare, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// --- Types ---
type Meal = { id: string; title: string; imageUrl: string };
type OrderItem = { id: string; quantity: number; price: string; meal: Meal };
type Provider = { restaurantName: string; address: string; phone: string };
type Order = { id: string; status: string; totalPrice: string; createdAt: string; address: string; items: OrderItem[]; provider: Provider };

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState<{ id: string; title: string } | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getOwnOrders();
        setOrders(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  // --- Review Submission ---
 const handleReviewSubmit = async () => {
    if (rating === 0) return toast.error("Please select a star rating");
    
    setSubmitting(true);
    try {
      const res = await createReview({
        mealId: selectedMeal?.id as string,
        rating: rating,
        comment: comment,
      });

      if (res?.success) {
        toast.success("Review submitted successfully!");
        
      
        setSelectedMeal(null);
        setRating(0);
        setComment("");
        
      
        router.refresh(); 
      } else {
        toast.error(res?.message || "Failed to submit review");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong while submitting review");
    } finally {
      setSubmitting(false);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "DELIVERED": return "bg-green-100 text-green-800";
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-[400px]"><Loader2 className="animate-spin text-green-600" size={40} /></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 p-10 text-lg italic border-2 border-dashed rounded-3xl">No orders found yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all p-6 space-y-6 overflow-hidden"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4 border-slate-50">
                <div onClick={() => router.push(`/dashboard/orders/${order.id}`)} className="cursor-pointer">
                  <p className="font-black text-xl text-slate-800 hover:text-green-600 transition-colors">{order.provider.restaurantName}</p>
                  <p className="text-slate-500 text-sm font-medium">{order.provider.address}</p>
                </div>

                <div className="flex flex-col md:items-end gap-2">
                  <span className={`px-4 py-1.5 text-xs rounded-full font-black tracking-widest uppercase ${statusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <p className="text-slate-400 text-xs font-bold">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-4 items-center bg-slate-50/50 rounded-2xl p-4 group">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden border flex-shrink-0">
                      <Image src={item.meal.imageUrl} alt={item.meal.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>

                    <div className="flex-1 w-full space-y-1">
                      <p className="font-black text-slate-800 text-lg">{item.meal.title}</p>
                      <p className="text-slate-500 text-sm font-bold">Quantity: {item.quantity}</p>
                      
                      {/* Review Button - Only for DELIVERED orders */}
                      {order.status === "DELIVERED" && (
                        <button 
                          onClick={() => setSelectedMeal({ id: item.meal.id, title: item.meal.title })}
                          className="mt-2 flex items-center gap-1.5 text-xs font-black text-green-600 hover:text-green-700 bg-white px-3 py-1.5 rounded-lg border border-green-100 shadow-sm transition-all active:scale-95"
                        >
                          <Star size={14} className="fill-green-600" /> Rate Food
                        </button>
                      )}
                    </div>

                    <p className="font-black text-green-600 text-xl tracking-tighter">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-2 gap-4">
                <div className="bg-slate-50 px-4 py-2 rounded-xl">
                  <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Delivery Address</p>
                  <p className="font-bold text-slate-700 text-sm">{order.address}</p>
                </div>

                <div className="text-right">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Grand Total</p>
                  <p className="text-2xl font-black text-green-600 tracking-tighter">${Number(order.totalPrice).toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- Review Modal --- */}
      {selectedMeal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] p-8 max-w-md w-full shadow-2xl space-y-6 relative animate-in fade-in zoom-in duration-300">
            <button onClick={() => setSelectedMeal(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"><X size={24} /></button>
            
            <div className="text-center space-y-2">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-green-600 mb-4">
                <MessageSquare size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">How was the {selectedMeal.title}?</h2>
              <p className="text-slate-500 font-medium">Your feedback helps others choose better meals!</p>
            </div>

            {/* Stars */}
            <div className="flex justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)} className="transition-transform active:scale-90">
                  <Star size={40} className={`transition-colors ${rating >= star ? "fill-yellow-400 text-yellow-400" : "text-slate-200"}`} strokeWidth={rating >= star ? 0 : 2} />
                </button>
              ))}
            </div>

            <textarea
              placeholder="Write a comment (optional)..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all font-medium min-h-[120px] resize-none"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <Button 
              className="w-full h-16 rounded-2xl bg-green-600 hover:bg-green-700 text-lg font-black shadow-xl shadow-green-100"
              onClick={handleReviewSubmit}
              disabled={submitting}
            >
              {submitting ? <Loader2 className="animate-spin mr-2" /> : "Submit Review"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}