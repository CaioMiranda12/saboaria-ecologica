import type { NextConfig } from "next";

const privateHeaders = [{ key: "Cache-Control", value: "private, no-store" }];
const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      { source: "/api/admin/:path*", headers: privateHeaders },
      { source: "/api/auth/:path*", headers: privateHeaders },
      {
        source: "/redefinir-senha",
        headers: [{ key: "Referrer-Policy", value: "no-referrer" }, ...privateHeaders],
      },
    ];
  },
};

export default nextConfig;
