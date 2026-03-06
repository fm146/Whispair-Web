import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.scdn.co",
      },
      {
        protocol: "https",
        hostname: "*.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "*.fbcdn.net",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/merch",
        destination: "/shop",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
