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

    // Heavy, weighty scroll: a low lerp makes the viewport "chase" the input
    // with mass and a long settle (momentum) instead of tracking it 1:1.
    // wheelMultiplier < 1 makes each notch travel less — deliberate, unhurried.
    const lenis = new Lenis({
      lerp: 0.06,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.5,
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
