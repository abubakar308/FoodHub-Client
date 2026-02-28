"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// export const createMeal = async (formData: FormData) => {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("token")?.value;

//   try {
//     const res = await fetch(`${API_URL}/provider/meals`, {
//       method: "POST",
//       credentials: "include",  // sends cookies automatically
//       headers: {
//         Authorization: `Bearer ${token}`,  // ✅ only Authorization header
//       },
//       body: formData,  // FormData with text URL
//     });
//     if (!res.ok) throw new Error("Failed to create meal");
//     return await res.json();
//   } catch (error) {
//     console.error("Create meal error:", error);
//     return null;
//   }
// };

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

export const getCategories = async () => {
  const res = await fetch(`${API_URL}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};