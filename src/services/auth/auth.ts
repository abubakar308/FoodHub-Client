/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    token?: string;
    accessToken?: string;
  };
}

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

    if (result.data) {
      const cookieStore = await cookies();

      console.log(cookieStore.get)


      cookieStore.set("token", result.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
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
  const token = (await cookies()).get("token")?.value;

  console.log(token)

  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded;
  } catch (error) {
    console.error("Invalid token");
    return null;
  }
};

export const logOut = async () => {
  const storeCookies = await cookies();
  storeCookies.delete("token");
};