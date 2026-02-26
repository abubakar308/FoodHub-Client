"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: "CUSTOMER" | "PROVIDER";
}

interface LoginPayload {
  email: string;
  password: string;
}

interface JwtPayload {
  id: string;
  email: string;
  role: "CUSTOMER" | "PROVIDER" | "ADMIN";
  iat: number;
  exp: number;
}


export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export const registerUser = async (
  userData: RegisterPayload
): Promise<ApiResponse> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      }
    );

    const result: ApiResponse = await res.json();

    if (result.success) {
      // only revalidate public pages
      revalidatePath("/login");
    }

    return result;
  } catch {
    return {
      success: false,
      message: "Registration failed",
    };
  }
};


export const loginUser = async (
  userData: LoginPayload
): Promise<ApiResponse> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      }
    );

    const result: ApiResponse<{ token: string }> = await res.json();

    if (result.success && result.data) {
      const cookieStore = await cookies();

      cookieStore.set("token", result.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      revalidatePath("/");
    }

    return result;
  } catch {
    return {
      success: false,
      message: "Login failed",
    };
  }
};

export const getCurrentUser = async (): Promise<JwtPayload | null> => {
  
 const storeCookie = await cookies();
  const token = storeCookie.get("token")?.value;
  let decodedData = null;
  if (token) {
    decodedData = await jwtDecode(token);
    return decodedData;
  } else {
    return null;
  }
  
};

export const logOut = async () => {
  const storeCookies = await cookies();
  storeCookies.delete("token");
};