"use server"
import { cookies } from "next/headers";


const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function getCategories() {
  try {

    const res = await fetch(`${API_URL}/categories`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch categories");
    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error("Get categories error:", error);
    return [];
  }
}



export async function addCategory(name: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw new Error("Unauthorized");

    const res = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to add category");
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Add category error:", error);
    throw error;
  }
}

