'use client';

import { useEffect, useState } from 'react';

export function Topbar() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const sections = document.querySelectorAll('[data-dark="true"]');
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setDark(true);
            return;
          }
        }
        setDark(false);
      },
      { threshold: [0.4] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 px-[var(--gutter)] py-5 transition-colors duration-500 ${
        dark ? 'text-[var(--color-paper)]' : 'text-[var(--color-ink)]'
      }`}
    >
      <div className="grid grid-cols-3 items-center text-[11px] font-sans tracking-[0.04em]">
        <nav className="flex gap-6 uppercase">
          <a href="#object">object</a>
          <a href="#studio">studio</a>
          <a href="#founders">founders</a>
        </nav>
        <div className="text-center font-display tracking-[-0.02em] text-[14px]">
          Steel Naked
        </div>
        <div className="text-right uppercase">EN</div>
      </div>
    </header>
  );
}
