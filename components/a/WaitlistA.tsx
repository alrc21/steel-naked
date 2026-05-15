import { WaitlistForm } from '@/components/shared/WaitlistForm';
import { Reveal } from '@/components/shared/Reveal';

export function WaitlistA() {
  return (
    <section
      id="founders"
      className="relative py-[var(--section-pad)] px-[var(--gutter)] bg-[var(--color-ink)] text-[var(--color-paper)]"
    >
      <Reveal className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-[1400px] mx-auto">
        <div className="md:col-span-4">
          <div className="font-mono uppercase tracking-[0.18em] text-[11px] text-[var(--color-paper)]/60 mb-3">
            _founder list / 05
          </div>
          <h3 className="font-mono uppercase tracking-[0.16em] text-[18px] md:text-[22px] text-[var(--color-paper)]">
            FOUNDER LIST_
          </h3>
        </div>
        <div className="md:col-span-7 md:col-start-6">
          <p className="font-mono uppercase tracking-[0.10em] text-[12px] text-[var(--color-paper)]/70 mb-8 max-w-md">
            No spam. Only launch updates, previews and founder access.
          </p>
          <WaitlistForm source="a" variant="brutalist" submitLabel="→" />
        </div>
      </Reveal>
    </section>
  );
}
