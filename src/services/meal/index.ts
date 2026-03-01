"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export const createMeal = async (meal: {
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
}) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) throw new Error("Unauthorized");

  const res = await fetch(`${API_URL}/provider/meals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(meal),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Create meal backend response:", errorText);
    throw new Error("Failed to create meal");
  }

  return await res.json();
};


export const updateMeal = async (mealId: string, meal: {
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
}) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("Unauthorized");

  const res = await fetch(`${API_URL}/provider/meals/${mealId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(meal),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Update meal backend response:", errorText);
    throw new Error("Failed to update meal");
  }

  return await res.json();
};

 export const deleteMeal = async(id: string) => {

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("Unauthorized");
 
  try {
    const res = await fetch(`${API_URL}/provider/meals/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    return data;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}


export const getCategories = async () => {
  const res = await fetch(`${API_URL}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};