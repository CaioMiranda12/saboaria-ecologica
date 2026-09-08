import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminToken } from "@/lib/jwt";
import { AUTH_COOKIE_NAME } from "@/constants/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const isApiRequest = request.nextUrl.pathname.startsWith("/api/");

  if (!token) {
    return handleUnauthorized(request, isApiRequest);
  }

  try {
    await verifyAdminToken(token);
    return NextResponse.next();
  } catch {
    return handleUnauthorized(request, isApiRequest);
  }
}

function handleUnauthorized(request: NextRequest, isApiRequest: boolean) {
  if (isApiRequest) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};