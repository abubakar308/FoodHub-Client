import { cookies } from "next/headers";
import { JwtPayload } from "jwt-decode";


interface NavbarProps {
  user: JwtPayload | null;
}

export const userService = {
    getUser: async function () {
    try {
     const token = (await cookies()).get("token")?.value;

const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  }
);

const profile = await res.json();
console.log("profile", profile)

return profile;

    } catch (error) {}
    return { data: null, error: { message: "Something wrong " } };
  }
}

