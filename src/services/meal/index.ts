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

  const res = await fetch(`${API_URL}/meals`, {
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
}) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("Unauthorized");

  const res = await fetch(`${API_URL}/meals/${mealId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(meal),
  });

  if (!res.ok) {
    const errorText = await res.json();
    console.error("Update meal backend response:", errorText);
    throw new Error("Failed to update meal");
  }

  return await res.json();
};

export const deleteMeal = async (id: string) => {

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("Unauthorized");

  try {
    const res = await fetch(`${API_URL}/meals/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    return data;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

type GetAllMealsParams = {
  searchTerm?: string;
  categoryId?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  sortBy?: "createdAt" | "price" | "title" | "averageRating";
  sortOrder?: "asc" | "desc";
  page?: string | number;
  limit?: string | number;
  isAvailable?: string | boolean;
  isFeatured?: string | boolean;
  providerId?: string;

  // backward compatibility
  search?: string;
  category?: string;
  sort?: string;
};

export const getAllMeals = async (params?: GetAllMealsParams) => {
  try {
    const query = new URLSearchParams();

    const finalSearchTerm = params?.searchTerm || params?.search;
    const finalCategoryId = params?.categoryId || params?.category;

    if (finalSearchTerm) query.set("searchTerm", String(finalSearchTerm));
    if (finalCategoryId) query.set("categoryId", String(finalCategoryId));
    if (params?.minPrice !== undefined) {
      query.set("minPrice", String(params.minPrice));
    }
    if (params?.maxPrice !== undefined) {
      query.set("maxPrice", String(params.maxPrice));
    }
    if (params?.page !== undefined) {
      query.set("page", String(params.page));
    }
    if (params?.limit !== undefined) {
      query.set("limit", String(params.limit));
    }
    if (params?.isAvailable !== undefined) {
      query.set("isAvailable", String(params.isAvailable));
    }
    if (params?.isFeatured !== undefined) {
      query.set("isFeatured", String(params.isFeatured));
    }
    if (params?.providerId) {
      query.set("providerId", String(params.providerId));
    }

    if (params?.sortBy) {
      query.set("sortBy", String(params.sortBy));
      query.set("sortOrder", String(params.sortOrder || "desc"));
    } else if (params?.sort) {
      if (params.sort === "price_asc") {
        query.set("sortBy", "price");
        query.set("sortOrder", "asc");
      } else if (params.sort === "price_desc") {
        query.set("sortBy", "price");
        query.set("sortOrder", "desc");
      } else if (params.sort === "newest") {
        query.set("sortBy", "createdAt");
        query.set("sortOrder", "desc");
      } else if (params.sort === "rating_desc") {
        query.set("sortBy", "averageRating");
        query.set("sortOrder", "desc");
      }
    }

    const url = `${API_URL}/meals${query.toString() ? `?${query.toString()}` : ""}`;

    const res = await fetch(url, {
      cache: "no-store",
    });

    const data = await res.json();

    return { data, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: { message: error.message || "Something went wrong" },
    };
  }
};

export const getMealsByProvider = async (id: string) => {
  try {
    const res = await fetch(`${API_URL}/meals/provider/${id}`);
    if (!res.ok) throw new Error("Failed to fetch meals for this provider");

    const data = await res.json();
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message || "Something went wrong" } };
  }
};


export const getMealById = async (id: string) => {
  try {

    const res = await fetch(`${API_URL}/meals/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Meal not found");

    const data = await res.json();
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message || "Something went wrong" } };
  }
};
