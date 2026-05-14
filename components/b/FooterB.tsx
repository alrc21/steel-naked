export function FooterB() {
  return (
    <footer data-dark="true" className="bg-[var(--color-ink)] text-[var(--color-paper)] px-[var(--gutter)] pb-12 pt-24 border-t border-[var(--color-paper)]/10">
      <div className="max-w-[1400px] mx-auto">
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
          <div className="font-display italic text-[var(--color-paper)] text-[20px]">
            Near-future. Brutally permanent.
          </div>
          <div className="font-mono uppercase text-[10px] tracking-[0.18em] text-[var(--color-paper)]/50">
            ©2026 Steel Naked™ · Valencia, Spain
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="font-mono uppercase text-[10px] tracking-[0.18em] text-[var(--color-paper)]/50 mb-2">
        {heading}
      </div>
      <div className="font-sans text-[13px] text-[var(--color-paper)]/80 flex flex-col gap-2">
        {children}
      </div>
    </div>
  );
}
