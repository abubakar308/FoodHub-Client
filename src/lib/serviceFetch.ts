"use server";
import { cookies } from "next/headers";

export async function serverFetch(
  url: string,
  options: RequestInit = {}
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
      ...options.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Request failed (${res.status}): ${errorText}`);
  }

  const result = await res.json();
  return result?.data ?? result;
}
