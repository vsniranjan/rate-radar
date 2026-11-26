import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   allowedDevOrigins: ['192.168.220.8'],
   experimental: {
      agentUpgrade: 'security',
   },
};

export default nextConfig;
