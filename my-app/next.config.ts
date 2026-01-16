import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Environment variables are automatically loaded from .env.local or .env.production
  productionBrowserSourceMaps: false, // Disable source maps in production for security
};

export default nextConfig;
