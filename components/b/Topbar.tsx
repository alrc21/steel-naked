'use client';

import Image from 'next/image';
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
      className={`sticky top-0 inset-x-0 z-50 px-[var(--gutter)] h-14 md:h-16 flex items-center transition-colors duration-500 ${
        dark
          ? 'text-[var(--color-paper)] bg-[var(--color-stone)]'
          : 'text-[var(--color-ink)] bg-[var(--color-paper)]'
      } ${scrolled ? 'border-b border-[var(--color-rule)]' : ''}`}
    >
      <div className="grid grid-cols-3 items-center w-full">
        <div className="flex items-center">
          <a href="#top" aria-label="Steel Naked — home" className="inline-flex items-center">
            <Image
              src="/images/logo.svg"
              alt="Steel Naked"
              width={110}
              height={32}
              priority
              className="h-6 md:h-8 w-auto"
              style={{
                filter: dark ? 'invert(1)' : 'none',
                transition: 'filter 0.5s',
              }}
            />
          </a>
        </div>
        <nav className="hidden md:block text-center text-[15px] md:text-[16px] font-normal tracking-[0]">
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
        <div className="text-right uppercase text-[12px] md:text-[13px]">EN</div>
      </div>
    </header>
  );
}
