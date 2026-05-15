'use client';

import Image from 'next/image';

const studies = [
  {
    back: '/images/bg04.webp',
    front: '/images/bg01.webp',
    label: 'LOUNGE',
    descr:
      'The Brutalist Recline — a single fold defines back and seat. Tension and curvature held by 2.5mm of 304 stainless.',
  },
  {
    back: '/images/bg05.webp',
    front: '/images/bg02.webp',
    label: 'MARK',
    descr:
      'A grounded gesture. A heavier presence. Reads as monolith from afar; geometry on approach.',
  },
  {
    back: '/images/bg06.webp',
    front: '/images/bg03.webp',
    label: 'PLATE',
    descr:
      'The original study. One continuous sheet, folded to support the body without joinery or fasteners.',
  },
] as const;

export function ThreeStudies() {
  return (
    <div id="object">
      <section className="py-[var(--section-pad)] px-[var(--gutter)] bg-[var(--color-paper)]">
        <div className="max-w-[1400px] mx-auto">
          <div className="font-mono uppercase text-[11px] tracking-[0.18em] text-[var(--color-mute)] mb-6">
            [ THREE STUDIES _03 ]
          </div>
          <p className="font-sans text-[15px] leading-[1.5] text-[var(--color-ink-2)] max-w-[60ch]">
            An object that feels both brutal and refined. Architectural yet sensual. Cold material made human through form.
          </p>
        </div>
      </section>

      {studies.map((s, i) => (
        <StudyPane key={s.label} s={s} i={i} />
      ))}
    </div>
  );
}

type StudyType = (typeof studies)[number];

function StudyPane({ s, i }: { s: StudyType; i: number }) {
  return (
    <section
      className="relative overflow-hidden bg-[var(--color-ink)] group"
      style={{ position: 'sticky', top: 0, height: '100vh' }}
    >
      <div
        className="absolute"
        style={{
          inset: '-10%',
          transform: `rotate(${i % 2 === 0 ? -6 : 5}deg) scale(1.3)`,
          opacity: 0.95,
        }}
      >
        <Image
          src={s.back}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div
        className="absolute overflow-hidden"
        style={{
          left: '50%',
          top: '50%',
          translate: '-50% -50%',
          width: '40vw',
          height: '60vh',
        }}
      >
        <Image
          src={s.front}
          alt={s.label}
          fill
          sizes="40vw"
          className="object-cover"
        />
      </div>

      <div
        className="absolute text-[var(--color-paper)] font-sans text-[12px] font-medium uppercase"
        style={{
          left: 'clamp(20px, 3vw, 56px)',
          top: '50%',
          transform: 'translateY(-50%) rotate(-90deg)',
          transformOrigin: 'left center',
          letterSpacing: '0.04em',
        }}
      >
        [ {s.label} ]
      </div>

      <div
        className="absolute left-1/2 -translate-x-1/2 text-center text-[var(--color-paper)] font-sans"
        style={{
          bottom: '8vh',
          fontSize: '15px',
          maxWidth: '60ch',
          lineHeight: 1.5,
        }}
      >
        <span className="relative inline-block pb-1">
          {s.descr}
          <span
            className="absolute left-0 bottom-0 h-px bg-[var(--color-paper)] transition-[width] duration-700 ease-[var(--ease-editorial)]"
            style={{ width: 0 }}
            data-underline
          />
        </span>
      </div>

      <style jsx>{`
        .group:hover :global([data-underline]) {
          width: 100%;
        }
      `}</style>
    </section>
  );
}
