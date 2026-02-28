"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

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