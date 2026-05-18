import Image from 'next/image';

export function About() {
  return (
    <section
      id="about"
      className="relative bg-[var(--color-paper)]"
      style={{
        minHeight: '100svh',
        paddingTop: 'var(--section-pad-generous)',
        paddingBottom: 'var(--section-pad-generous)',
        paddingLeft: 'var(--gutter)',
        paddingRight: 'var(--gutter)',
      }}
    >
      {/* Top-left label: Space Mono, uppercase, 11px */}
      <p
        className="font-mono uppercase text-[var(--color-ink)] absolute"
        style={{
          top: 'var(--section-pad-generous)',
          left: 'var(--gutter)',
          fontSize: '11px',
          letterSpacing: '0.18em',
          lineHeight: 1,
          margin: 0,
        }}
      >
        _THE CONCEPT / 02
      </p>

      {/* 12-col grid */}
      <div
        className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12"
        style={{ gap: 'var(--gutter)' }}
      >
        {/* LEFT — eyebrow + editorial headline, cols 1–7 */}
        <div
          className="md:col-span-7 flex flex-col justify-start"
          style={{ paddingTop: 'clamp(64px, 12vh, 160px)' }}
        >
          {/* Eyebrow: Graphik Wide Regular, lowercase, ink-2 */}
          <p
            className="font-display text-[var(--color-ink-2)]"
            style={{
              fontSize: 'clamp(12px, 1vw, 16px)',
              fontWeight: 400,
              letterSpacing: '0.04em',
              lineHeight: 1,
              marginBottom: '0.3em',
              textTransform: 'lowercase',
            }}
          >
            _about steel naked
          </p>

          {/* Massive editorial headline: Graphik Wide Semibold */}
          <h2
            className="font-display text-[var(--color-ink)]"
            style={{
              fontSize: 'clamp(40px, 5.5vw, 88px)',
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              margin: 0,
            }}
          >
            Near-future seating
            <br />
            designed
            <br />
            for permanence.
          </h2>
        </div>

        {/* RIGHT — portrait chair image + caption, cols 9–12 */}
        <div
          className="md:col-span-4 md:col-start-9 flex flex-col"
          style={{
            alignItems: 'flex-start',
            paddingTop: 'clamp(64px, 12vh, 160px)',
          }}
        >
          {/* Vertical portrait chair image */}
          <div
            className="relative w-full overflow-hidden"
            style={{
              maxWidth: '280px',
              aspectRatio: '3 / 4',
            }}
          >
            <Image
              src="/images/bg02.webp"
              alt="Steel Naked chair — studio dark portrait"
              fill
              sizes="(max-width: 768px) 70vw, 280px"
              className="object-cover"
              style={{ objectPosition: 'center center' }}
            />
          </div>

          {/* Space Mono UPPERCASE caption */}
          <div
            style={{
              marginTop: 'clamp(40px, 6vh, 80px)',
              maxWidth: '36ch',
            }}
          >
            <p
              className="font-mono uppercase text-[var(--color-mute)]"
              style={{
                fontSize: '11px',
                lineHeight: 1.55,
                letterSpacing: '0.04em',
                margin: 0,
              }}
            >
              A RADICAL OBJECT DESIGNED
              <br />
              BETWEEN SCULPTURE AND FUNCTION.
              <br />
              FOLDED FROM ONE CONTINUOUS
              <br />
              SHEET OF STAINLESS STEEL,
              <br />
              EXPLORES PERMANENCE, TENSION,
              <br />
              PRECISION AND RESTRAINT.
            </p>
            <p
              className="font-mono uppercase text-[var(--color-mute)]"
              style={{
                fontSize: '11px',
                lineHeight: 1.55,
                letterSpacing: '0.04em',
                marginTop: '1.2em',
                marginBottom: 0,
              }}
            >
              CRAFTED TO RESIST TIME —
              <br />
              BOTH PHYSICALLY AND AESTHETICALLY.
            </p>
          </div>

          {/* Bottom-right page indicator dot */}
          <div
            style={{
              width: '8px',
              height: '8px',
              backgroundColor: 'var(--color-ink)',
              marginTop: 'clamp(40px, 6vh, 80px)',
              flexShrink: 0,
            }}
          />
        </div>
      </div>
    </section>
  );
}
