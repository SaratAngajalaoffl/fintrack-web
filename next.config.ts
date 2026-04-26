import type { NextConfig } from "next";

import { appConfig } from "./src/configs";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    const base = appConfig.apiOrigin;

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
