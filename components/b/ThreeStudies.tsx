'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { fadeUp, staggerChildren } from '@/lib/motion-presets';

const studies = [
  {
    src: '/images/ph1.webp',
    label: 'Lounge',
    title: 'The Brutalist Recline',
    n: '_01',
    descr:
      'A single fold defines back and seat. Tension and curvature held by 2.5mm of 304 stainless. Designed for stillness.',
    offset: 0,
  },
  {
    src: '/images/ph7.webp',
    label: 'Mark',
    title: 'The Mark',
    n: '_02',
    descr:
      'A grounded gesture. A heavier presence. Reads as monolith from afar; geometry on approach.',
    offset: 64,
  },
  {
    src: '/images/ph3.webp',
    label: 'Plate',
    title: 'The Folded Plate',
    n: '_03',
    descr:
      'The original study. One continuous sheet, folded to support the body without joinery or fasteners.',
    offset: 32,
  },
] as const;

export function ThreeStudies() {
  return (
    <section
      id="object"
      className="py-[var(--section-pad)] px-[var(--gutter)] bg-[var(--color-paper)]"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[var(--color-rule)] pb-6 mb-12 gap-4">
          <h3 className="font-display text-[var(--color-ink)] tracking-[-0.02em]" style={{ fontSize: 'clamp(32px, 4vw, 56px)' }}>
            <span className="italic text-[var(--color-accent)]">Three</span> studies
            <span className="font-mono text-[11px] text-[var(--color-mute)] ml-3 align-middle tracking-[0.18em]">_03</span>
          </h3>
          <div className="font-mono uppercase text-[11px] tracking-[0.18em] text-[var(--color-mute)]">
            Lounge No.1 / The Mark / The Folded Plate
          </div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8"
          variants={staggerChildren(0.12, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {studies.map((s) => (
            <motion.a
              key={s.n}
              href={`#${s.label.toLowerCase()}`}
              variants={fadeUp}
              className="md:col-span-4 group flex flex-col gap-3"
              style={{ marginTop: s.offset }}
              data-cursor-hover
            >
              <div className="relative overflow-hidden bg-[var(--color-paper-2)]" style={{ aspectRatio: '3/4' }}>
                <Image
                  src={s.src}
                  alt={s.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.05]"
                />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-mono uppercase text-[11px] tracking-[0.16em] text-[var(--color-mute)]">
                  {s.label}
                </span>
                <span className="font-mono uppercase text-[10px] tracking-[0.16em] text-[var(--color-mute)]">
                  {s.n}
                </span>
              </div>
              <div className="font-display italic text-[var(--color-ink)] tracking-[-0.01em] text-[22px] md:text-[26px]">
                {s.title}
              </div>
              <div className="overflow-hidden max-h-0 group-hover:max-h-[200px] opacity-0 group-hover:opacity-100 transition-[max-height,opacity] duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)]">
                <p className="font-sans text-[14px] leading-[1.6] text-[var(--color-ink-2)] pt-2 max-w-[40ch]">
                  {s.descr}
                </p>
                <div className="font-display italic text-[var(--color-accent)] text-[14px] mt-3">
                  Open the object →
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
