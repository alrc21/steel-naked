'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll } from 'motion/react';
import { Eyebrow } from '@/components/shared/Eyebrow';

const STEPS = [
  {
    bg: '/images/hero-a.webp',
    front: '/images/bg01.webp',
    label: 'LOUNGE',
    title: 'One sheet.',
    descr:
      'Steel Naked is built from a single folded sheet of stainless steel, transforming industrial material into a collectible seating object.',
  },
  {
    bg: '/images/hero-b.webp',
    front: '/images/bg02.webp',
    label: 'MARK',
    title: 'One gesture.',
    descr:
      'The structure is reduced to its purest expression: a continuous line shaped through precision bending, tension and balance.',
  },
  {
    bg: '/images/hero-landing.webp',
    front: '/images/bg03.webp',
    label: 'PLATE',
    title: 'One object.',
    descr:
      'An object that feels both brutal and refined. Architectural yet sensual. Cold material made human through form.',
  },
  {
    bg: '/images/hero-a.webp',
    front: '/images/bg04.webp',
    label: 'STUDY',
    title: 'Brutally permanent.',
    descr:
      'Designed as an antidote to disposable culture. An object made to survive trends, seasons and obsolescence.',
  },
  {
    bg: '/images/hero-b.webp',
    front: '/images/bg05.webp',
    label: 'STUDY',
    title: 'Architectural.',
    descr: 'Cold material made human through form. Sensual through restraint.',
  },
  {
    bg: '/images/hero-landing.webp',
    front: '/images/bg06.webp',
    label: 'STUDY',
    title: 'Beyond time.',
    descr: 'A material that remembers nothing but time.',
  },
] as const;

const STEP_COUNT = STEPS.length;

export function ThreeStudies() {
  const wrapRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  });
  const [step, setStep] = useState(0);

  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      // Map 0..1 → 0..STEP_COUNT-1 with easing toward middle of each band.
      const idx = Math.min(STEP_COUNT - 1, Math.max(0, Math.floor(v * STEP_COUNT)));
      setStep((prev) => (prev === idx ? prev : idx));
    });
    return () => unsub();
  }, [scrollYProgress]);

  const current = STEPS[step] ?? STEPS[0]!;

  return (
    <section
      id="object"
      ref={wrapRef}
      className="relative bg-[var(--color-paper)]"
      style={{ height: `${STEP_COUNT * 100}vh` }}
    >
      <div
        className="sticky overflow-hidden bg-[var(--color-paper)]"
        style={{
          top: 'var(--topbar-h)',
          height: 'calc(100vh - var(--topbar-h))',
        }}
      >
        {/* Horizontal background photo full-bleed (desktop only) */}
        <div className="absolute inset-0 hidden md:block bg-[var(--color-paper-2)]">
          <AnimatePresence mode="sync">
            <motion.div
              key={`bg-${step}`}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={current.bg}
                alt=""
                fill
                priority={step === 0}
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-black/15" aria-hidden />
        </div>

        {/* Mobile: portrait full-bleed */}
        <div className="absolute inset-0 md:hidden bg-[var(--color-paper-2)]">
          <AnimatePresence mode="sync">
            <motion.div
              key={`mob-${step}`}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={current.front}
                alt={current.label}
                fill
                priority={step === 0}
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-black/30" aria-hidden />
        </div>

        {/* Smaller portrait centered (desktop only) */}
        <div className="absolute inset-0 hidden md:block pointer-events-none">
          <AnimatePresence mode="sync">
            <motion.div
              key={`fg-${step}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: 'min(34vw, 380px)',
                height: 'min(50vw, 560px)',
              }}
            >
              <div className="relative w-full h-full overflow-hidden shadow-2xl">
                <Image
                  src={current.front}
                  alt={current.label}
                  fill
                  sizes="40vw"
                  className="object-cover"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Step indicator */}
        <div className="absolute right-[var(--gutter)] top-[var(--gutter)] font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-paper)]/85">
          {String(step + 1).padStart(2, '0')} / {String(STEP_COUNT).padStart(2, '0')}
        </div>

        {/* Eyebrow at top-left */}
        <div className="absolute left-[var(--gutter)] top-[var(--gutter)]">
          <Eyebrow className="font-mono uppercase text-[11px] tracking-[0.18em] text-[var(--color-paper)]/85">
            [ THREE STUDIES _03 ]
          </Eyebrow>
        </div>

        {/* Text overlay bottom */}
        <AnimatePresence mode="sync">
          <motion.div
            key={`txt-${step}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="absolute bottom-[var(--gutter)] left-[var(--gutter)] right-[var(--gutter)] text-[var(--color-paper)] flex flex-col md:flex-row md:justify-between md:items-end gap-4 pointer-events-none"
          >
            <div>
              <div className="font-mono uppercase text-[11px] tracking-[0.18em] mb-3 opacity-85">
                [ {current.label} _{String(step + 1).padStart(2, '0')} ]
              </div>
              <h3
                style={{
                  fontSize: 'clamp(36px, 5vw, 80px)',
                  lineHeight: 1.0,
                  fontWeight: 500,
                  letterSpacing: '-0.02em',
                  paddingBottom: '0.12em',
                }}
                className="font-display max-w-[12ch]"
              >
                {current.title}
              </h3>
            </div>
            <p className="font-sans text-[14px] leading-[1.55] max-w-[40ch] hidden md:block">
              {current.descr}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
