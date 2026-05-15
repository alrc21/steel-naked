import { Reveal } from '@/components/shared/Reveal';

export function About() {
  return (
    <section
      id="about"
      className="relative py-[var(--section-pad)] px-[var(--gutter)] bg-[var(--color-paper)]"
    >
      <span
        className="absolute left-[max(8px,calc(var(--gutter)-48px))] top-[var(--section-pad)] font-mono lowercase text-[11px] font-normal text-[var(--color-mute)]"
      >
        _about steel naked
      </span>
      <Reveal className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-7">
          <h2
            className="font-display text-[var(--color-ink)] tracking-[-0.025em] leading-[0.95] font-medium max-w-[14ch]"
            style={{ fontSize: 'clamp(56px, 9vw, 168px)' }}
          >
            Near-future seating, sculpted from one continuous sheet.
          </h2>
        </div>
        <div
          className="md:col-span-4 md:col-start-9 font-sans uppercase text-[var(--color-ink-2)] flex flex-col gap-5 self-end max-w-[40ch]"
          style={{ fontSize: 'clamp(20px, 1.5vw, 26px)', lineHeight: 1.15, fontWeight: 400 }}
        >
          <p>
            A radical object designed between sculpture and function. Folded from one continuous sheet of stainless steel, Steel Naked™ explores permanence, tension, precision and restraint.
          </p>
          <p>Crafted to resist time — both physically and aesthetically.</p>
        </div>
      </Reveal>
    </section>
  );
}
