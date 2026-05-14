import { WaitlistForm } from '@/components/shared/WaitlistForm';
import { Reveal } from '@/components/shared/Reveal';

export function WaitlistB() {
  return (
    <section
      id="founders"
      data-dark="true"
      className="py-[var(--section-pad)] px-[var(--gutter)] bg-[var(--color-ink)] text-[var(--color-paper)]"
    >
      <Reveal className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <div className="font-mono uppercase text-[11px] tracking-[0.18em] text-[var(--color-paper)]/50 mb-6">
            _founder list / 06
          </div>
          <h2
            className="font-display text-[var(--color-paper)] tracking-[-0.02em] leading-[1]"
            style={{ fontSize: 'clamp(40px, 5vw, 80px)' }}
          >
            <span className="italic text-[var(--color-accent)]">Enter</span> the list.
          </h2>
          <p className="font-sans text-[15px] leading-[1.7] text-[var(--color-paper)]/70 mt-8 max-w-[40ch]">
            Be among the first to experience Steel Naked™. Private previews, founder access, launch updates.
          </p>
        </div>
        <div className="md:col-span-6 md:col-start-7 self-end">
          <WaitlistForm source="b" variant="editorial" withNote />
        </div>
      </Reveal>
    </section>
  );
}
