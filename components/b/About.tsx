import Image from 'next/image';

export function About() {
  return (
    <section
      id="about"
      className="relative bg-[var(--color-paper)]"
      data-tweak-id="about-section"
      style={{
        minHeight: '100vh',
        paddingTop: 'var(--section-pad-tight)',
        paddingBottom: 'var(--section-pad-tight)',
        paddingLeft: 'var(--gutter)',
        paddingRight: 'var(--gutter)',
      }}
    >
      {/* Top-left absolutely-positioned label */}
      <p
        className="font-mono uppercase text-[var(--color-ink)] absolute"
        data-tweak-id="about-label"
        style={{
          top: 'calc(var(--topbar-h) + 20px)',
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
        className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 h-full"
        style={{ gap: 'var(--gutter)', minHeight: 'calc(100vh - var(--section-pad-tight) * 2)' }}
      >
        {/* LEFT — inline eyebrow + editorial headline, cols 1–7 */}
        <div
          className="md:col-span-7 flex flex-col justify-center"
        >
          {/* Eyebrow inline with headline as a single h2 */}
          <h2
            className="font-display text-[var(--color-ink)]"
            data-tweak-id="about-headline"
            style={{
              fontSize: 'clamp(40px, 5.5vw, 88px)',
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              margin: 0,
            }}
          >
            <span
              data-tweak-id="about-eyebrow"
              style={{
                fontSize: 'clamp(11px, 0.9vw, 14px)',
                fontWeight: 400,
                letterSpacing: '0.04em',
                color: 'var(--color-ink-2)',
                textTransform: 'lowercase',
                marginRight: '0.4em',
                verticalAlign: 'baseline',
                display: 'inline',
              }}
            >
              _about steel naked
            </span>
            Near-future seating
            <br />
            designed
            <br />
            for permanence.
          </h2>
        </div>

        {/* RIGHT — portrait chair image + caption, cols 9–12 */}
        <div
          className="md:col-span-4 md:col-start-9 flex flex-col justify-between items-start h-full"
        >
          {/* Vertical portrait chair image */}
          <div
            className="relative overflow-hidden"
            data-tweak-id="about-image"
            style={{
              width: '100%',
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
              maxWidth: '36ch',
            }}
          >
            <p
              className="font-mono uppercase text-[var(--color-mute)]"
              data-tweak-id="about-caption-1"
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
              data-tweak-id="about-caption-2"
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
        </div>
      </div>

      {/* Bottom-right page indicator dot — absolutely positioned */}
      <div
        data-tweak-id="about-indicator"
        style={{
          position: 'absolute',
          bottom: 'var(--section-pad-tight)',
          right: 'var(--gutter)',
          width: '8px',
          height: '8px',
          backgroundColor: 'var(--color-ink)',
          flexShrink: 0,
        }}
      />
    </section>
  );
}
