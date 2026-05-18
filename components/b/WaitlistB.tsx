import { WaitlistForm } from '@/components/shared/WaitlistForm';
import { Reveal } from '@/components/shared/Reveal';
import { Eyebrow } from '@/components/shared/Eyebrow';
import { StackedHeadline } from '@/components/shared/StackedHeadline';

export function WaitlistB() {
  return (
    <section
      id="founders"
      data-dark="true"
      className="py-[var(--section-pad)] px-[var(--gutter)] bg-[var(--color-dark)] text-[var(--color-paper)]"
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <Eyebrow className="text-[var(--color-steel)] mb-6">
            _FOUNDER LIST / 07
          </Eyebrow>
          <StackedHeadline
            lines={['Enter the list.']}
            className="font-display text-[var(--color-paper-2)] tracking-[-0.025em] leading-[1] font-medium"
            style={{ fontSize: 'var(--text-display-lg)' }}
          />
          <p className="font-sans text-[15px] leading-[1.55] text-[var(--color-paper)] mt-8 max-w-[44ch]">
            Be the first to access the launch, private previews and founder release.
          </p>
        </div>
        <Reveal className="md:col-span-6 md:col-start-7 self-end">
          <WaitlistForm source="b" variant="editorial" withNote />
        </Reveal>
      </div>
    </section>
  );
}
