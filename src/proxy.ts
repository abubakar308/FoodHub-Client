import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

const ALLOWED_ROLE = ["ADMIN", "PROVIDER", "CUSTOMER"];
const PUBLIC_ROUTE = ["/login", "/register"];

type DecodedUser = {
  role?: string;
};

export function proxy(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  if (PUBLIC_ROUTE.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL(`/login?redirect=${pathname}`, origin));
  }

  try {
    const user = jwtDecode<DecodedUser>(token);

    if (!user?.role || !ALLOWED_ROLE.includes(user.role)) {
      return NextResponse.redirect(new URL(`/login?redirect=${pathname}`, origin));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL(`/login?redirect=${pathname}`, origin));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};