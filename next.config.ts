import type { NextConfig } from "next";
import path from "path";

const projectRoot = path.resolve(__dirname);

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack(config, { dev, isServer }) {
    if (dev && !isServer) {
      // Fix: Next.js 16 next-devtools resolves paths with wrong casing on Windows,
      // causing duplicate React instances and the "layout router not mounted" invariant.
      // Force webpack to deduplicate modules by content hash instead of path string.
      config.snapshot = {
        ...config.snapshot,
        module: { timestamp: true, hash: true },
        resolve: { timestamp: true, hash: true },
      };

      // Ensure node_modules always resolves from the correct-cased project root
      config.resolve = {
        ...config.resolve,
        modules: [path.join(projectRoot, "node_modules"), "node_modules"],
      };
    }
    return config;
  },
};

export default nextConfig;
