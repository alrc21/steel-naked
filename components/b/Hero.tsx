'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  // The image wrapper is overscanned (inset -8%), so this drift never
  // exposes the frame underneath.
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-5%']);

  return (
    <section
      id="top"
      ref={ref}
      className="relative w-full bg-[var(--color-paper)]"
      style={{
        height: 'calc(92svh - var(--topbar-h))',
        padding: 'clamp(16px, 4vw, 32px)',
      }}
    >
      <div className="relative w-full h-full overflow-hidden bg-[var(--color-paper-2)]">
        <motion.div
          className="absolute"
          data-tweak-id="hero-image"
          style={{ inset: '-8% 0', scale, y, willChange: 'transform' }}
        >
          {/* Desktop — landscape */}
          <Image
            src="/images/hero-b.webp"
            alt="Steel Naked™"
            fill
            priority
            sizes="(max-width: 767px) 1px, 100vw"
            className="object-cover hidden md:block"
            style={{ objectPosition: 'center 55%' }}
          />
          {/* Mobile — portrait */}
          <Image
            src="/images/bg04.webp"
            alt="Steel Naked™"
            fill
            priority
            sizes="(max-width: 767px) 100vw, 1px"
            className="object-cover md:hidden"
            style={{ objectPosition: 'center 40%' }}
          />
        </motion.div>
      </div>
    </section>
  );
}
