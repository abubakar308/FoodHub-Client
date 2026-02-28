"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export const createProvider = async (formData: Record<string, unknown>) => {
  try {
    const res = await fetch(`${API_URL}/provider/profile`, {
      method: "POST",
      credentials: "include",   // 🔥 THIS sends cookies automatically
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });


    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Create provider error:", error);
    return null;
  }
};

export async function getProfile() {
  
  try {
   const cookieStore = await cookies();   
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const res = await fetch(`${API_URL}/providers/dashboard`, {
      headers: { Authorization: token },
      cache: "no-store",
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Get profile error:", error);
    return null;
  }
}

export async function getMeals() {
  try {
  const cookieStore = await cookies();  
    const token = cookieStore.get("token")?.value;
    if (!token) return [];

    const res = await fetch(`${API_URL}/provider/meals`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) return [];

    const data = await res.json();
    return Array.isArray(data?.data) ? data.data : [];
  } catch (error) {
    console.error("Get meals error:", error);
    return [];
  }
}

export async function getOrders() {
  try {
   const cookieStore = await cookies();  
    const token = cookieStore.get("token")?.value;
    if (!token) return [];

    const res = await fetch(`${API_URL}/providers/orders`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) return [];

    const data = await res.json();
    return Array.isArray(data?.data) ? data.data : [];
  } catch (error) {
    console.error("Get orders error:", error);
    return [];
  }
};


export const updateProviderOrderStatus = async (
  orderId: string,
  status: string
) => {

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;


  const res = await fetch(`${API_URL}/provider/order/${orderId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
       Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to update order status");
  }

  return res.json();
};

export async function getDashboardStats() {

  const orders = await getOrders();

  return {
    totalOrders: orders.length,
    activeOrders: orders.filter(
      (o: any) => o.status !== "DELIVERED" && o.status !== "CANCELLED"
    ).length,
    revenue: orders
      .filter((o: any) => o.status === "DELIVERED")
      .reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0),
  };
}
