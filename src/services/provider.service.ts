import { serverFetch } from "@/lib/serviceFetch";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export const ProviderServerService = {
  async getProfile() {
    try {
      const data = await serverFetch(`${API_URL}/providers/dashboard`);
      return data;
    } catch (error) {
      console.error("Get profile error:", error);
      return null;
    }
  },

  async getMeals() {
    try {
      const data = await serverFetch(`${API_URL}/provider/meals`);
      return Array.isArray(data?.data) ? data.data : [];
    } catch (error) {
      console.error("Get meals error:", error);
      return [];
    }
  },

  async getOrders() {
    try {
      const data = await serverFetch(`${API_URL}/provider/orders`);
      return Array.isArray(data?.data) ? data.data : [];
    } catch (error: any) {
      if (error.message?.includes("403")) {
        return [];
      }
      console.error("Get orders error:", error);
      return [];
    }
  },

  async getDashboardStats() {
    try {
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
    } catch (error) {
      console.error("Dashboard stats error:", error);
      return {
        totalOrders: 0,
        activeOrders: 0,
        revenue: 0,
      };
    }
  },
};
