import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow access from local network devices
  allowedDevOrigins: ['192.168.45.1'],
};

export default nextConfig;
