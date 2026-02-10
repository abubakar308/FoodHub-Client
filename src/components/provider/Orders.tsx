"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL 

type Meal = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
};

type OrderItem = {
  id: string;
  mealId: string;
  quantity: number;
  price: number;
  meal: Meal;
};

type Customer = {
  id: string;
  name: string;
  email: string;
  image?: string;
};

type Order = {
  id: string;
  customerId: string;
  providerId: string;
  status: "PLACED" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";
  address: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  customer: Customer;
};

const ProviderOrder = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Fetch provider orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/providers/orders`, {
        credentials: "include",
      });

      console.log("res:", res)
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status
  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`${API_URL}/provider/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update status");

      setToastMsg("Order status updated!");
      setTimeout(() => setToastMsg(""), 2000);

      // Refresh orders
      fetchOrders();
    } catch (error: any) {
      console.error(error);
      setToastMsg(error.message || "Error updating status");
      setTimeout(() => setToastMsg(""), 3000);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Provider Orders</h1>

      {toastMsg && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-md">
          {toastMsg}
        </div>
      )}

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-blue-200 p-4 rounded-lg border-4 border-gray-300 shadow-lg"
            >
              {/* Customer Info */}
              {/* Customer Info - Modern Design */}
              <div className="bg-gradient-to-br from-blue-200 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 mb-6  border-2 border-gray-400 dark:border-gray-700 backdrop-blur-sm">
                <div className="flex items-start gap-5">
                  {/* Avatar with subtle glow */}
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-500/30 dark:to-purple-500/30 rounded-full blur-sm"></div>
                    <img
                      src={
                        order.customer.image ||
                        "/images/restaurant-placeholder.jpg"
                      }
                      alt={order.customer.name}
                      className="relative w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-md"
                    />
                  </div>

                  {/* Customer Details */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                          {order.customer.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                          <p className="text-gray-600 dark:text-gray-300 font-medium">
                            {order.customer.email}
                          </p>
                        </div>
                      </div>

                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-500/20 dark:to-blue-600/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
                        <svg
                          className="w-4 h-4 mr-1.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Order #{order.id}
                      </span>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
                            <svg
                              className="w-5 h-5 text-gray-500 dark:text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                              Delivery Address
                            </p>
                            <p className="text-gray-800 dark:text-gray-200 font-medium">
                              {order.address}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
                            <svg
                              className="w-5 h-5 text-gray-500 dark:text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                              Order Date & Time
                            </p>
                            <p className="text-gray-800 dark:text-gray-200 font-medium">
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(order.createdAt).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status Indicator */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          Order Status:
                          <span className="ml-2 text-green-600 dark:text-green-400 font-semibold">
                            {order.status || "Processing"}
                          </span>
                        </span>
                      </div>

                      <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        Contact Customer
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-4">
                {order.orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 border-b py-2"
                  >
                    <img
                      src={item.meal.image}
                      alt={item.meal.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.meal.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.meal.description}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity} | Price: ${item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Status Update */}
              <div className="flex items-center gap-4">
                <label className="font-medium text-xl">Status:</label>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className={`border-2 rounded px-3 py-1 font-semibold 
      ${order.status === "PLACED" ? "border-blue-500 text-blue-600" : ""}
      ${order.status === "PREPARING" ? "border-yellow-500 text-yellow-600" : ""}
      ${order.status === "READY" ? "border-green-500 text-green-600" : ""}
      ${order.status === "DELIVERED" ? "border-purple-500 text-purple-600" : ""}
      ${order.status === "CANCELLED" ? "border-red-500 text-red-600" : ""}
    `}
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
      )}
    </div>
  );
};

export default ProviderOrder;