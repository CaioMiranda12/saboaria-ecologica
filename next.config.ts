import type { NextConfig } from "next";
import { publicIndexOrigin } from "./src/lib/site-url";

const noIndex = { key: "X-Robots-Tag", value: "noindex, nofollow" };
const privateHeaders = [{ key: "Cache-Control", value: "private, no-store" }];
const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...(publicIndexOrigin() ? [] : [noIndex]),
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      { source: "/api/admin/:path*", headers: [...privateHeaders, noIndex] },
      { source: "/api/auth/:path*", headers: [...privateHeaders, noIndex] },
      { source: "/admin/:path*", headers: [noIndex] },
      { source: "/login", headers: [noIndex] },
      { source: "/esqueci-senha", headers: [noIndex] },
      {
        source: "/redefinir-senha",
        headers: [{ key: "Referrer-Policy", value: "no-referrer" }, ...privateHeaders, noIndex],
      },
    ];
  },
};

export default nextConfig;
