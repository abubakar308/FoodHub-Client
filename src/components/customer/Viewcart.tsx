"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  createOrder,
  getCart,
  removeCartItem,
  updateCartItemQuantity,
} from "@/services/order";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, ShoppingBag, Loader2, MapPin } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const router = useRouter();
  const { refetch } = useCart();

  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState("");
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const data = await getCart();
        setCart(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load cart");
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, []);

  const handleQuantityChange = async (itemId: string, newQty: number) => {
    if (!cart || newQty < 1) return;

    try {
      setUpdatingId(itemId);
      await updateCartItemQuantity(itemId, newQty);

      const updatedItems = cart.items.map((i: any) =>
        i.id === itemId ? { ...i, quantity: newQty } : i
      );

      const updatedTotal = updatedItems.reduce(
        (acc: number, i: any) => acc + i.quantity * Number(i.priceAtAddTime),
        0
      );

      setCart({ ...cart, items: updatedItems, totalPrice: updatedTotal });
      await refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to update quantity");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (itemId: string) => {
    try {
      toast.promise(removeCartItem(itemId), {
        loading: 'Removing item...',
        success: () => {
          const updatedItems = cart.items.filter((i: any) => i.id !== itemId);
          const updatedTotal = updatedItems.reduce(
            (acc: number, i: any) => acc + i.quantity * Number(i.priceAtAddTime),
            0
          );
          setCart({ ...cart, items: updatedItems, totalPrice: updatedTotal });
          refetch();
          return 'Item removed from cart';
        },
        error: 'Could not remove item',
      });
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleOrder = async () => {
    if (!address.trim()) {
      toast.error("Please enter delivery address");
      return;
    }

    try {
      setOrdering(true);
      await createOrder(address);
      toast.success("Order placed successfully!");
      setShowModal(false);
      setCart(null);
      await refetch();
      router.push("/dashboard/orders");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Order failed");
    } finally {
      setOrdering(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-medium">Loading your cart items...</p>
      </div>
    );

  if (!cart || cart.items.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <div className="bg-muted p-6 rounded-full">
          <ShoppingBag size={48} className="text-muted-foreground/30" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Your cart is empty</h2>
        <p className="text-muted-foreground">Looks like you haven't added anything yet.</p>
        <Button onClick={() => router.push("/")} className="rounded-xl bg-green-600">
          Browse Meals
        </Button>
      </div>
    );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-foreground tracking-tight">Shopping Cart</h1>
        <span className="text-muted-foreground font-medium">{cart.items.length} Items</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item: any) => (
            <div
              key={item.id}
              className="flex items-center bg-card border border-border shadow-sm rounded-3xl p-4 gap-4 transition-hover hover:shadow-md"
            >
              <div className="w-24 h-24 relative rounded-2xl overflow-hidden border flex-shrink-0">
                <Image
                  src={item.meal.imageUrl}
                  alt={item.meal.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-foreground truncate">
                  {item.meal.title}
                </h2>
                <p className="text-primary font-bold">৳{item.priceAtAddTime}</p>
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1 bg-muted p-1 rounded-xl border border-border">
                    <button
                      disabled={updatingId === item.id || item.quantity <= 1}
                      className="p-1.5 hover:bg-card hover:shadow-sm rounded-lg transition-all disabled:opacity-30"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-bold text-sm">
                      {item.quantity}
                    </span>
                    <button
                      disabled={updatingId === item.id}
                      className="p-1.5 hover:bg-card hover:shadow-sm rounded-lg transition-all disabled:opacity-30"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-[32px] p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 border-b border-border pb-6">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>৳{cart.totalPrice}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery Fee</span>
                <span className="text-primary font-medium">Free</span>
              </div>
            </div>
            <div className="flex justify-between items-center py-6">
              <span className="text-lg font-bold text-foreground">Total</span>
              <span className="text-2xl font-black text-primary">৳{cart.totalPrice}</span>
            </div>
            <Button 
              className="w-full h-14 rounded-2xl bg-primary text-primary-foreground hover:bg-green-700 text-lg font-bold shadow-lg shadow-green-100 dark:shadow-none"
              onClick={() => setShowModal(true)}
            >
              Checkout Now
            </Button>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-card w-full max-w-md rounded-[32px] p-8 space-y-6 shadow-2xl scale-in-animation border border-border">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                <MapPin size={24} />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Delivery Info</h2>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest ml-1">Full Address</label>
              <textarea
                rows={4}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border-2 border-border bg-background rounded-2xl p-4 focus:border-primary focus:ring-0 outline-none transition-all resize-none font-medium"
                placeholder="House #, Street name, Area..."
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowModal(false)}
                className="flex-1 h-14 rounded-2xl font-bold"
              >
                Cancel
              </Button>

              <Button
                onClick={handleOrder}
                disabled={ordering}
                className="flex-1 h-14 bg-green-600 hover:bg-green-700 rounded-2xl font-bold shadow-lg shadow-green-100"
              >
                {ordering ? <Loader2 className="animate-spin" /> : "Confirm Order"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}