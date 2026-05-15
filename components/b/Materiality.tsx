import Image from 'next/image';
import { Eyebrow } from '@/components/shared/Eyebrow';
import { StackedHeadline } from '@/components/shared/StackedHeadline';

export function Materiality() {
  return (
    <section
      id="materiality"
      data-dark="true"
      className="py-[var(--section-pad)] px-[var(--gutter)] bg-[var(--color-stone)] text-[var(--color-paper)]"
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <Eyebrow className="text-[var(--color-paper)]/85 mb-6">
            _MATERIALITY / 04
          </Eyebrow>
          <StackedHeadline
            lines={['Brutally permanent.']}
            className="font-display text-[var(--color-paper)] tracking-[-0.025em] leading-[1] font-medium"
            style={{ fontSize: 'var(--text-display-lg)' }}
          />
          <p className="font-sans text-[15px] leading-[1.55] text-[var(--color-paper)]/85 mt-8 max-w-[44ch]">
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
          <div className="mt-12">
            <div
              className="font-display text-[var(--color-paper)] tracking-[-0.025em] leading-[0.95] font-medium"
              style={{ fontSize: 'clamp(80px, 14vw, 220px)' }}
            >
              304
            </div>
            <div className="font-sans text-[14px] mt-3 text-[var(--color-paper)]/85 uppercase tracking-[0.04em]">
              Stainless grade
            </div>
            <div className="mt-12 pt-6 border-t border-[var(--color-paper)]/15 font-mono text-[13px] uppercase tracking-[0.16em] text-[var(--color-paper)]/85">
              1 sheet · 2.5 mm thickness · 100% recyclable
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
