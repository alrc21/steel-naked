'use client';

import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { eyebrowSlide } from '@/lib/motion-presets';

type EyebrowProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Slides in from x:-20, opacity:0 → x:0, opacity:1 when entering viewport.
 * Use for section eyebrow lines (e.g. `_about steel naked`).
 */
export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <motion.div
      className={className}
      variants={eyebrowSlide}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
    >
      {children}
    </motion.div>
  );
}
