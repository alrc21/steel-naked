/**
 * Concept — Page 03
 * Editorial section: "One sheet. One gesture. One object."
 * Server Component — no motion, no client boundary.
 *
 * Layout: 12-col grid, desktop only.
 *   – Cols 1–8 : headline block (Graphik Wide Semibold + inline eyebrow)
 *   – Cols 10–12: Space Mono uppercase caption, top-aligned ~55% from top
 */

export function Concept() {
  return (
    <section
      id="concept"
      className="relative min-h-screen py-[var(--section-pad-generous)] px-[var(--gutter)] bg-[var(--color-paper)]"
    >
      {/* ── Section eyebrow – top-left, Space Mono, matches topbar convention ── */}
      <p
        className="absolute font-mono uppercase text-[var(--color-ink)] tracking-[0.18em]"
        style={{
          fontSize: '11px',
          top: 'calc(var(--topbar-h) + 24px)',
          left: 'var(--gutter)',
          letterSpacing: '0.18em',
        }}
      >
        _THE OBJECT / 03
      </p>

      {/* ── 12-col grid ── */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-16">

        {/* ── Left: Headline block (cols 1–8) ── */}
        <div className="md:col-span-8 flex flex-col justify-start">

          {/* Inline eyebrow: Graphik Wide Regular, lowercase, mute */}
          <p
            className="font-display lowercase text-[var(--color-mute)]"
            style={{ fontSize: '11px', letterSpacing: '0.18em', marginBottom: '0.6em' }}
          >
            _the concept
          </p>

          {/* Massive headline — Graphik Wide Semibold 600 */}
          <h2
            className="font-display text-[var(--color-ink)]"
            style={{
              fontSize: 'clamp(40px, 5.5vw, 88px)',
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
            }}
          >
            <span style={{ display: 'block' }}>One sheet. One gesture.</span>
            <span style={{ display: 'block' }}>One object.</span>
          </h2>
        </div>

        {/* ── Right: Space Mono caption block (cols 10–12), positioned ~55% from top ── */}
        <div
          className="md:col-span-3 md:col-start-10 flex flex-col justify-start"
          style={{ paddingTop: 'clamp(0px, 10vh, 120px)' }}
        >
          <p
            className="font-mono uppercase text-[var(--color-mute)]"
            style={{
              fontSize: '11px',
              lineHeight: 1.55,
              letterSpacing: '0.04em',
              maxWidth: '36ch',
            }}
          >
            BUILT FROM A SINGLE FOLDED SHEET
            OF STAINLESS STEEL,
            TRANSFORMING INDUSTRIAL MATERIAL
            INTO A COLLECTIBLE SEATING OBJECT.
            THE STRUCTURE IS REDUCED TO
            ITS PUREST EXPRESSION:
            A CONTINUOUS LINE
            SHAPED THROUGH PRECISION
            BENDING, TENSION AND BALANCE.
          </p>
        </div>

      </div>
    </section>
  );
}
