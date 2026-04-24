import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@doctor-who/shared"],
  serverExternalPackages: ["pdfkit"]
};

export default nextConfig;
