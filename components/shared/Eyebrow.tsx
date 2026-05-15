'use client';

import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { eyebrowSlide } from '@/lib/motion-presets';

type EyebrowProps = {
  children: ReactNode;
  className?: string;
  /**
   * Visual style for the eyebrow.
   * - `display` (default): Graphik Wide, 11px, 0.18em tracking, uppercase, weight 500.
   *   Use for section eyebrows in editorial layouts.
   * - `mono`: leaves all typography to the `className` (legacy / brutalist).
   */
  variant?: 'mono' | 'display';
};

/**
 * Slides in from x:-20, opacity:0 → x:0, opacity:1 when entering viewport.
 * Use for section eyebrow lines (e.g. `_about steel naked`).
 */
export function Eyebrow({ children, className, variant = 'display' }: EyebrowProps) {
  const baseClass =
    variant === 'display'
      ? 'font-display uppercase text-[11px] tracking-[0.18em] font-medium'
      : '';
  const merged = [baseClass, className].filter(Boolean).join(' ');

  return (
    <motion.div
      className={merged}
      variants={eyebrowSlide}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
    >
      {children}
    </motion.div>
  );
}
