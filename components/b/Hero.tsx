'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { heroParallaxScale, staggerChildren, wordReveal } from '@/lib/motion-presets';

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section
      ref={ref}
      className="relative h-screen w-full overflow-hidden bg-[var(--color-ink)]"
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={heroParallaxScale}
        className="absolute inset-0"
      >
        <motion.div style={{ y }} className="absolute inset-0">
          <Image
            src="/images/hero-b.webp"
            alt="Steel Naked™"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-ink)]/20 via-transparent to-[var(--color-ink)]/40" />
      <div className="relative h-full flex items-end px-[var(--gutter)] pb-24">
        <motion.h1
          className="font-display text-[var(--color-paper)] tracking-[-0.02em] leading-[0.95] max-w-[18ch]"
          style={{ fontSize: 'clamp(48px, 9vw, 160px)' }}
          variants={staggerChildren(0.06, 0.3)}
          initial="hidden"
          animate="visible"
        >
          {['Steel', 'Naked', '—'].map((w) => (
            <Word key={w}>{w}</Word>
          ))}
          <Word italic>near-future,</Word>
          <Word>brutally</Word>
          <Word>permanent.</Word>
        </motion.h1>
      </div>
    </section>
  );
}

function Word({ children, italic = false }: { children: string; italic?: boolean }) {
  return (
    <span className="inline-block overflow-hidden align-bottom mr-[0.18em]">
      <motion.span variants={wordReveal} className={`inline-block ${italic ? 'italic text-[var(--color-accent)]' : ''}`}>
        {children}
      </motion.span>
    </span>
  );
}
