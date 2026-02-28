"use server"
import { cookies } from "next/headers";


const API_URL = process.env.NEXT_PUBLIC_API_URL!;
// Get all categories
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

// Add new category
export async function addCategory(name: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw new Error("Unauthorized");

    const res = await fetch(`${API_URL}/admin/categories`, {
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

// Update category name
export async function updateCategory(id: string, name: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw new Error("Unauthorized");

    const res = await fetch(`${API_URL}/admin/categories/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to update category");
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Update category error:", error);
    throw error;
  }
}

// Delete category
export async function deleteCategory(id: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw new Error("Unauthorized");

    const res = await fetch(`${API_URL}/admin/categories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to delete category");
    return true;
  } catch (error) {
    console.error("Delete category error:", error);
    throw error;
  }
}