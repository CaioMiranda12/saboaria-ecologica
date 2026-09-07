import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminToken } from "@/lib/jwt";
import { AUTH_COOKIE_NAME } from "@/constants/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await verifyAdminToken(token);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};