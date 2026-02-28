"use server"
import { cookies } from "next/headers";

export interface ProfileResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface UserData {
  name: string;
  email: string;
  role?: string;
}

// Generic getUser
export async function getUser<T = UserData>(): Promise<ProfileResponse<T>> {
  try {
    const store = await cookies();
    const token = store.get("token")?.value;

    if (!token) {
      return { success: false, data: null, message: "No token found" } as ProfileResponse<T>;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return { success: false, data: null, message: "Unauthorized" } as ProfileResponse<T>;
    }

    const profile: ProfileResponse<T> = await res.json();
    return profile;
  } catch {
    return { success: false, data: null, message: "Failed to fetch user" } as ProfileResponse<T>;
  }
}