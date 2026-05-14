import { Reveal } from '@/components/shared/Reveal';

const quotes = [
  { text: 'Sculpted from steel.', n: '_01' },
  { text: 'Folded with precision.', n: '_02' },
  { text: 'Reduced to its purest expression.', n: '_03' },
] as const;

export function Concept() {
  return (
    <section className="py-[var(--section-pad)] px-[var(--gutter)] bg-[var(--color-paper)]">
      <div className="max-w-[1400px] mx-auto">
        <div className="font-mono uppercase text-[11px] tracking-[0.18em] text-[var(--color-mute)] mb-16">
          _the concept / 02
        </div>
        <div className="flex flex-col gap-[14vh]">
          {quotes.map((q, i) => (
            <Reveal
              key={q.n}
              delay={i * 0.05}
              className={`flex flex-col gap-3 ${
                i % 2 === 0 ? 'md:items-start md:pl-0' : 'md:items-end md:pr-0 md:text-right'
              }`}
            >
              <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-mute)]">
                {q.n}
              </span>
              <h3
                className="font-display italic text-[var(--color-ink)] tracking-[-0.02em] leading-[1] max-w-[14ch]"
                style={{ fontSize: 'clamp(40px, 7vw, 120px)' }}
              >
                {q.text}
              </h3>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
