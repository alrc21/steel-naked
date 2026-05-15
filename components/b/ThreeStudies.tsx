'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Eyebrow } from '@/components/shared/Eyebrow';

const studies = [
  {
    front: '/images/bg04.webp',
    label: 'LOUNGE',
    title: 'One sheet.',
    descr:
      'Steel Naked is built from a single folded sheet of stainless steel, transforming industrial material into a collectible seating object.',
  },
  {
    front: '/images/bg05.webp',
    label: 'MARK',
    title: 'One gesture.',
    descr:
      'The structure is reduced to its purest expression: a continuous line shaped through precision bending, tension and balance.',
  },
  {
    front: '/images/bg06.webp',
    label: 'PLATE',
    title: 'One object.',
    descr:
      'An object that feels both brutal and refined. Architectural yet sensual. Cold material made human through form.',
  },
] as const;

export function ThreeStudies() {
  return (
    <div id="object">
      <section className="py-[var(--section-pad)] px-[var(--gutter)] bg-[var(--color-paper)]">
        <div className="max-w-[1400px] mx-auto">
          <Eyebrow className="font-mono uppercase text-[11px] tracking-[0.18em] text-[var(--color-mute)] mb-6">
            [ THREE STUDIES _03 ]
          </Eyebrow>
          <p className="font-sans text-[15px] leading-[1.5] text-[var(--color-ink-2)] max-w-[60ch]">
            An object that feels both brutal and refined. Architectural yet sensual. Cold material made human through form.
          </p>
        </div>
      </section>

      {studies.map((s, i) => (
        <StudyPane key={s.label} s={s} i={i} />
      ))}
    </div>
  );
}

type StudyType = (typeof studies)[number];

function StudyPane({ s, i }: { s: StudyType; i: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.04]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[var(--color-paper)]"
      style={{ position: 'sticky', top: 0, height: '100vh' }}
    >
      <div
        className="h-full grid grid-cols-1 md:grid-cols-2 gap-0"
        style={{
          paddingLeft: 'var(--gutter)',
          paddingRight: 'var(--gutter)',
          paddingTop: 'clamp(80px, 10vh, 140px)',
          paddingBottom: 'clamp(80px, 10vh, 140px)',
          columnGap: 'clamp(24px, 4vw, 64px)',
        }}
      >
        <div className="relative w-full h-full overflow-hidden bg-[var(--color-paper-2)]">
          <motion.div
            className="absolute inset-0"
            style={{ y, scale, willChange: 'transform' }}
          >
            <Image
              src={s.front}
              alt={s.label}
              fill
              sizes="(min-width:768px) 50vw, 100vw"
              className="object-cover"
            />
          </motion.div>
        </div>
        <div className="flex flex-col justify-between py-2 md:py-6">
          <Eyebrow className="font-mono uppercase text-[11px] tracking-[0.18em] text-[var(--color-mute)]">
            [ {s.label} _0{i + 1} ]
          </Eyebrow>
          <div>
            <h3
              className="font-display text-[var(--color-ink)] font-medium"
              style={{
                fontSize: 'clamp(40px, 5vw, 80px)',
                lineHeight: 0.95,
                letterSpacing: '-0.025em',
              }}
            >
              {s.title}
            </h3>
            <p className="mt-6 font-sans text-[15px] leading-[1.55] text-[var(--color-ink-2)] max-w-[40ch]">
              {s.descr}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
