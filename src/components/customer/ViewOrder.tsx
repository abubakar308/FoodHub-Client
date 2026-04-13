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
      case "DELIVERED": return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
      case "PENDING": return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
      case "CANCELLED": return "bg-rose-500/10 text-rose-600 dark:text-rose-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-[400px]"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-black text-foreground tracking-tight">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-muted-foreground p-10 text-lg italic border-2 border-dashed border-border rounded-3xl">No orders found yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-card rounded-[32px] border border-border shadow-sm hover:shadow-md transition-all p-6 space-y-6 overflow-hidden"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4 border-border">
                <div onClick={() => router.push(`/dashboard/orders/${order.id}`)} className="cursor-pointer">
                  <p className="font-black text-xl text-foreground hover:text-primary transition-colors">{order.provider.restaurantName}</p>
                  <p className="text-muted-foreground text-sm font-medium">{order.provider.address}</p>
                </div>

                <div className="flex flex-col md:items-end gap-2">
                  <span className={`px-4 py-1.5 text-xs rounded-full font-black tracking-widest uppercase ${statusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <p className="text-muted-foreground text-xs font-bold">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-4 items-center bg-muted/30 rounded-2xl p-4 group">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden border flex-shrink-0">
                      <Image src={item.meal.imageUrl} alt={item.meal.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>

                    <div className="flex-1 w-full space-y-1">
                      <p className="font-black text-foreground text-lg">{item.meal.title}</p>
                      <p className="text-muted-foreground text-sm font-bold">Quantity: {item.quantity}</p>
                      
                      {/* Review Button - Only for DELIVERED orders */}
                      {order.status === "DELIVERED" && (
                        <button 
                          onClick={() => setSelectedMeal({ id: item.meal.id, title: item.meal.title })}
                          className="mt-2 flex items-center gap-1.5 text-xs font-black text-primary hover:text-primary/90 bg-card px-3 py-1.5 rounded-lg border border-primary/20 shadow-sm transition-all active:scale-95"
                        >
                          <Star size={14} className="fill-primary" /> Rate Food
                        </button>
                      )}
                    </div>

                    <p className="font-black text-primary text-xl tracking-tighter">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-2 gap-4">
                <div className="bg-muted p-4 rounded-xl">
                  <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Delivery Address</p>
                  <p className="font-bold text-foreground text-sm">{order.address}</p>
                </div>

                <div className="text-right">
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Grand Total</p>
                  <p className="text-2xl font-black text-primary tracking-tighter">${Number(order.totalPrice).toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- Review Modal --- */}
      {selectedMeal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-[40px] p-8 max-w-md w-full shadow-2xl space-y-6 relative animate-in fade-in zoom-in duration-300">
            <button onClick={() => setSelectedMeal(null)} className="absolute top-6 right-6 text-muted-foreground hover:text-foreground"><X size={24} /></button>
            
            <div className="text-center space-y-2">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-primary mb-4">
                <MessageSquare size={32} />
              </div>
              <h2 className="text-2xl font-black text-foreground tracking-tight">How was the {selectedMeal.title}?</h2>
              <p className="text-muted-foreground font-medium">Your feedback helps others choose better meals!</p>
            </div>

            {/* Stars */}
            <div className="flex justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)} className="transition-transform active:scale-90">
                  <Star size={40} className={`transition-colors ${rating >= star ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"}`} strokeWidth={rating >= star ? 0 : 2} />
                </button>
              ))}
            </div>

            <textarea
              placeholder="Write a comment (optional)..."
              className="w-full p-4 bg-muted border border-border rounded-3xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium min-h-[120px] resize-none text-foreground"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <Button 
              className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-black shadow-xl shadow-green-100 dark:shadow-none"
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