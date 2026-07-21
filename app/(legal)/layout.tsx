import Link from 'next/link';
import type { ReactNode } from 'react';

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)] px-[var(--gutter)] py-16 md:py-24">
      <div className="mx-auto max-w-[680px]">
        <Link
          href="/"
          className="font-mono uppercase text-[11px] tracking-[0.16em] text-[var(--color-mute)] transition-colors hover:text-[var(--color-ink)]"
        >
          ← Steel Naked
        </Link>
        <div className="legal-prose mt-10">{children}</div>
        <footer className="mt-20 border-t border-[var(--color-rule)] pt-8 font-mono uppercase text-[10px] tracking-[0.18em] text-[var(--color-mute)]">
          ©2026 Steel Naked™ · Valencia, Spain
        </footer>
      </div>
    </main>
  );
}
