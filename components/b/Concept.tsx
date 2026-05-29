/**
 * Concept — Page 03
 * Editorial section: "One sheet. One gesture. One object."
 * Server Component — no motion, no client boundary.
 *
 * Layout: 12-col grid, desktop only.
 *   – Cols 1–8 : headline block (Graphik Wide Semibold + inline eyebrow)
 *   – Cols 10–12: Space Mono uppercase caption, vertically centered with headline
 */

export function Concept() {
  return (
    <section
      id="concept"
      className="relative min-h-screen py-[var(--section-pad-tight)] px-[var(--gutter)] bg-[var(--color-paper)]"
      data-tweak-id="concept-section"
    >
      {/* ── 12-col grid, vertically centered ── */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-12 min-h-[calc(100vh-2*var(--section-pad-tight))]">

        {/* ── Left: Headline block (cols 1–8) ── */}
        <div className="md:col-span-8 self-center">

          {/* Eyebrow inline with headline */}
          <h2
            className="font-display text-[var(--color-ink)]"
            data-tweak-id="concept-headline"
            style={{
              fontSize: 'clamp(40px, 5.5vw, 88px)',
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              margin: 0,
            }}
          >
            <span
              data-tweak-id="concept-eyebrow"
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
              _the concept
            </span>
            One sheet. One gesture.<br />
            One object.
          </h2>
        </div>

        {/* ── Right: Space Mono caption block (cols 10–12), vertically centered ── */}
        <div className="md:col-span-3 md:col-start-10 self-end pb-[clamp(40px,8vh,120px)]">
          <p
            className="font-mono uppercase text-[var(--color-mute)]"
            data-tweak-id="concept-caption"
            style={{
              fontSize: '11px',
              lineHeight: 1.55,
              letterSpacing: '0.04em',
              maxWidth: '36ch',
            }}
          >
            BUILT FROM A SINGLE FOLDED SHEET<br />
            OF STAINLESS STEEL,<br />
            TRANSFORMING INDUSTRIAL MATERIAL<br />
            INTO A COLLECTIBLE SEATING OBJECT.<br />
            THE STRUCTURE IS REDUCED TO<br />
            ITS PUREST EXPRESSION:<br />
            A CONTINUOUS LINE<br />
            SHAPED THROUGH PRECISION<br />
            BENDING, TENSION AND BALANCE.
          </p>
        </div>

      </div>
    </section>
  );
}
