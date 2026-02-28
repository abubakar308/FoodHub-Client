"use client";

import { getOrders, updateProviderOrderStatus } from "@/services/provider";
import { useEffect, useState } from "react";

type Meal = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
};

type OrderItem = {
  id: string;
  mealId: string;
  quantity: number;
  price: string;
  meal: Meal;
};

type Order = {
  id: string;
  customerId: string;
  providerId: string;
  status: "PLACED" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";
  address: string;
  totalPrice: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  customer: {
    id: string;
    name: string;
    email: string;
  };
};


export default function ProviderOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateProviderOrderStatus(id, status);
      loadOrders();
    } catch (err) {
      alert("Status update failed");
    }
  };

  if (loading) return <p className="p-6">Loading orders...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Provider Orders</h1>

      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white shadow-md rounded-xl p-5 border space-y-4"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between gap-3">
            <div>
              <p className="font-semibold">{order.customer.name}</p>
              <p className="text-sm text-gray-500">{order.customer.email}</p>
              <p className="text-sm">{order.address}</p>
            </div>

            <div className="text-right">
              <p className="font-semibold">
                ৳ {Number(order.totalPrice).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="divide-y">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex gap-3 py-3">
                <img
                  src={item.meal.imageUrl}
                  className="w-16 h-16 rounded object-cover"
                />

                <div className="flex-1">
                  <p className="font-medium">{item.meal.title}</p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity} × ৳{item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="font-medium">
              Status:{" "}
              <span className="text-blue-600">{order.status}</span>
            </span>

            <select
              value={order.status}
              onChange={(e) =>
                handleStatusChange(order.id, e.target.value)
              }
              className="border rounded px-3 py-1"
            >
              <option value="PLACED">PLACED</option>
              <option value="PREPARING">PREPARING</option>
              <option value="READY">READY</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}