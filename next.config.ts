import type { NextConfig } from "next";

import { API_ORIGIN_LOCAL_DEV_DEFAULT } from "./src/configs/api-local-default";

function resolveGoApiOriginForRewrites(): string {
  const fromEnv = (
    process.env.API_ORIGIN ??
    process.env.NEXT_PUBLIC_API_ORIGIN ??
    ""
  )
    .trim()
    .replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "development") {
    return API_ORIGIN_LOCAL_DEV_DEFAULT;
  }
  return "";
}

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    const base = resolveGoApiOriginForRewrites();
    if (!base) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${base}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/9.x/**",
      },
    ],
  },
};

export default nextConfig;
