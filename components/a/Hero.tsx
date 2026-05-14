'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.03]);

  return (
    <section
      ref={ref}
      className="relative h-screen w-full overflow-hidden bg-[var(--color-ink)]"
    >
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <Image
          src="/images/hero-a.webp"
          alt="Steel Naked™ — folded stainless steel object"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--color-ink)]/40" />
      <div className="absolute bottom-12 left-[var(--gutter)] right-[var(--gutter)] flex items-end justify-between">
        <div className="font-mono uppercase tracking-[0.18em] text-[11px] text-[var(--color-paper)] max-w-md">
          <div className="text-[var(--color-paper)]/60 mb-2">_hero / 01</div>
          <div>STEEL NAKED™</div>
          <div>NEAR-FUTURE. BRUTALLY PERMANENT.</div>
        </div>
        <div className="hidden md:block font-mono uppercase tracking-[0.18em] text-[10px] text-[var(--color-paper)]/60">
          scroll ↓
        </div>
      </div>
    </section>
  );
}
