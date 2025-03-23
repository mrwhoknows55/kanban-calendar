import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fastly.picsum.photos",
      },
      {
        protocol: "http",
        hostname: "fastly.picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
};

export default nextConfig;
