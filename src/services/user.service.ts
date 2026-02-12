import { cookies } from "next/headers";

interface ProfileResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export const userService = {
  getUser: async function () {
    try {
      const token = (await cookies()).get("token")?.value;

      // If no token → no user
      if (!token) {
        return { success: false, data: null };
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      if (!res.ok) {
        return { success: false, data: null };
      }

      const profile: ProfileResponse = await res.json();

      return profile;
    } catch {
      return {
        success: false,
        data: null,
        message: "Failed to fetch user",
      };
    }
  },
};
