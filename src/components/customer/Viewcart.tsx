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

export default function CartPage() {
  const router = useRouter();

  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      await updateCartItemQuantity(itemId, newQty);

      const updatedItems = cart.items.map((i: any) =>
        i.id === itemId ? { ...i, quantity: newQty } : i
      );

      const updatedTotal = updatedItems.reduce(
        (acc: number, i: any) =>
          acc + i.quantity * Number(i.priceAtAddTime),
        0
      );

      setCart({ ...cart, items: updatedItems, totalPrice: updatedTotal });
    } catch (err: any) {
      toast.error(err.message || "Failed to update quantity");
    }
  };

  const handleRemove = async (itemId: string) => {
    try {
      await removeCartItem(itemId);

      const updatedItems = cart.items.filter((i: any) => i.id !== itemId);

      const updatedTotal = updatedItems.reduce(
        (acc: number, i: any) =>
          acc + i.quantity * Number(i.priceAtAddTime),
        0
      );

      setCart({ ...cart, items: updatedItems, totalPrice: updatedTotal });
      toast.success("Item removed");
    } catch (err: any) {
      toast.error(err.message || "Failed to remove item");
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

      router.push("/dashboard/orders");
    } catch (err: any) {
      toast.error(err.message || "Order failed");
    } finally {
      setOrdering(false);
    }
  };

  if (loading)
    return (
      <p className="p-6 text-center text-gray-500 text-lg">Loading cart...</p>
    );

  if (!cart || cart.items.length === 0)
    return (
      <p className="p-6 text-center text-gray-500 text-lg">
        Your cart is empty
      </p>
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="space-y-6">
        {cart.items.map((item: any) => (
          <div
            key={item.id}
            className="flex flex-col md:flex-row bg-white shadow rounded-xl p-4 gap-4"
          >
            <div className="w-full md:w-48 h-40 relative rounded-lg overflow-hidden border">
              <Image
                src={item.meal.imageUrl}
                alt={item.meal.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  {item.meal.title}
                </h2>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                  {item.meal.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 gap-4">
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1 bg-gray-100 rounded"
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border rounded">
                    {item.quantity}
                  </span>
                  <button
                    className="px-3 py-1 bg-gray-100 rounded"
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>

                <p className="font-semibold text-green-600">
                  ${item.quantity * Number(item.priceAtAddTime)}
                </p>

                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout Bar */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Total: ${cart.totalPrice}
        </h2>

        <Button onClick={() => setShowModal(true)}>
          Proceed to Checkout
        </Button>
      </div>

      {/* Checkout Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="text-xl font-semibold">Enter Delivery Address</h2>

            <textarea
              rows={4}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Full delivery address..."
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>

              <button
                onClick={handleOrder}
                disabled={ordering}
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                {ordering ? "Placing..." : "Confirm Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}