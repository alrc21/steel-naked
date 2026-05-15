export function FooterB() {
  return (
    <footer
      data-dark="true"
      className="relative overflow-hidden bg-[var(--color-stone)] text-[var(--color-paper)] px-[var(--gutter)] pb-12 pt-24 border-t border-[var(--color-paper)]/10"
    >
      <div className="relative z-10 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <FooterCol heading="Info">
            <p>Steel Naked™</p>
            <p>Valencia, Spain</p>
          </FooterCol>
          <FooterCol heading="Object">
            <a href="#object">The Folded Plate</a>
            <a href="#object">The Mark</a>
            <a href="#object">Lounge No. 1</a>
          </FooterCol>
          <FooterCol heading="Connect">
            <a href="#founders">Founder list</a>
            <a href="mailto:hello@steelnaked.com">hello@steelnaked.com</a>
          </FooterCol>
          <FooterCol heading="Legal">
            <a href="#">Imprint</a>
            <a href="#">Privacy</a>
          </FooterCol>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-8 border-t border-[var(--color-paper)]/10">
          <div className="font-sans uppercase text-[var(--color-paper)] text-[13px] md:text-[14px] font-medium">
            NEAR-FUTURE. BRUTALLY PERMANENT.
          </div>
          <div className="font-mono uppercase text-[10px] tracking-[0.18em] text-[var(--color-paper)]/60">
            ©2026 Steel Naked™ · Valencia, Spain
          </div>
        </div>
      </div>
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          left: 0,
          right: 0,
          bottom: '-28%',
          fontFamily: 'var(--font-wordmark, var(--font-display))',
          fontWeight: 800,
          fontSize: 'clamp(120px, 24vw, 360px)',
          color: 'var(--color-ink)',
          opacity: 0.12,
          whiteSpace: 'nowrap',
          lineHeight: 1,
          textAlign: 'center',
        }}
      >
        STEEL NAKED
      </div>
    </footer>
  );
}

function FooterCol({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="font-mono uppercase text-[10px] tracking-[0.18em] text-[var(--color-paper)]/60 mb-2">
        {heading}
      </div>
      <div className="font-sans text-[13px] text-[var(--color-paper)]/85 flex flex-col gap-2">
        {children}
      </div>
    </div>
  );
}
