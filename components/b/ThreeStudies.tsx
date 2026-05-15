'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { motion, AnimatePresence, useScroll, useReducedMotion } from 'motion/react';
import { Eyebrow } from '@/components/shared/Eyebrow';
import { EASE_EDITORIAL } from '@/lib/motion-presets';

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
    label: 'MATTER',
    title: 'Brutally permanent.',
    descr:
      'Designed as an antidote to disposable culture — an object made to survive trends, seasons and obsolescence.',
  },
  {
    bg: '/images/hero-b.webp',
    front: '/images/bg05.webp',
    label: 'PRESENCE',
    title: 'Less object. More presence.',
    descr: 'Not designed to fill a space. Designed to define one.',
  },
  {
    bg: '/images/hero-landing.webp',
    front: '/images/bg06.webp',
    label: 'TIME',
    title: 'Built beyond time.',
    descr: 'A material that remembers nothing but time.',
  },
] as const;

const STEP_COUNT = STEPS.length;

function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (cb) => {
      if (typeof window === 'undefined') return () => {};
      const mq = window.matchMedia(query);
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

export function ThreeStudies() {
  const reduce = useReducedMotion();

  if (reduce) {
    return <ThreeStudiesStatic />;
  }

  return <ThreeStudiesScrollDriven />;
}

function ThreeStudiesStatic() {
  return (
    <section id="object" className="relative bg-[var(--color-paper)]">
      <div className="px-[var(--gutter)] pt-[var(--section-pad)] max-w-[1400px] mx-auto">
        <Eyebrow className="font-display uppercase text-[11px] tracking-[0.18em] font-medium text-[var(--color-mute)]">
          [ THREE STUDIES _03 ]
        </Eyebrow>
      </div>
      {STEPS.map((s, i) => (
        <div
          key={s.label + i}
          className="relative w-full overflow-hidden bg-[var(--color-paper-2)]"
          style={{ minHeight: '80vh' }}
        >
          <div className="absolute inset-0">
            <Image
              src={s.front}
              alt={s.label}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-[var(--color-ink)]/30" aria-hidden />
          <div className="relative z-10 px-[var(--gutter)] py-[var(--section-pad)] text-[var(--color-paper)] flex flex-col gap-4 min-h-[80vh] justify-end">
            <div className="font-mono uppercase text-[11px] tracking-[0.18em] opacity-85">
              {String(i + 1).padStart(2, '0')} / {String(STEP_COUNT).padStart(2, '0')} · {s.label}
            </div>
            <h2
              style={{
                fontSize: 'var(--text-display-md)',
                lineHeight: 1.0,
                fontWeight: 500,
                letterSpacing: '-0.02em',
                paddingBottom: '0.12em',
              }}
              className="font-display max-w-[16ch]"
            >
              {s.title}
            </h2>
            <p className="font-sans text-[14px] leading-[1.55] max-w-[40ch]">{s.descr}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

function ThreeStudiesScrollDriven() {
  const wrapRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  });
  const [step, setStep] = useState(0);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
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
        {isDesktop ? (
          <>
            {/* Horizontal background photo full-bleed (desktop) */}
            <div className="absolute inset-0 bg-[var(--color-paper-2)]">
              <AnimatePresence mode="sync">
                <motion.div
                  key={`bg-${step}`}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 1.0, ease: EASE_EDITORIAL }}
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
              <div className="absolute inset-0 bg-[var(--color-ink)]/15" aria-hidden />
            </div>

            {/* Smaller portrait centered (desktop) */}
            <div className="absolute inset-0 pointer-events-none">
              <AnimatePresence mode="sync">
                <motion.div
                  key={`fg-${step}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.9, ease: EASE_EDITORIAL, delay: 0.12 }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: 'min(34vw, 380px)',
                    height: 'min(50vw, 560px)',
                  }}
                >
                  <div className="relative w-full h-full overflow-hidden border border-[var(--color-paper)]/15">
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
          </>
        ) : (
          /* Mobile: portrait full-bleed */
          <div className="absolute inset-0 bg-[var(--color-paper-2)]">
            <AnimatePresence mode="sync">
              <motion.div
                key={`mob-${step}`}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.9, ease: EASE_EDITORIAL }}
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
            <div className="absolute inset-0 bg-[var(--color-ink)]/30" aria-hidden />
          </div>
        )}

        {/* Step indicator (mono — material/machine data) */}
        <div className="absolute right-[var(--gutter)] top-[var(--gutter)] font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-paper)]/85">
          {String(step + 1).padStart(2, '0')} / {String(STEP_COUNT).padStart(2, '0')}
        </div>

        {/* Eyebrow at top-left (display — section eyebrow) */}
        <div className="absolute left-[var(--gutter)] top-[var(--gutter)]">
          <Eyebrow className="font-display uppercase text-[11px] tracking-[0.18em] font-medium text-[var(--color-paper)]/85">
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
            transition={{ duration: 0.7, ease: EASE_EDITORIAL, delay: 0.2 }}
            className="absolute bottom-[var(--gutter)] left-[var(--gutter)] right-[var(--gutter)] text-[var(--color-paper)] flex flex-col md:flex-row md:justify-between md:items-end gap-4 pointer-events-none"
          >
            <div>
              <div className="font-mono uppercase text-[11px] tracking-[0.18em] mb-3 opacity-85">
                [ {current.label} _{String(step + 1).padStart(2, '0')} ]
              </div>
              <h2
                style={{
                  fontSize: 'var(--text-display-md)',
                  lineHeight: 1.0,
                  fontWeight: 500,
                  letterSpacing: '-0.02em',
                  paddingBottom: '0.12em',
                }}
                className="font-display max-w-[16ch]"
              >
                {current.title}
              </h2>
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
