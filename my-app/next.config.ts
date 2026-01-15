import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    'http://192.168.10.18:3000',
    'http://localhost:3000',
  ],
};

export default nextConfig;
