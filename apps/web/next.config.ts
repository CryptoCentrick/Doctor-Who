import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@doctor-who/shared"],
  experimental: {
    typedRoutes: true
  }
};

export default nextConfig;
