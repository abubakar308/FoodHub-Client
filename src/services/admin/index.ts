"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export type TDashboardOverview = {
  totalUsers: number;
  totalProviders: number;
  totalMeals: number;
  totalOrders: number;
  activeUsers: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
};

export type TRecentOrder = {
  id: string;
  customerId: string;
  providerId: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  address: string;
  phone: string;
  notes: string;
  totalPrice: string;
  createdAt: string;
  updatedAt: string;
  customer?: {
    name?: string;
    email?: string;
  };
  provider?: {
    restaurantName?: string;
  };
};

export type TAdminDashboardStatsResponse = {
  success: boolean;
  message: string;
  data: {
    overview: TDashboardOverview;
    recentOrders: TRecentOrder[];
  };
};

export const getAdminDashboardStats = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    const res = await fetch(`${API_URL}/admin/dashboard-stats`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      credentials: "include",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result?.message || "Failed to fetch dashboard stats");
    }

    return result;
  } catch (error) {
    console.error("getAdminDashboardStats error:", error);
    return null;
  }
};

// Get all users
export async function getUsers() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw new Error("Unauthorized");

    const res = await fetch(`${API_URL}/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch users");
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Get users error:", error);
    return [];
  }
}

// Update user status (ACTIVE / SUSPENDED)
export async function updateUserStatus(userId: string, status: "ACTIVE" | "SUSPENDED") {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw new Error("Unauthorized");

    const res = await fetch(`${API_URL}/admin/user/${userId}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to update user status");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Update user status error:", error);
    throw error;
  }
}


// Get all orders (Admin view)
export async function getAllOrders() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw new Error("Unauthorized");

    const res = await fetch(`${API_URL}/admin/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch orders");
    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error("Get all orders error:", error);
    return [];
  }
}

