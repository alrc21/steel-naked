import Image from 'next/image';
import { Reveal } from '@/components/shared/Reveal';
import { Eyebrow } from '@/components/shared/Eyebrow';
import { StackedHeadline } from '@/components/shared/StackedHeadline';

export function Philosophy() {
  return (
    <section
      id="studio"
      className="py-[var(--section-pad-generous)] px-[var(--gutter)] bg-[var(--color-paper-2)]"
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-8">
          <Eyebrow className="text-[var(--color-mute)] mb-8">
            _DESIGN PHILOSOPHY / 06
          </Eyebrow>
          <StackedHeadline
            lines={['Less object.', 'More presence.']}
            className="font-display text-[var(--color-ink)] tracking-[-0.025em] leading-[0.95] font-medium"
            style={{ fontSize: 'var(--text-display-xl)' }}
          />
        </div>
        <div className="md:col-span-4 md:col-start-9 flex flex-col gap-6 self-end max-w-[36ch]">
          <Reveal>
            <div
              className="relative w-full overflow-hidden bg-[var(--color-paper)]"
              style={{ height: 180 }}
            >
              <Image
                src="/images/bg08.webp"
                alt="Steel Naked in interior"
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal
            className="font-sans uppercase text-[var(--color-ink-2)] flex flex-col gap-5"
          >
            <div
              style={{ fontSize: 'clamp(20px, 1.5vw, 26px)', lineHeight: 1.15, fontWeight: 400 }}
            >
              <p>Not designed to fill a space. Designed to define one.</p>
              <p className="mt-5">
                Created for interiors that value silence, material honesty and intentional living.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
