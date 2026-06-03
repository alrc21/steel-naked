'use client';

export function FooterB() {
  return (
    <footer
      data-dark="true"
      className="relative overflow-hidden bg-[var(--color-dark)] text-[var(--color-paper)] px-[var(--gutter)] pb-12 pt-24 border-t"
      data-tweak-id="footer-section"
      style={{ contain: 'paint', borderColor: 'rgba(255, 247, 212, 0.10)' }}
    >
      <div className="relative z-10 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-12 gap-8 mb-16 items-end">
          {/* Left column — wordmark + address as poetry */}
          <div className="col-span-12 md:col-span-7 flex flex-col gap-6">
            <div
              className="font-display text-[var(--color-paper-2)] tracking-[-0.02em] leading-[1.05] font-medium"
              style={{ fontSize: 'var(--text-display-sm)' }}
            >
              Steel Naked™
            </div>
            <div className="font-sans text-[14px] text-[var(--color-paper)] leading-[1.5]">
              <div>Designed and crafted in</div>
              <div>Valencia, Spain.</div>
            </div>
          </div>

          {/* Right column — inline metadata line, mono (machine-readable) */}
          <div className="col-span-12 md:col-span-5 md:text-right">
            <div
              className="font-mono uppercase text-[11px] tracking-[0.16em] text-[var(--color-paper)] leading-[1.8] flex flex-wrap md:justify-end gap-x-2"
              data-tweak-id="footer-links"
            >
              <a href="#object" className="transition-colors duration-300 hover:text-[var(--color-accent)]">Object</a>
              <span aria-hidden className="text-[var(--color-stone)]">·</span>
              <a href="#founders" className="transition-colors duration-300 hover:text-[var(--color-accent)]">Founders</a>
              <span aria-hidden className="text-[var(--color-stone)]">·</span>
              <a href="mailto:hello@steelnaked.com" className="transition-colors duration-300 hover:text-[var(--color-accent)]">
                hello@steelnaked.com
              </a>
              <span aria-hidden className="text-[var(--color-stone)]">·</span>
              <span aria-disabled="true" className="text-[var(--color-mute)] cursor-default">Imprint</span>
              <span aria-hidden className="text-[var(--color-stone)]">·</span>
              <span aria-disabled="true" className="text-[var(--color-mute)] cursor-default">Privacy</span>
            </div>
          </div>
        </div>

        <div
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-8 border-t"
          style={{ borderColor: 'rgba(255, 247, 212, 0.10)' }}
        >
          <div
            className="font-sans uppercase text-[var(--color-paper)] text-[13px] md:text-[14px] font-medium"
            data-tweak-id="footer-tagline"
          >
            NEAR-FUTURE. BRUTALLY PERMANENT.
          </div>
          <div className="font-mono uppercase text-[10px] tracking-[0.18em] text-[var(--color-steel)]">
            ©2026 Steel Naked™ · Valencia, Spain
          </div>
        </div>
      </div>

      <div
        aria-hidden
        data-tweak-id="footer-logomark"
        className="absolute left-0 right-0 flex justify-center pointer-events-none"
        style={{ bottom: '-32%' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo.svg"
          alt=""
          aria-hidden
          style={{
            width: 'clamp(420px, 92vw, 1280px)',
            maxWidth: 'none',
            height: 'auto',
            opacity: 0.12,
            filter: 'brightness(0) invert(1)',
          }}
        />
      </div>
    </footer>
  );
}
