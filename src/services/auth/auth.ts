/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { FieldValues } from "react-hook-form";

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
  role: "CUSTOMER" | "PROVIDER";
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

// export const RegisterUser = async (userData: FieldValues) => {
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/register`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(userData),
//     });
//     revalidatePath("CUSTOMER");
//     const result = await res.json();
//     console.log(result);
//     const storeCookies = await cookies();
//     if (result.success) {
//       storeCookies.set("token", result?.data?.token);
//     }
//     return result;
//   } catch (error: any) {
//     return Error(error);
//   }
// };


export const loginUser = async (userData: FieldValues) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    revalidatePath("USER");
    const result = await res.json();
    console.log(result);
    const storeCookies = await cookies();
    if (result.success) {
      storeCookies.set("token", result?.data?.accessToken);
    }
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

// getCurrentUser
export const getCurrentUser = async (): Promise<any> => {
  const accessToken = (await cookies()).get("token")?.value;
  let decodedData = null;

  if (accessToken) {
    decodedData = await jwtDecode(accessToken);
    return decodedData;
  } else {
    return null;
  }
};

export const logOut = async () => {
  const storeCookies = await cookies();
  storeCookies.delete("token");
};