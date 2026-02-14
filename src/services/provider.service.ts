"use server"

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export const ProviderServerService = {
  async getProfile() {
    try {
      const token = (await cookies()).get("token")?.value;

      if (!token) return null;

      const res = await fetch(`${API_URL}/providers/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!res.ok) return null;

      return await res.json();
    } catch (error) {
      console.error("Get profile error:", error);
      return null;
    }
  },

  async getMeals() {
    try {
      const token = cookies().get("token")?.value;
      if (!token) return [];

      const res = await fetch(`${API_URL}/provider/meals`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!res.ok) return [];

      const data = await res.json();
      return Array.isArray(data?.data) ? data.data : [];
    } catch (error) {
      console.error("Get meals error:", error);
      return [];
    }
  },

  async getOrders() {
    try {
      const token = cookies().get("token")?.value;
      if (!token) return [];

      const res = await fetch(`${API_URL}/provider/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!res.ok) return [];

      const data = await res.json();
      return Array.isArray(data?.data) ? data.data : [];
    } catch (error: any) {
      console.error("Get orders error:", error);
      return [];
    }
  },

  async getDashboardStats() {
    const orders = await this.getOrders();

    return {
      totalOrders: orders.length,
      activeOrders: orders.filter(
        (o: any) => o.status !== "DELIVERED" && o.status !== "CANCELLED"
      ).length,
      revenue: orders
        .filter((o: any) => o.status === "DELIVERED")
        .reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0),
    };
  },
};
