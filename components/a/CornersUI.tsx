'use client';

import { useEffect, useState } from 'react';

export function CornersUI() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(1, window.scrollY / h) : 0);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const stepNumber = Math.min(6, Math.max(1, Math.ceil(progress * 6) || 1));

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-40">
      <div className="absolute top-5 left-[var(--gutter)] font-mono uppercase text-[11px] tracking-[0.18em]">
        STEEL NAKED™
      </div>
      <nav className="pointer-events-auto absolute top-5 right-[var(--gutter)] font-mono uppercase text-[11px] tracking-[0.18em] flex gap-6">
        <a href="#object">object</a>
        <a href="#studio">studio</a>
        <a href="#founders">founders</a>
      </nav>
      <div className="absolute bottom-5 left-[var(--gutter)] font-mono uppercase text-[10px] tracking-[0.18em] text-[var(--color-mute)]">
        VLC · 39.4699° N
      </div>
      <div className="absolute bottom-5 right-[var(--gutter)] font-mono uppercase text-[10px] tracking-[0.18em] flex items-center gap-3">
        <span>0{stepNumber} / 06</span>
        <span className="relative inline-block h-px w-24 bg-[var(--color-ink)]/15 overflow-hidden">
          <span
            className="absolute inset-y-0 left-0 bg-[var(--color-ink)]"
            style={{ width: `${progress * 100}%` }}
          />
        </span>
      </div>
    </div>
  );
}
