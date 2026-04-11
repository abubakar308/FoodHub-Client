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

interface GoogleLoginPayload {
  token: string;
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
        secure: false,
        sameSite: "lax",
        path: "/",
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

export const googleLoginUser = async (
  payload: GoogleLoginPayload
): Promise<ApiResponse> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/google-login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result: ApiResponse<{ token: string }> = await res.json();

    if (result.success && result.data?.token) {
      const cookieStore = await cookies();

      cookieStore.set("token", result.data.token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
      });

      revalidatePath("/");
    }

    return result;
  } catch {
    return {
      success: false,
      message: "Google login failed",
    };
  }
};

export const getCurrentUser = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

export const logOut = async () => {
  const storeCookies = await cookies();
  storeCookies.delete("token");
};