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
  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative w-full bg-[var(--color-paper)]"
      style={{
        height: 'calc(92vh - var(--topbar-h))',
        padding: 'clamp(16px, 4vw, 32px)',
      }}
    >
      <div className="relative w-full h-full overflow-hidden bg-[var(--color-paper-2)]">
        <motion.div
          className="absolute inset-0"
          data-tweak-id="hero-image"
          style={{ scale, y, willChange: 'transform' }}
        >
          <Image
            src="/images/hero-b.webp"
            alt="Steel Naked™"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: 'center 55%' }}
          />
        </motion.div>
      </div>
    </section>
  );
}
