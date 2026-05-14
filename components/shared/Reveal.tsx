'use client';

import { motion, type Variants } from 'motion/react';
import type { ReactNode } from 'react';
import { fadeUp } from '@/lib/motion-presets';

type RevealProps = {
  children: ReactNode;
  variants?: Variants;
  delay?: number;
  className?: string;
  amount?: number;
  as?: 'div' | 'section' | 'article' | 'header' | 'footer';
};

export function Reveal({
  children,
  variants = fadeUp,
  delay = 0,
  className,
  amount = 0.18,
  as = 'div',
}: RevealProps) {
  const Component =
    as === 'section'
      ? motion.section
      : as === 'article'
        ? motion.article
        : as === 'header'
          ? motion.header
          : as === 'footer'
            ? motion.footer
            : motion.div;

  return (
    <Component
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      transition={{ delay }}
    >
      {children}
    </Component>
  );
}
