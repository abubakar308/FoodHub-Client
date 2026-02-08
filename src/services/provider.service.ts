
const API_URL = process.env.NEXT_PUBLIC_API_URL!;

interface ProfileData {
    restaurantName: string;
    address: string;
}

export const ProviderServerService = {
    // Get provider profile
    async getProfile() {
        try {
            console.log("[ProviderServerService] Fetching profile");
            const response = await serverFetch(`${API_URL}/provider/dashboard`);
            console.log("[ProviderServerService] Profile received:", response);

            return response.data || response;
        } catch (error: any) {
            console.error("[ProviderServerService] Get profile error:", error.message);
            // Return null if profile not found or user is not a provider yet (403/404)
            return null;
        }
    },
    
    // Get provider meals
    async getMeals() {
        try {
            console.log("[ProviderServerService] Fetching meals");
            // Assuming this endpoint exists based on usual REST patterns for sub-resources
            const response = await serverFetch(`${API_URL}/api/provider/meals`);
            console.log("[ProviderServerService] Meals received:", response);

            const data = response.data || response;
            return Array.isArray(data) ? data : [];
        } catch (error: any) {
             console.error("[ProviderServerService] Get meals error 👉", error);
             return [];
        }
    },

    // Get provider orders
    async getOrders() {
        try {
            console.log("[ProviderServerService] Fetching orders");
            const response = await serverFetch(`${API_URL}/api/provider/orders`);
            console.log("[ProviderServerService] Orders received:", response);

            // Backend returns { success: true, data: [...] }
            const data = response.data || response;
            return Array.isArray(data) ? data : [];
        } catch (error: any) {
            // Check if error message contains 403 or "No provider profile" to suppress noise
            if (error.message && (error.message.includes("403") || error.message.includes("No provider profile"))) {
                console.log("[ProviderServerService] No provider profile found (returning empty orders)");
            } else {
                console.error("[ProviderServerService] Get orders error 👉", error);
            }
            return [];
        }
    },

    // Get dashboard stats
    async getDashboardStats() {
        try {
            console.log("[ProviderServerService] Calculating dashboard stats");
            const orders = await this.getOrders();

            const totalOrders = orders.length;
            const activeOrders = orders.filter(
                (order: any) => order.status !== "DELIVERED" && order.status !== "CANCELLED"
            ).length;
            const revenue = orders
                .filter((order: any) => order.status === "DELIVERED")
                .reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);

            const stats = {
                totalOrders,
                activeOrders,
                revenue,
            };

            console.log("[ProviderServerService] Dashboard stats:", stats);
            return stats;
        } catch (error) {
            console.error("[ProviderServerService] Get dashboard stats error 👉", error);
            return {
                totalOrders: 0,
                activeOrders: 0,
                revenue: 0,
            };
        }
    },
};