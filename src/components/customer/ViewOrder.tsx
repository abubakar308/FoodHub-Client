"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { getOwnOrders } from "@/services/order";
import { useRouter } from "next/navigation";

type Meal = {
  id: string;
  title: string;
  imageUrl: string;
};

type OrderItem = {
  id: string;
  quantity: number;
  price: string;
  meal: Meal;
};

type Provider = {
  restaurantName: string;
  address: string;
  phone: string;
};

type Order = {
  id: string;
  status: string;
  totalPrice: string;
  createdAt: string;
  address: string;
  items: OrderItem[];
  provider: Provider;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
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

  const statusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading)
    return (
      <p className="text-center text-gray-500 p-10 text-lg">
        Loading your orders...
      </p>
    );

  if (!orders.length)
    return (
      <p className="text-center text-gray-500 p-10 text-lg">
        You have no orders yet.
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>

      {orders.map((order) => (
        <div
          key={order.id}
          onClick={() => router.push(`/dashboard/orders/${order.id}`)}
          className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 space-y-6 hover:scale-[1.01]"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="font-semibold text-lg">
                {order.provider.restaurantName}
              </p>
              <p className="text-gray-500 text-sm">{order.provider.address}</p>
            </div>

            <div className="flex flex-col md:items-end gap-1">
              <span
                className={`px-3 py-1 text-sm rounded-full font-medium w-fit ${statusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
              <p className="text-gray-500 text-sm">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row gap-4 items-center border rounded-xl p-3 hover:bg-gray-50 transition"
              >
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border flex-shrink-0">
                  <Image
                    src={item.meal.imageUrl}
                    alt={item.meal.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between w-full">
                  <p className="font-medium text-gray-900">{item.meal.title}</p>
                  <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                </div>

                <p className="font-semibold text-green-600 text-lg">
                  ${Number(item.price) * item.quantity}
                </p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-t pt-4 gap-3">
            <div>
              <p className="text-sm text-gray-500">Delivery Address</p>
              <p className="font-medium">{order.address}</p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-xl font-bold text-green-600">
                ${order.totalPrice}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}