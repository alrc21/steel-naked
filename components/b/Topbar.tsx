'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export function Topbar() {
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sections = document.querySelectorAll('[data-dark="true"]');

    const observer =
      sections.length > 0
        ? new IntersectionObserver(
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
          )
        : null;

    if (observer) sections.forEach((s) => observer.observe(s));

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 0);
        ticking = false;
      });
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer?.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 inset-x-0 z-50 px-[var(--gutter)] flex items-center ${
        dark
          ? 'text-[var(--color-paper-2)] bg-[var(--color-ink)]'
          : 'text-[var(--color-ink)] bg-[var(--color-paper)]'
      } ${
        scrolled
          ? dark
            ? 'border-b border-[rgba(255,247,212,0.12)]'
            : 'border-b border-[var(--color-rule)]'
          : ''
      }`}
      style={{
        height: 'var(--topbar-h)',
        transition:
          'background-color 320ms var(--ease-editorial, cubic-bezier(0.4,0,0.2,1)), color 320ms var(--ease-editorial, cubic-bezier(0.4,0,0.2,1))',
      }}
    >
      <div className="grid grid-cols-3 items-center w-full">
        <div className="flex items-center">
          <a href="#top" aria-label="Steel Naked — home" className="inline-flex items-center">
            <Image
              src="/images/logo.svg"
              alt=""
              width={110}
              height={32}
              priority
              className="h-6 md:h-8 w-auto"
              style={{
                filter: dark ? 'invert(1)' : 'none',
                transition: 'filter 320ms var(--ease-editorial, cubic-bezier(0.4,0,0.2,1))',
              }}
            />
          </a>
        </div>
        <nav
          aria-label="Primary"
          className="hidden md:block text-center font-mono uppercase text-[11px] tracking-[0.18em]"
        >
          <ul
            role="list"
            className="inline-flex items-center gap-0"
          >
            <li><a href="#about" className="hover:opacity-60 transition-opacity duration-200">Concept</a></li>
            <li className="mx-2 opacity-40">—</li>
            <li><a href="#object" className="hover:opacity-60 transition-opacity duration-200">Object</a></li>
            <li className="mx-2 opacity-40">—</li>
            <li><a href="#materiality" className="hover:opacity-60 transition-opacity duration-200">Philosophy</a></li>
            <li className="mx-2 opacity-40">—</li>
            <li><a href="#studio" className="hover:opacity-60 transition-opacity duration-200">Contact</a></li>
          </ul>
        </nav>
        <div className="text-right font-mono uppercase text-[11px] tracking-[0.18em] hidden sm:block">EN</div>
      </div>
    </header>
  );
}
