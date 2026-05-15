'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Smooth scroll provider (Lenis). Mounts once at the root.
 * Disabled when the user prefers reduced motion.
 *
 * Lenis dispatches a native `scroll` event on every frame, so
 * Motion's `useScroll` hook continues to work without extra wiring.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
