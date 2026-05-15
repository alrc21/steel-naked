import { Reveal } from '@/components/shared/Reveal';
import { Eyebrow } from '@/components/shared/Eyebrow';
import { StackedHeadline } from '@/components/shared/StackedHeadline';

export function Experience() {
  return (
    <section className="py-[var(--section-pad)] px-[var(--gutter)] bg-[var(--color-paper)]">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <Eyebrow className="font-mono lowercase text-[11px] font-normal text-[var(--color-mute)] mb-6">
            _experience / 05
          </Eyebrow>
          <StackedHeadline
            lines={['Sculptural comfort.']}
            className="font-display text-[var(--color-ink)] tracking-[-0.025em] leading-[1] font-medium"
            style={{ fontSize: 'clamp(40px, 5vw, 80px)' }}
          />
        </div>
        <Reveal className="md:col-span-6 md:col-start-7 self-end">
          <p className="font-sans text-[15px] leading-[1.55] text-[var(--color-ink-2)] max-w-[60ch]">
            Despite its monolithic appearance, Steel Naked™ is carefully proportioned to create a balanced ergonomic experience. The body is supported through subtle inclinations, controlled angles and continuous geometric flow.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
