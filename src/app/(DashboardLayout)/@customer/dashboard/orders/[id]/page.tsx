"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { getOrderDetails } from "@/services/order";
import { toast } from "sonner";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await getOrderDetails(params.id as string);
        setOrder(data);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [params.id]);

  if (loading)
    return <p className="p-6 text-center text-gray-500">Loading order...</p>;

  if (!order)
    return <p className="p-6 text-center text-red-500">Order not found</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Order #{order.id.slice(0, 8)}
          </h1>
          <p className="text-gray-500 text-sm">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold w-fit
          ${
            order.status === "DELIVERED"
              ? "bg-green-100 text-green-700"
              : order.status === "PENDING"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {order.status}
        </span>
      </div>

      {/* Provider + Address */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-xl p-5 space-y-2">
          <h2 className="font-semibold text-gray-800">Restaurant</h2>
          <p className="text-lg">{order.provider.restaurantName}</p>
          <p className="text-gray-500">{order.provider.address}</p>
          <p className="text-gray-500">{order.provider.phone}</p>
        </div>

        <div className="bg-white shadow rounded-xl p-5 space-y-2">
          <h2 className="font-semibold text-gray-800">Delivery Address</h2>
          <p className="text-gray-700">{order.address}</p>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white shadow rounded-xl p-5">
        <h2 className="text-xl font-semibold mb-4">Items</h2>

        <div className="space-y-5">
          {order.items.map((item: any) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row gap-4 border-b pb-4 last:border-none"
            >
              <div className="w-full sm:w-28 h-24 relative rounded-lg overflow-hidden">
                <Image
                  src={item.meal.imageUrl}
                  alt={item.meal.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {item.meal.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2">
                    {item.meal.description}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <p className="text-gray-600">
                    Qty: {item.quantity}
                  </p>

                  <p className="font-semibold text-green-600">
                    ৳{Number(item.price) * item.quantity}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="bg-white shadow rounded-xl p-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">Total</h2>
        <h2 className="text-2xl font-bold text-green-600">
          ৳{order.totalPrice}
        </h2>
      </div>

      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="text-sm text-gray-500 hover:underline"
      >
        ← Back to orders
      </button>
    </div>
  );
}