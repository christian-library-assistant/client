import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://manticore-vector-search-3.mkwong.dart.ccel.org/:path*",
      },
      {
        source: "/jeton/:path*",
        // destination: "http://153.106.237.25:8000/:path*",
        destination: "http://localhost:8000/:path*",
      },
    ];
  },
};

export default nextConfig;
