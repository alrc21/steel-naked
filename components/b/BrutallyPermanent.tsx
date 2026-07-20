'use client';

import Image from 'next/image';
import { useRef, useSyncExternalStore } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'motion/react';
import { STEPS } from './brutally-steps';

const STEP_COUNT = STEPS.length;
const SEG = 1 / STEP_COUNT;
// Half-width of the scrubbed transition window around each step boundary.
const W = 0.055;
// Portrait trails the background by a beat — layered choreography.
const PORTRAIT_DELAY = 0.022;

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

// ─── Scrubbed layers ──────────────────────────────────────────────────────────
// Everything is mapped directly onto scroll progress (through a gentle spring),
// so the section scrubs both ways with zero triggered jumps.

function BgLayer({
  index,
  progress,
  src,
}: {
  index: number;
  progress: MotionValue<number>;
  src: string;
}) {
  const b = index * SEG;
  const first = index === 0;
  // First layer is always fully revealed (ranges below 0 clamp to the end value).
  const clipPath = useTransform(
    progress,
    first ? [-2, -1] : [b - W, b + W],
    ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)']
  );
  const scale = useTransform(
    progress,
    [Math.max(0, b - W), Math.min(1, b + SEG + W)],
    [1.12, 1]
  );
  const y = useTransform(
    progress,
    first ? [-2, -1] : [b - W, b + W],
    ['10%', '0%']
  );

  return (
    <motion.div
      className="absolute inset-0 will-change-transform"
      style={{ clipPath, zIndex: index }}
    >
      <motion.div className="absolute inset-0" style={{ scale, y, transformOrigin: 'center 70%' }}>
        <Image
          src={src}
          alt=""
          fill
          priority={index === 0}
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
    </motion.div>
  );
}

function PortraitLayer({
  index,
  progress,
  src,
}: {
  index: number;
  progress: MotionValue<number>;
  src: string;
}) {
  const b = index * SEG + PORTRAIT_DELAY;
  const first = index === 0;
  const clipPath = useTransform(
    progress,
    first ? [-2, -1] : [b - W, b + W],
    ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)']
  );
  // Counter-parallax inside the mask while the layer is on screen.
  const innerY = useTransform(
    progress,
    [Math.max(0, index * SEG - W), Math.min(1, (index + 1) * SEG + W)],
    ['4%', '-4%']
  );

  return (
    <motion.div
      className="absolute inset-0 will-change-transform"
      style={{ clipPath, zIndex: index }}
    >
      <motion.div className="absolute" style={{ inset: '-6% 0', y: innerY }}>
        <Image src={src} alt="" fill sizes="40vw" className="object-cover" />
      </motion.div>
    </motion.div>
  );
}

/** Opacity + drift keyframes for per-step text (caption / label / counter). */
function useStepFade(index: number, progress: MotionValue<number>) {
  const segStart = index * SEG;
  const segEnd = segStart + SEG;
  const first = index === 0;
  const last = index === STEP_COUNT - 1;
  const keyframes = [
    first ? -2 : segStart + 0.01,
    first ? -1 : segStart + W,
    last ? 2 : segEnd - W,
    last ? 3 : segEnd - 0.01,
  ];
  const opacity = useTransform(progress, keyframes, [0, 1, 1, 0]);
  const y = useTransform(progress, keyframes, [16, 0, 0, -12]);
  return { opacity, y };
}

function StepText({
  index,
  progress,
  children,
  className,
  style,
}: {
  index: number;
  progress: MotionValue<number>;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { opacity, y } = useStepFade(index, progress);
  return (
    <motion.p className={className} style={{ ...style, opacity, y }}>
      {children}
    </motion.p>
  );
}

/** Big display headline that swaps per step. Outer div holds the constant
 *  left-center anchor; inner motion layer carries the per-step fade + drift so
 *  each headline stays vertically centered regardless of its own height. */
function StepHeadline({
  index,
  progress,
  text,
}: {
  index: number;
  progress: MotionValue<number>;
  text: string;
}) {
  const { opacity, y } = useStepFade(index, progress);
  return (
    <div
      className="absolute z-30 pointer-events-none"
      style={{ top: '50%', left: 'var(--gutter)', transform: 'translateY(-50%)' }}
    >
      <motion.h2
        className="font-display"
        style={{
          opacity,
          y,
          fontSize: 'clamp(44px, 5.5vw, 96px)',
          fontWeight: 700,
          lineHeight: 0.95,
          letterSpacing: '-0.015em',
          color: 'var(--color-accent)',
          whiteSpace: 'pre-line',
          margin: 0,
        }}
      >
        {text.replace(/ /g, '\n')}
      </motion.h2>
    </div>
  );
}

// ─── Exported component ───────────────────────────────────────────────────────

export function BrutallyPermanent() {
  const reduce = useReducedMotion();
  if (reduce) return <BrutallyPermanentStatic />;
  return <BrutallyPermanentScrollDriven />;
}

// ─── Scroll-driven (scrubbed) ─────────────────────────────────────────────────

function BrutallyPermanentScrollDriven() {
  const wrapRef = useRef<HTMLElement>(null);
  const { scrollYProgress: rawProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  });
  // Gentle smoothing — keeps the scrub buttery without feeling laggy.
  const progress = useSpring(rawProgress, {
    stiffness: 160,
    damping: 32,
    mass: 0.3,
    restDelta: 0.0005,
  });
  const isDesktop = useMediaQuery('(min-width: 768px)');

  // Section-long drift for the constant elements.
  const railScaleY = useTransform(progress, [0, 1], [0, 1]);

  return (
    <section
      id="brutally-permanent"
      data-dark="true"
      ref={wrapRef}
      className="relative"
      style={{ height: `${STEP_COUNT * 110}vh` }}
    >
      <div
        className="sticky overflow-hidden bg-[var(--color-ink)]"
        style={{
          top: 'var(--topbar-h)',
          height: 'calc(100svh - var(--topbar-h))',
          contain: 'paint',
        }}
      >
        {/* ── Background stack ── */}
        <div className="absolute inset-0 overflow-hidden">
          {STEPS.map((s, i) => (
            <BgLayer
              key={s.bg}
              index={i}
              progress={progress}
              src={isDesktop ? s.bg : s.portrait}
            />
          ))}
          {/* Dark scrim */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: STEP_COUNT,
              background: isDesktop
                ? 'linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.18))'
                : 'linear-gradient(to bottom, rgba(0,0,0,0.40), rgba(0,0,0,0.55))',
            }}
            aria-hidden
          />
        </div>

        {isDesktop && (
          /* ── Portrait stack (center, masked reveal + inner parallax) ── */
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none overflow-hidden border border-white/10"
            style={{ width: 'min(34vw, 440px)', aspectRatio: '3/4', zIndex: 20 }}
          >
            {STEPS.map((s, i) => (
              <PortraitLayer key={s.portrait} index={i} progress={progress} src={s.portrait} />
            ))}
          </div>
        )}

        {/* ── Static section label, top-left ── */}
        <p
          className="font-mono uppercase absolute z-30"
          data-tweak-id="bp-section-label"
          style={{
            top: '24px',
            left: 'var(--gutter)',
            fontSize: '11px',
            letterSpacing: '0.18em',
            lineHeight: 1,
            color: 'var(--color-accent)',
            margin: 0,
          }}
        >
          _BRUTALLY PERMANENT / 03
        </p>

        {/* ── Per-step counter, top-right ── */}
        <div className="absolute z-30" style={{ top: '24px', right: 'var(--gutter)' }}>
          {STEPS.map((s, i) => (
            <StepText
              key={s.counter}
              index={i}
              progress={progress}
              className="font-mono absolute top-0 right-0"
              style={{
                fontSize: '11px',
                letterSpacing: '0.18em',
                lineHeight: 1,
                color: 'var(--color-accent)',
                whiteSpace: 'nowrap',
                textAlign: 'right',
                margin: 0,
              }}
            >
              {s.counter}
            </StepText>
          ))}
        </div>

        {/* ── Headline — left-center anchor, text swaps each step ── */}
        {STEPS.map((s, i) => (
          <StepHeadline key={s.headline} index={i} progress={progress} text={s.headline} />
        ))}

        {/* ── Per-step label + caption, bottom-right (desktop) / bottom-left (mobile) ── */}
        <div
          className="absolute z-30 pointer-events-none"
          style={{
            bottom: 'clamp(24px, 5vh, 48px)',
            left: 'var(--gutter)',
            right: 'var(--gutter)',
          }}
        >
          <div className="relative md:text-right" style={{ minHeight: '7em' }}>
            {STEPS.map((s, i) => (
              <StepText
                key={s.label}
                index={i}
                progress={progress}
                className="font-mono absolute bottom-0 left-0 right-0"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.04em',
                  lineHeight: 1.6,
                  color: 'var(--color-accent)',
                  whiteSpace: 'pre-line',
                  margin: 0,
                }}
              >
                <span style={{ letterSpacing: '0.18em' }}>{s.label}</span>
                {'\n\n'}
                {s.caption}
              </StepText>
            ))}
          </div>
        </div>

        {/* ── Progress rail, right edge ── */}
        <div
          className="absolute z-30 hidden md:block"
          aria-hidden
          style={{
            top: '20%',
            bottom: '20%',
            right: 'calc(var(--gutter) / 2)',
            width: '1px',
            background: 'rgba(187,255,0,0.18)',
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'var(--color-accent)',
              scaleY: railScaleY,
              transformOrigin: 'top center',
            }}
          />
        </div>
      </div>
    </section>
  );
}

// ─── Static fallback (prefers-reduced-motion) ─────────────────────────────────

function BrutallyPermanentStatic() {
  const step = STEPS[0]!;
  return (
    <section
      id="brutally-permanent"
      data-dark="true"
      className="relative overflow-hidden"
      style={{ minHeight: '100svh' }}
    >
      {/* Bg — landscape on desktop, portrait on mobile */}
      <div className="absolute inset-0 overflow-hidden bg-[var(--color-ink)]">
        <Image
          src={step.bg}
          alt=""
          fill
          sizes="100vw"
          className="object-cover hidden md:block"
        />
        <Image
          src={step.portrait}
          alt=""
          fill
          sizes="100vw"
          className="object-cover md:hidden"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.30))' }}
          aria-hidden
        />
      </div>

      {/* Portrait (desktop only) */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden pointer-events-none z-[2] hidden md:block border border-white/10"
        style={{ width: 'min(34vw, 440px)', aspectRatio: '3/4' }}
      >
        <Image src={step.portrait} alt="" fill sizes="40vw" className="object-cover" />
      </div>

      <p
        className="font-mono uppercase absolute z-10"
        style={{
          top: '24px',
          left: 'var(--gutter)',
          fontSize: '11px',
          letterSpacing: '0.18em',
          lineHeight: 1,
          color: 'var(--color-accent)',
          margin: 0,
        }}
      >
        _BRUTALLY PERMANENT / 03
      </p>

      <h2
        className="font-display absolute z-10"
        data-tweak-id="bp-headline"
        style={{
          top: '50%',
          left: 'var(--gutter)',
          transform: 'translateY(-50%)',
          fontSize: 'clamp(44px, 5.5vw, 96px)',
          fontWeight: 700,
          lineHeight: 0.95,
          letterSpacing: '-0.015em',
          color: 'var(--color-accent)',
          whiteSpace: 'pre-line',
          margin: 0,
        }}
      >
        {step.headline.replace(/ /g, '\n')}
      </h2>

      <p
        className="font-mono absolute z-10 md:text-right"
        data-tweak-id="bp-caption"
        style={{
          bottom: 'clamp(24px, 5vh, 48px)',
          left: 'var(--gutter)',
          right: 'var(--gutter)',
          fontSize: '11px',
          letterSpacing: '0.04em',
          lineHeight: 1.6,
          color: 'var(--color-accent)',
          whiteSpace: 'pre-line',
          margin: 0,
        }}
      >
        {step.caption}
      </p>
    </section>
  );
}
