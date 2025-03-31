import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "https://manticore-vector-search-3.mkwong.dart.ccel.org/:path*",
      },
    ];
  },
};

export default nextConfig;
