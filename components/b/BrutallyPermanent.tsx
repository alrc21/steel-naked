'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useReducedMotion,
  type Variants,
} from 'motion/react';
import { EASE_EDITORIAL } from '@/lib/motion-presets';

// ─── Data ────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    bg: '/images/bg05.webp',
    portrait: '/images/bg02.webp',
    previewLabel: '[ Preview Texto_01 ]',
    stepCounter: '[ 01 / 04 ]',
    caption:
      'Designed as an antidote to disposable culture,\nan object made to survive trends, seasons\nand obsolescence',
  },
  {
    bg: '/images/bg07.webp',
    portrait: '/images/bg04.webp',
    previewLabel: '[ Preview Texto_02 ]',
    stepCounter: '[ 02 / 04 ]',
    caption:
      'A single sheet folded with intention.\nNo screws, no joints — only the geometry\nof steel under tension.',
  },
  {
    bg: '/images/bg09.webp',
    portrait: '/images/bg06.webp',
    previewLabel: '[ Preview Texto_03 ]',
    stepCounter: '[ 03 / 04 ]',
    caption:
      'Forged in Valencia. Built to outlive\nthe rooms it inhabits — physically and\naesthetically permanent.',
  },
  {
    bg: '/images/bg10.webp',
    portrait: '/images/bg08.webp',
    previewLabel: '[ Preview Texto_04 ]',
    stepCounter: '[ 04 / 04 ]',
    caption:
      'Not a chair. A statement folded\nfrom one continuous gesture.\nBrutally honest. Brutally permanent.',
  },
] as const;

const STEP_COUNT = STEPS.length;

// ─── Motion config ────────────────────────────────────────────────────────────

const EASE = EASE_EDITORIAL as unknown as [number, number, number, number];

const bgVariants: Variants = {
  enter: {
    y: '100%',
    rotate: -3,
    scale: 1.08,
    opacity: 1,
  },
  center: {
    y: ['100%', '0%'],
    rotate: [-3, 0, 0],
    scale: [1.08, 1.0, 1.0],
    opacity: 1,
    transition: {
      duration: 0.9,
      ease: EASE,
      times: [0, 0.5, 1],
    },
  },
  exit: {
    y: '0%',
    rotate: 0,
    scale: 1.04,
    opacity: 0.6,
    transition: {
      duration: 0.9,
      ease: EASE,
    },
  },
};

const portraitVariants: Variants = {
  enter: {
    y: '100%',
    rotate: -2,
    scale: 1.05,
    opacity: 1,
  },
  center: {
    y: ['100%', '0%'],
    rotate: [-2, 0, 0],
    scale: [1.05, 1.0, 1.0],
    opacity: 1,
    transition: {
      duration: 0.75,
      ease: EASE,
      times: [0, 0.5, 1],
      delay: 0.15,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.5, ease: EASE },
  },
};

const captionVariants: Variants = {
  enter: { opacity: 0 },
  center: {
    opacity: 1,
    transition: { duration: 0.5, ease: EASE, delay: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3, ease: EASE },
  },
};

const labelVariants: Variants = {
  enter: { opacity: 0 },
  center: {
    opacity: 1,
    transition: { duration: 0.4, ease: EASE, delay: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: EASE },
  },
};

// ─── Media query hook ─────────────────────────────────────────────────────────

function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (cb) => {
      if (typeof window === 'undefined') return () => {};
      const mq = window.matchMedia(query);
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    () => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false),
    () => false
  );
}

// ─── Exported component ───────────────────────────────────────────────────────

export function BrutallyPermanent() {
  const reduce = useReducedMotion();

  if (reduce) {
    return <BrutallyPermanentStatic />;
  }

  return <BrutallyPermanentScrollDriven />;
}

// ─── Static fallback (reduced-motion + mobile) ────────────────────────────────

function BrutallyPermanentStatic() {
  const step = STEPS[0]!;
  return (
    <section
      id="brutally-permanent"
      data-dark="true"
      className="relative overflow-hidden"
      style={{ minHeight: '100svh' }}
    >
      {/* Bg */}
      <div className="absolute inset-0 overflow-hidden bg-[var(--color-ink)]">
        <Image
          src={step.bg}
          alt=""
          fill
          priority={false}
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.30), rgba(0,0,0,0.15))' }}
          aria-hidden
        />
      </div>

      {/* Portrait */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden pointer-events-none z-[2]"
        style={{ width: 'min(38vw, 480px)', aspectRatio: '3/4' }}
      >
        <Image
          src={step.portrait}
          alt=""
          fill
          sizes="40vw"
          className="object-cover"
        />
      </div>

      {/* Headline (constant) */}
      <h2
        className="font-display absolute hidden md:block z-[3]"
        data-tweak-id="bp-headline"
        style={{
          top: '50%',
          left: 'var(--gutter)',
          transform: 'translateY(-50%)',
          fontSize: 'clamp(40px, 5.5vw, 96px)',
          fontWeight: 700,
          lineHeight: 0.95,
          letterSpacing: '-0.015em',
          color: 'var(--color-accent)',
          margin: 0,
        }}
      >
        Brutally
        <br />
        permanent
      </h2>

      {/* Caption */}
      <p
        className="font-mono absolute hidden md:block z-[3]"
        data-tweak-id="bp-caption"
        style={{
          top: '50%',
          right: 'var(--gutter)',
          transform: 'translateY(-50%)',
          fontSize: '10px',
          letterSpacing: '0.04em',
          lineHeight: 1.6,
          color: 'var(--color-accent)',
          maxWidth: '36ch',
          textAlign: 'right',
          whiteSpace: 'pre-line',
          margin: 0,
        }}
      >
        {step.caption}
      </p>

      {/* Corner labels */}
      <p
        className="font-mono absolute hidden md:block z-[10]"
        data-tweak-id="bp-preview-label"
        style={{
          top: 'calc(var(--topbar-h) + 20px)',
          left: 'var(--gutter)',
          fontSize: '11px',
          letterSpacing: '0.18em',
          lineHeight: 1,
          color: 'var(--color-accent)',
          margin: 0,
        }}
      >
        {step.previewLabel}
      </p>
      <p
        className="font-mono absolute hidden md:block z-[10]"
        data-tweak-id="bp-step-counter"
        style={{
          top: 'calc(var(--topbar-h) + 20px)',
          right: 'var(--gutter)',
          fontSize: '11px',
          letterSpacing: '0.18em',
          lineHeight: 1,
          color: 'var(--color-accent)',
          textAlign: 'right',
          margin: 0,
        }}
      >
        {step.stepCounter}
      </p>

      {/* Mobile stacked */}
      <div
        className="relative flex flex-col items-center justify-center md:hidden z-[5]"
        style={{
          minHeight: '100svh',
          paddingTop: 'calc(var(--topbar-h) + 48px)',
          paddingBottom: 'var(--section-pad)',
          paddingLeft: 'var(--gutter)',
          paddingRight: 'var(--gutter)',
          gap: '32px',
        }}
      >
        <p
          className="font-mono self-start"
          style={{
            fontSize: '10px',
            letterSpacing: '0.18em',
            lineHeight: 1,
            color: 'var(--color-accent)',
            margin: 0,
          }}
        >
          {step.previewLabel}
        </p>
        <h2
          className="font-display text-center"
          style={{
            fontSize: 'clamp(64px, 16vw, 120px)',
            fontWeight: 700,
            lineHeight: 0.92,
            letterSpacing: '-0.02em',
            color: 'var(--color-accent)',
            margin: 0,
          }}
        >
          Brutally
          <br />
          permanent
        </h2>
        <p
          className="font-mono text-center"
          style={{
            fontSize: '12px',
            letterSpacing: '0.04em',
            lineHeight: 1.6,
            color: 'var(--color-accent)',
            maxWidth: '42ch',
            whiteSpace: 'pre-line',
            margin: 0,
          }}
        >
          {step.caption}
        </p>
        <p
          className="font-mono self-end"
          style={{
            fontSize: '10px',
            letterSpacing: '0.18em',
            lineHeight: 1,
            color: 'var(--color-accent)',
            margin: 0,
          }}
        >
          {step.stepCounter}
        </p>
      </div>
    </section>
  );
}

// ─── Scroll-driven (desktop, full motion) ─────────────────────────────────────

function BrutallyPermanentScrollDriven() {
  const wrapRef = useRef<HTMLElement>(null);
  const { scrollYProgress: rawProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  });
  const scrollYProgress = useSpring(rawProgress, {
    stiffness: 90,
    damping: 22,
    mass: 0.4,
    restDelta: 0.0005,
  });
  const [step, setStep] = useState(0);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      const exact = v * STEP_COUNT;
      const idx = Math.min(STEP_COUNT - 1, Math.max(0, Math.floor(exact)));
      setStep((prev) => {
        if (prev === idx) return prev;
        const frac = exact - idx;
        const goingForward = idx > prev;
        const goingBackward = idx < prev;
        if (goingForward && frac < 0.08) return prev;
        if (goingBackward && frac > 0.92) return prev;
        return idx;
      });
    });
    return () => unsub();
  }, [scrollYProgress]);

  const current = STEPS[step] ?? STEPS[0]!;

  return (
    <section
      id="brutally-permanent"
      data-dark="true"
      ref={wrapRef}
      className="relative"
      style={{ height: '400vh' }}
    >
      <div
        className="sticky overflow-hidden"
        style={{
          top: 'var(--topbar-h)',
          height: 'calc(100vh - var(--topbar-h))',
          contain: 'paint',
        }}
      >
        {isDesktop ? (
          <>
            {/* ── Full-bleed background (curtain rise) ── */}
            <div className="absolute inset-0 overflow-hidden bg-[var(--color-ink)]">
              <AnimatePresence initial={false} mode="sync">
                <motion.div
                  key={`bg-${step}`}
                  variants={bgVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 will-change-transform"
                  style={{ transformOrigin: 'center bottom' }}
                >
                  <Image
                    src={current.bg}
                    alt=""
                    fill
                    priority={step === 0}
                    sizes="100vw"
                    className="object-cover sn-breathe"
                  />
                </motion.div>
              </AnimatePresence>
              {/* Dark scrim */}
              <div
                className="absolute inset-0 pointer-events-none z-[1]"
                style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.30), rgba(0,0,0,0.15))' }}
                aria-hidden
              />
            </div>

            {/* ── Portrait vertical overlay (center) ── */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[2] overflow-hidden"
              style={{
                width: 'min(38vw, 480px)',
                aspectRatio: '3/4',
              }}
            >
              <AnimatePresence initial={false} mode="sync">
                <motion.div
                  key={`portrait-${step}`}
                  variants={portraitVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 will-change-transform"
                  style={{ transformOrigin: 'center bottom' }}
                >
                  <div className="relative w-full h-full overflow-hidden border border-white/10">
                    <Image
                      src={current.portrait}
                      alt=""
                      fill
                      sizes="40vw"
                      className="object-cover sn-breathe"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Corner labels (lime mono, animate per step) ── */}
            <AnimatePresence initial={false} mode="wait">
              <motion.p
                key={`label-left-${step}`}
                variants={labelVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="font-mono absolute z-[10]"
                data-tweak-id="bp-preview-label"
                style={{
                  top: 'calc(var(--topbar-h) + 20px)',
                  left: 'var(--gutter)',
                  fontSize: '11px',
                  letterSpacing: '0.18em',
                  lineHeight: 1,
                  color: 'var(--color-accent)',
                  margin: 0,
                }}
              >
                {current.previewLabel}
              </motion.p>
            </AnimatePresence>

            <AnimatePresence initial={false} mode="wait">
              <motion.p
                key={`label-right-${step}`}
                variants={labelVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="font-mono absolute z-[10]"
                data-tweak-id="bp-step-counter"
                style={{
                  top: 'calc(var(--topbar-h) + 20px)',
                  right: 'var(--gutter)',
                  fontSize: '11px',
                  letterSpacing: '0.18em',
                  lineHeight: 1,
                  color: 'var(--color-accent)',
                  textAlign: 'right',
                  margin: 0,
                }}
              >
                {current.stepCounter}
              </motion.p>
            </AnimatePresence>

            {/* ── Headline "Brutally permanent" — constant anchor ── */}
            <h2
              className="font-display absolute z-[3] pointer-events-none"
              data-tweak-id="bp-headline"
              style={{
                top: '50%',
                left: 'var(--gutter)',
                transform: 'translateY(-50%)',
                fontSize: 'clamp(40px, 5.5vw, 96px)',
                fontWeight: 700,
                lineHeight: 0.95,
                letterSpacing: '-0.015em',
                color: 'var(--color-accent)',
                margin: 0,
              }}
            >
              Brutally
              <br />
              permanent
            </h2>

            {/* ── Caption center-right (changes per step) ── */}
            <AnimatePresence initial={false} mode="wait">
              <motion.p
                key={`caption-${step}`}
                variants={captionVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="font-mono absolute z-[3] pointer-events-none"
                data-tweak-id="bp-caption"
                style={{
                  top: '50%',
                  right: 'var(--gutter)',
                  transform: 'translateY(-50%)',
                  fontSize: '10px',
                  letterSpacing: '0.04em',
                  lineHeight: 1.6,
                  color: 'var(--color-accent)',
                  maxWidth: '36ch',
                  textAlign: 'right',
                  whiteSpace: 'pre-line',
                  margin: 0,
                }}
              >
                {current.caption}
              </motion.p>
            </AnimatePresence>
          </>
        ) : (
          /* ── Mobile: single static state, opacity crossfade bg only ── */
          <>
            <div className="absolute inset-0 overflow-hidden bg-[var(--color-ink)]">
              <AnimatePresence mode="sync">
                <motion.div
                  key={`mob-bg-${step}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
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
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0.25))' }}
                aria-hidden
              />
            </div>

            {/* Mobile text — stacked bottom */}
            <AnimatePresence mode="sync">
              <motion.div
                key={`mob-txt-${step}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
                className="absolute bottom-[var(--gutter)] left-[var(--gutter)] right-[var(--gutter)] flex flex-col gap-4 pointer-events-none z-10"
              >
                <p
                  className="font-mono"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.18em',
                    lineHeight: 1,
                    color: 'var(--color-accent)',
                    margin: 0,
                  }}
                >
                  {current.previewLabel} · {current.stepCounter}
                </p>
                <h2
                  className="font-display"
                  style={{
                    fontSize: 'clamp(52px, 14vw, 96px)',
                    fontWeight: 700,
                    lineHeight: 0.92,
                    letterSpacing: '-0.02em',
                    color: 'var(--color-accent)',
                    margin: 0,
                  }}
                >
                  Brutally
                  <br />
                  permanent
                </h2>
                <p
                  className="font-mono"
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.04em',
                    lineHeight: 1.6,
                    color: 'var(--color-accent)',
                    maxWidth: '38ch',
                    whiteSpace: 'pre-line',
                    margin: 0,
                  }}
                >
                  {current.caption}
                </p>
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </section>
  );
}
