"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ProfileData {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  phone?: string | null;
  address?: string | null;
  bio?: string | null;
  role?: string;
  status?: string;
  authProvider?: string;
  providerId?: string | null;
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  providerProfile?: {
    id: string;
    restaurantName: string;
    restaurantLogo?: string | null;
    bannerImage?: string | null;
    address: string;
    phone: string;
    description?: string | null;
    cuisineType?: string | null;
    openingTime?: string | null;
    closingTime?: string | null;
    deliveryArea?: string | null;
    isApproved?: boolean;
  } | null;
}

export interface ProfileResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export const getUser = async (): Promise<ProfileResponse<ProfileData>> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${API_URL}/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch profile",
    };
  }
};

export const updateUserProfile = async (
  formData: FormData
): Promise<ProfileResponse<ProfileData>> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${API_URL}/users/me`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update profile",
    };
  }
};