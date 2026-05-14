import { Reveal } from '@/components/shared/Reveal';

export function Philosophy() {
  return (
    <section
      id="studio"
      className="py-[var(--section-pad)] px-[var(--gutter)] bg-[var(--color-paper-2)]"
    >
      <Reveal className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-8">
          <div className="font-mono uppercase text-[11px] tracking-[0.18em] text-[var(--color-mute)] mb-8">
            _philosophy / 05
          </div>
          <h2
            className="font-display text-[var(--color-ink)] tracking-[-0.02em] leading-[0.95]"
            style={{ fontSize: 'clamp(48px, 9vw, 160px)' }}
          >
            <span className="italic text-[var(--color-accent)]">Less</span> object.
            <br />
            <span className="italic text-[var(--color-accent)]">More</span> presence.
          </h2>
        </div>
        <div className="md:col-span-4 md:col-start-9 font-sans text-[15px] leading-[1.7] text-[var(--color-ink-2)] flex flex-col gap-5 self-end max-w-[36ch]">
          <p>Not designed to fill a space. Designed to define one.</p>
          <p>
            Created for interiors that value silence, material honesty and intentional living.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
