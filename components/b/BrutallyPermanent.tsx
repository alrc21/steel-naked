import Image from 'next/image';

export function BrutallyPermanent() {
  return (
    <section
      id="brutally-permanent"
      data-dark="true"
      className="relative overflow-hidden"
      style={{ minHeight: '100svh' }}
    >
      {/* Full-bleed background photo */}
      <div className="absolute inset-0">
        <Image
          src="/images/bg05.webp"
          alt="Steel Naked chair — outdoor landscape"
          fill
          priority={false}
          sizes="100vw"
          className="object-cover"
        />
        {/* Dark scrim: gradient overlay so lime text reads cleanly */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.38), rgba(0,0,0,0.18))',
          }}
        />
      </div>

      {/* ─── Corner labels (absolute) ─── */}

      {/* Top-left: "Preview Texto_01" */}
      <p
        className="font-mono absolute hidden md:block"
        style={{
          top: 'calc(var(--topbar-h) + 20px)',
          left: 'var(--gutter)',
          fontSize: '11px',
          letterSpacing: '0.18em',
          lineHeight: 1,
          color: 'var(--color-accent)',
          margin: 0,
          textTransform: 'uppercase',
        }}
      >
        Preview Texto_01
      </p>

      {/* Top-right: "04 / 08" */}
      <p
        className="font-mono absolute hidden md:block"
        style={{
          top: 'calc(var(--topbar-h) + 20px)',
          right: 'var(--gutter)',
          fontSize: '11px',
          letterSpacing: '0.18em',
          lineHeight: 1,
          color: 'var(--color-accent)',
          margin: 0,
          textTransform: 'uppercase',
          textAlign: 'right',
        }}
      >
        04 / 08
      </p>

      {/* ─── Mobile: stacked layout ─── */}
      <div
        className="relative flex flex-col items-center justify-center md:hidden"
        style={{
          minHeight: '100svh',
          paddingTop: 'calc(var(--topbar-h) + 48px)',
          paddingBottom: 'var(--section-pad)',
          paddingLeft: 'var(--gutter)',
          paddingRight: 'var(--gutter)',
          gap: '32px',
        }}
      >
        {/* Mobile corner labels */}
        <p
          className="font-mono self-start"
          style={{
            fontSize: '10px',
            letterSpacing: '0.18em',
            lineHeight: 1,
            color: 'var(--color-accent)',
            margin: 0,
            textTransform: 'uppercase',
          }}
        >
          Preview Texto_01
        </p>

        {/* Mobile headline */}
        <h2
          className="font-display text-center"
          style={{
            fontSize: 'clamp(64px, 16vw, 120px)',
            fontWeight: 700,
            lineHeight: 0.92,
            letterSpacing: '-0.02em',
            color: 'var(--color-accent)',
            margin: 0,
          }}
        >
          Brutally
          <br />
          permanent
        </h2>

        {/* Mobile caption */}
        <p
          className="font-mono text-center"
          style={{
            fontSize: '12px',
            letterSpacing: '0.04em',
            lineHeight: 1.6,
            color: 'var(--color-accent)',
            maxWidth: '42ch',
            margin: 0,
          }}
        >
          Designed as an antidote to disposable culture,
          <br />
          an object made to survive trends, seasons
          <br />
          and obsolescence
        </p>

        <p
          className="font-mono self-end"
          style={{
            fontSize: '10px',
            letterSpacing: '0.18em',
            lineHeight: 1,
            color: 'var(--color-accent)',
            margin: 0,
            textTransform: 'uppercase',
          }}
        >
          04 / 08
        </p>
      </div>

      {/* ─── Desktop: absolute-positioned layout ─── */}

      {/* Center-left headline */}
      <h2
        className="font-display absolute hidden md:block"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          left: 'var(--gutter)',
          fontSize: 'clamp(64px, 10vw, 180px)',
          fontWeight: 700,
          lineHeight: 0.92,
          letterSpacing: '-0.02em',
          color: 'var(--color-accent)',
          margin: 0,
        }}
      >
        Brutally
        <br />
        permanent
      </h2>

      {/* Center-right caption */}
      <p
        className="font-mono absolute hidden md:block"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          right: 'var(--gutter)',
          fontSize: '12px',
          letterSpacing: '0.04em',
          lineHeight: 1.6,
          color: 'var(--color-accent)',
          maxWidth: '42ch',
          margin: 0,
          textAlign: 'right',
        }}
      >
        Designed as an antidote to disposable culture,
        <br />
        an object made to survive trends, seasons
        <br />
        and obsolescence
      </p>
    </section>
  );
}
