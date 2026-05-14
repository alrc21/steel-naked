'use client';

import Image from 'next/image';
import { Reveal } from '@/components/shared/Reveal';
import { PixelateFilter } from '@/components/shared/PixelateFilter';

const plates = [
  { src: '/images/ph1.webp', alt: 'Steel Naked™ — plate 01', label: '_01 · LOUNGE NO.1 · STAINLESS / FOLDED', aspect: '16/10' },
  { src: '/images/ph3.webp', alt: 'Steel Naked™ — plate 02', label: '_02 · THE MARK · 304 / BRUSHED', aspect: '21/9' },
  { src: '/images/ph5.webp', alt: 'Steel Naked™ — plate 03', label: '_03 · THE FOLDED PLATE · 2.5MM', aspect: '3/2' },
] as const;

export function PlateGrid() {
  return (
    <section
      id="object"
      className="relative py-[var(--section-pad)] px-[var(--gutter)] bg-[var(--color-paper)]"
    >
      <PixelateFilter />
      <div className="flex flex-col gap-[18vh]">
        {plates.map((p, i) => (
          <Reveal key={p.label} className="flex flex-col gap-4" delay={i * 0.05}>
            <div
              className="relative w-full overflow-hidden bg-[var(--color-paper-2)] group"
              style={{ aspectRatio: p.aspect }}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="100vw"
                className="object-cover transition-[filter,transform] duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.03] group-hover:[filter:url(#sn-pixelate)]"
              />
            </div>
            <div className="font-mono uppercase tracking-[0.18em] text-[11px] text-[var(--color-ink)] flex justify-between">
              <span>{p.label}</span>
              <span className="text-[var(--color-mute)]">VLC · 2026</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
