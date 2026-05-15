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
      className={`sticky top-0 inset-x-0 z-50 px-[var(--gutter)] flex items-center transition-colors duration-500 ${
        dark
          ? 'text-[var(--color-paper)] bg-[var(--color-stone)]'
          : 'text-[var(--color-ink)] bg-[var(--color-paper)]'
      } ${scrolled ? 'border-b border-[var(--color-rule)]' : ''}`}
      style={{ height: 'var(--topbar-h)' }}
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
                transition: 'filter 0.5s',
              }}
            />
          </a>
        </div>
        <nav
          aria-label="Primary"
          className="hidden md:block text-center text-[15px] md:text-[16px] font-normal tracking-[0]"
        >
          <ul
            role="list"
            className="inline-flex gap-1 [&>li:not(:last-child)]:after:content-[','] [&>li:not(:last-child)]:after:mr-1"
          >
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#object">Object</a>
            </li>
            <li>
              <a href="#materiality">Materiality</a>
            </li>
            <li>
              <a href="#studio">Studio</a>
            </li>
            <li>
              <a href="#founders">Founders</a>
            </li>
          </ul>
        </nav>
        <div className="text-right uppercase text-[12px] md:text-[13px] hidden sm:block">EN</div>
      </div>
    </header>
  );
}
