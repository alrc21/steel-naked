'use client';

import { motion } from 'motion/react';
import { staggerChildren, wordReveal } from '@/lib/motion-presets';

const phrases = [
  'One sheet.',
  'One gesture.',
  'One object.',
  'Brutally permanent.',
  'Built beyond time.',
  'The future should last longer.',
] as const;

export function Manifesto() {
  return (
    <section
      id="studio"
      className="relative py-[var(--section-pad)] px-[var(--gutter)] bg-[var(--color-paper)]"
    >
      <div className="flex flex-col gap-[40vh]">
        {phrases.map((line) => (
          <PhraseLine key={line} text={line} />
        ))}
      </div>
    </section>
  );
}

function PhraseLine({ text }: { text: string }) {
  const words = text.split(' ');
  return (
    <motion.h2
      className="font-display font-thin text-[var(--color-ink)] tracking-[-0.02em] leading-[0.9]"
      style={{ fontSize: 'clamp(64px, 12vw, 200px)' }}
      variants={staggerChildren(0.08, 0.05)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
    >
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          className="inline-block overflow-hidden align-bottom mr-[0.25em]"
        >
          <motion.span variants={wordReveal} className="inline-block">
            {w}
          </motion.span>
        </span>
      ))}
    </motion.h2>
  );
}
