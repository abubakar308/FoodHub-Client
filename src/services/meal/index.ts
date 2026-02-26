"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export const createMeal = async (formData: FormData) => {
  try {
    const res = await fetch(`${API_URL}/provider/meals`, {
      method: "POST",
      credentials: "include",   // 🔥 THIS sends cookies automatically
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Create meal error:", error);
    return null;
  }
};


export const getCategories = async () => {
  const res = await fetch(`${API_URL}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};