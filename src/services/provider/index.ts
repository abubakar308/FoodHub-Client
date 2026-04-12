"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export const createProvider = async (formData: FormData) => {

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/provider/profile`, {
      method: "POST",
      credentials: "include",   // 🔥 THIS sends cookies automatically
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData,
    });

    console.log(await res.json());


    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Create provider error:", error);
    return null;
  }
};

export const updateProvider = async (formData: FormData) => {

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/provider/profile`, {
      method: "PUT",
      credentials: "include",   // 🔥 THIS sends cookies automatically
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData,
    });


    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Update provider error:", error);
    return null;
  }
};

export const getProfile = async () => {

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const res = await fetch(`${API_URL}/provider/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Get profile error:", error);
    return null;
  }
}


export interface Meal {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  providerId: string;
  categoryId: string;
}

export interface Provider {
  id: string;
  userId: string;
  restaurantName: string;
  address: string;
  phone?: string;
  meals?: Meal[]; // ✅ Add meals array
}

export interface ProviderResponse<T = Provider | Provider[]> {
  success: boolean;
  data: T;
}

export async function getProviders(): Promise<ProviderResponse> {
  try {
    const res = await fetch(`${API_URL}/providers`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return { success: false, data: [] };
    }
    const data: ProviderResponse = await res.json();
    return data;
  } catch {
    return { success: false, data: [] };
  }
}

// ✅ Fetch single provider by ID
export async function getProvider(id: string): Promise<ProviderResponse<Provider>> {
  try {
    const res = await fetch(`${API_URL}/provider/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return { success: false, data: null as any };
    }

    const data: ProviderResponse<Provider> = await res.json();
    return data;
  } catch {
    return { success: false, data: null as any };
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
