import type { NextConfig } from "next";

// Report-Only for now: watch the console (and previews) before enforcing.
// 'unsafe-inline' is needed by Next's hydration scripts, TweaksHydrator's
// inline <style>/<script> and motion's inline styles. Dev adds 'unsafe-eval'
// for React/HMR. frame-ancestors 'self' (not 'none'): the editor iframes the
// site itself.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join('; ');

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Always defined so `process.env.NEXT_PUBLIC_EDITOR === '1'` folds at build
  // time and the internal editor is left out of normal builds entirely.
  env: { NEXT_PUBLIC_EDITOR: process.env.NEXT_PUBLIC_EDITOR ?? '' },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy-Report-Only', value: csp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
