import { Reveal } from '@/components/shared/Reveal';

export function About() {
  return (
    <section
      className="py-[var(--section-pad)] px-[var(--gutter)] bg-[var(--color-paper-2)]"
    >
      <Reveal className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <div className="font-mono uppercase text-[11px] tracking-[0.18em] text-[var(--color-mute)] mb-6">
            _about / 01
          </div>
          <h2
            className="font-display text-[var(--color-ink)] tracking-[-0.02em] leading-[1]"
            style={{ fontSize: 'clamp(40px, 5vw, 80px)' }}
          >
            <span className="italic text-[var(--color-accent)]">A radical</span> object
          </h2>
        </div>
        <div className="md:col-span-7 md:col-start-6 font-sans text-[15px] leading-[1.7] text-[var(--color-ink-2)] flex flex-col gap-5 max-w-[60ch]">
          <p>
            Designed between sculpture and function. Folded from one continuous sheet of stainless steel, Steel Naked™ explores permanence, tension, precision and restraint.
          </p>
          <p>Crafted to resist time — both physically and aesthetically.</p>
        </div>
      </Reveal>
    </section>
  );
}
