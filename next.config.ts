import type { NextConfig } from "next";
/* @ts-ignore */ 
import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";


const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "avatar.vercel.sh",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com"
      },
      {
        protocol: "https",
        hostname: "gar9ihq4g5.ufs.sh"
      }
      
    ],
  },
  // @ts-expect-error - `eslint` is a valid Next.js config option but might be missing from the strict type definitions
  eslint: {
    ignoreDuringBuilds: true,
  },
  turbopack: {},
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }

    return config
  }
};

export default nextConfig;
