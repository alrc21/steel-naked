'use client';

import Image from 'next/image';
import { animate, useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

const facts = [
  { value: 1, label: 'continuous sheet', suffix: '' },
  { value: 2.5, label: 'mm thickness', suffix: '', decimals: 1 },
  { value: 304, label: 'grade stainless', suffix: '' },
  { value: 100, label: 'recyclable', suffix: '%' },
] as const;

export function Materiality() {
  return (
    <section
      data-dark="true"
      className="py-[var(--section-pad)] px-[var(--gutter)] bg-[var(--color-ink)] text-[var(--color-paper)]"
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <div className="font-mono uppercase text-[11px] tracking-[0.18em] text-[var(--color-paper)]/50 mb-6">
            _materiality / 04
          </div>
          <h2
            className="font-display text-[var(--color-paper)] tracking-[-0.02em] leading-[1]"
            style={{ fontSize: 'clamp(40px, 5vw, 80px)' }}
          >
            <span className="italic text-[var(--color-accent)]">Brutally</span> permanent.
          </h2>
          <p className="font-sans text-[15px] leading-[1.7] text-[var(--color-paper)]/70 mt-8 max-w-[40ch]">
            An object designed as an antidote to disposable culture. A chair that ages with dignity. A material that remembers nothing but time.
          </p>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/5' }}>
            <Image
              src="/images/ph2.webp"
              alt="Material study"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 mt-12">
            {facts.map((f) => (
              <Counter key={f.label} value={f.value} label={f.label} suffix={f.suffix} decimals={'decimals' in f ? f.decimals : 0} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Counter({ value, label, suffix, decimals }: { value: number; label: string; suffix: string; decimals: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.2,
      ease: [0.2, 0.7, 0.2, 1],
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [inView, value, decimals]);

  return (
    <div ref={ref} className="flex flex-col">
      <div className="font-display text-[var(--color-paper)] tracking-[-0.02em] leading-[1]" style={{ fontSize: 'clamp(36px, 4vw, 64px)' }}>
        {display}{suffix}
      </div>
      <div className="font-mono uppercase text-[10px] tracking-[0.16em] text-[var(--color-paper)]/60 mt-2">
        {label}
      </div>
    </div>
  );
}
