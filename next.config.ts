import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Always defined so `process.env.NEXT_PUBLIC_EDITOR === '1'` folds at build
  // time and the internal editor is left out of normal builds entirely.
  env: { NEXT_PUBLIC_EDITOR: process.env.NEXT_PUBLIC_EDITOR ?? '' },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
