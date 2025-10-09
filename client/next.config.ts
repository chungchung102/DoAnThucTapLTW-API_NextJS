import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // cho phép bất kỳ domain nào
      },
      {
        protocol: "http",
        hostname: "**",
        port: "8000",
        pathname: "/storage/uploads/**",
      },
    ],
  },
};

export default nextConfig;
