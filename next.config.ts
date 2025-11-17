import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // @ts-expect-error appDir is not in NextConfig type yet
    appDir: "./src/app",
  },
};

export default nextConfig;