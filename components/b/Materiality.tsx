'use client';

import Image from 'next/image';
import { animate, motion, useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Eyebrow } from '@/components/shared/Eyebrow';
import { StackedHeadline } from '@/components/shared/StackedHeadline';

const facts = [
  { value: 1, label: 'continuous sheet', suffix: '' },
  { value: 2.5, label: 'mm thickness', suffix: '', decimals: 1 },
  { value: 304, label: 'grade stainless', suffix: '' },
  { value: 100, label: 'recyclable', suffix: '%' },
] as const;

export function Materiality() {
  return (
    <section
      id="materiality"
      data-dark="true"
      className="py-[var(--section-pad)] px-[var(--gutter)] bg-[var(--color-stone)] text-[var(--color-paper)]"
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <Eyebrow className="font-mono uppercase text-[11px] tracking-[0.18em] text-[var(--color-paper)]/60 mb-6">
            _materiality / 04
          </Eyebrow>
          <StackedHeadline
            lines={['Brutally permanent.']}
            className="font-display text-[var(--color-paper)] tracking-[-0.025em] leading-[1] font-medium"
            style={{ fontSize: 'clamp(40px, 5vw, 80px)' }}
          />
          <p className="font-sans text-[15px] leading-[1.55] text-[var(--color-paper)]/80 mt-8 max-w-[44ch]">
            Not only for its strength, but for what it represents. Resistance. Longevity. Timelessness. Steel Naked™ is designed as an antidote to disposable culture — an object made to survive trends, seasons and obsolescence. A chair that ages with dignity. A material that remembers nothing but time.
          </p>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/5' }}>
            <Image
              src="/images/bg07.webp"
              alt="Material study"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 mt-12">
            {facts.map((f) => (
              <Counter
                key={f.label}
                value={f.value}
                label={f.label}
                suffix={f.suffix}
                decimals={'decimals' in f ? f.decimals : 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Counter({
  value,
  label,
  suffix,
  decimals,
}: {
  value: number;
  label: string;
  suffix: string;
  decimals: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState('0');
  const [lineDone, setLineDone] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
      onComplete: () => setLineDone(true),
    });
    return () => controls.stop();
  }, [inView, value, decimals]);

  return (
    <div ref={ref} className="flex flex-col">
      <div
        className="font-display text-[var(--color-paper)] tracking-[-0.02em] leading-[1] font-medium"
        style={{ fontSize: 'clamp(36px, 4vw, 64px)' }}
      >
        {display}
        {suffix}
      </div>
      <motion.div
        className="h-px bg-[var(--color-paper)]/70 mt-3"
        initial={{ width: '0%' }}
        animate={{ width: lineDone ? '100%' : '0%' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
      <div className="font-mono uppercase text-[10px] tracking-[0.16em] text-[var(--color-paper)]/70 mt-2">
        {label}
      </div>
    </div>
  );
}
