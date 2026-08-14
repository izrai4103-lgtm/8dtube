import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["seroval"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "yt3.ggpht.com" },
    ],
  },
};

export default nextConfig;
