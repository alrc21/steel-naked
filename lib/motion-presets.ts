import type { Variants } from 'motion/react';

const EASE = [0.2, 0.7, 0.2, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE as unknown as [number, number, number, number] },
  },
};

export const wordReveal: Variants = {
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: { duration: 1, ease: EASE as unknown as [number, number, number, number] },
  },
};

export function staggerChildren(stagger = 0.08, delay = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delay,
        staggerChildren: stagger,
      },
    },
  };
}

export const heroParallaxScale: Variants = {
  hidden: { scale: 1.06 },
  visible: {
    scale: 1,
    transition: { duration: 5, ease: EASE as unknown as [number, number, number, number] },
  },
};
