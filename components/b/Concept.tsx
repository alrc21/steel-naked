import { Reveal } from '@/components/shared/Reveal';
import { Eyebrow } from '@/components/shared/Eyebrow';
import { StackedHeadline } from '@/components/shared/StackedHeadline';

export function Concept() {
  return (
    <section className="py-[var(--section-pad-generous)] px-[var(--gutter)] bg-[var(--color-paper)]">
      <div className="max-w-[1400px] mx-auto">
        <Eyebrow className="text-[var(--color-mute)] mb-16">
          _THE CONCEPT / 02
        </Eyebrow>
        <StackedHeadline
          lines={['One sheet.', 'One gesture.', 'One object.']}
          className="font-display text-[var(--color-ink)] tracking-[-0.025em] leading-[0.95] font-medium"
          style={{ fontSize: 'var(--text-display-xl)' }}
        />
        <Reveal className="mt-10 max-w-[60ch]">
          <p className="font-sans text-[15px] leading-[1.5] text-[var(--color-ink-2)]">
            Steel Naked is built from a single folded sheet of stainless steel, transforming industrial material into a collectible seating object. The structure is reduced to its purest expression: a continuous line shaped through precision bending, tension and balance.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
