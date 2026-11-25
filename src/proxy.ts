import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminToken } from "@/lib/jwt";
import { AUTH_COOKIE_NAME } from "@/constants/auth";
import { isAllowedApiRequest } from "@/lib/request-security";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const isApiRequest = request.nextUrl.pathname.startsWith("/api/");

  if (isApiRequest && !isAllowedApiRequest(request, process.env.APP_URL)) {
    return NextResponse.json({ message: "Origem da requisição não permitida" }, { status: 403 });
  }

  if (request.nextUrl.pathname.startsWith("/api/auth/")) return NextResponse.next();

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
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/auth/:path*"],
};
