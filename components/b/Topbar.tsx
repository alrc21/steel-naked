'use client';

import { useEffect, useState } from 'react';

export function Topbar() {
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
      { threshold: [0.3] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 px-[var(--gutter)] py-4 transition-colors duration-500 ${
        dark ? 'text-[var(--color-paper)]' : 'text-[var(--color-ink)]'
      } ${scrolled ? 'border-b border-[var(--color-rule)]' : ''}`}
    >
      <div className="grid grid-cols-3 items-center">
        <div
          className="text-[13px] font-bold tracking-[0]"
          style={{ fontFamily: 'var(--font-wordmark, var(--font-display))' }}
        >
          STEEL NAKED
        </div>
        <nav className="text-center text-[12px] font-normal">
          <a href="#about">About</a>
          <span>, </span>
          <a href="#object">Object</a>
          <span>, </span>
          <a href="#materiality">Materiality</a>
          <span>, </span>
          <a href="#studio">Studio</a>
          <span>, </span>
          <a href="#founders">Founders</a>
        </nav>
        <div className="text-right uppercase text-[11px]">EN</div>
      </div>
    </header>
  );
}
