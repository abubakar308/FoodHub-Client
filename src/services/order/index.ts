"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export const addToCart = async (mealId: string) => {

    const cookieStore = await cookies();  
    const token = cookieStore.get("token")?.value;

  const res = await fetch(
    `${API_URL}/addtocart`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", 
         Authorization: `Bearer ${token}`},
      body: JSON.stringify({ mealId }),
    }
  );

  return res.json();
};


/* ---------------- GET CART ---------------- */
export async function getCart() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return { items: [], totalPrice: 0 };

    const res = await fetch(`${API_URL}/mycart`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });


    if (!res.ok) return { items: [], totalPrice: 0 };

    const data = await res.json();

    return data.data || { items: [], totalPrice: 0 };
  } catch (error) {
    console.error("Get cart error:", error);
    return { items: [], totalPrice: 0 };
  }
}


/* ---------------- UPDATE QUANTITY ---------------- */
export async function updateCartItemQuantity(itemId: string, quantity: number) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw new Error("Unauthorized");

    const res = await fetch(`${API_URL}/cart/${itemId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity }),
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to update quantity");
    return await res.json();
  } catch (error) {
    console.error("Update quantity error:", error);
    throw error;
  }
}

/* ---------------- REMOVE ITEM ---------------- */
export async function removeCartItem(itemId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw new Error("Unauthorized");

    const res = await fetch(`${API_URL}/cart/${itemId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to remove item");
    return await res.json();
  } catch (error) {
    console.error("Remove item error:", error);
    throw error;
  }
}

export async function createOrder(address: string) {
      const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;


  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json",
         Authorization: `Bearer ${token}`,
     },
    body: JSON.stringify({ address }),
  });

  const data = await res.json();   // 👈 আগে parse করো

  if (!res.ok) {
    console.log("ORDER ERROR RESPONSE:", data);  // 👈 debug log
    throw new Error(data?.message || "Order failed");
  }

  return data;
}

export async function getOwnOrders() {
  try {
   const cookieStore = await cookies();  
    const token = cookieStore.get("token")?.value;
    if (!token) return [];

    const res = await fetch(`${API_URL}/orders`, {
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

export async function getOrderDetails(id: string) {
      const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

  const res = await fetch(`${API_URL}/order/${id}`, {
    headers: {  Authorization: `Bearer ${token}`,},
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch order");
  const data = await res.json();
  return data.data;
}