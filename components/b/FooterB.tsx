'use client';

import { motion } from 'motion/react';
import { EASE_EDITORIAL } from '@/lib/motion-presets';

export function FooterB() {
  return (
    <footer
      data-dark="true"
      className="relative overflow-hidden bg-[var(--color-stone)] text-[var(--color-paper)] px-[var(--gutter)] pb-12 pt-24 border-t border-[var(--color-paper)]/10"
      style={{ contain: 'paint' }}
    >
      <div className="relative z-10 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-12 gap-8 mb-16 items-end">
          {/* Left column — wordmark + address as poetry */}
          <div className="col-span-12 md:col-span-7 flex flex-col gap-6">
            <div
              className="font-display text-[var(--color-paper)] tracking-[-0.02em] leading-[1.05] font-medium"
              style={{ fontSize: 'var(--text-display-sm)' }}
            >
              Steel Naked™
            </div>
            <div className="font-sans text-[14px] text-[var(--color-paper)]/85 leading-[1.5]">
              <div>Designed and crafted in</div>
              <div>Valencia, Spain.</div>
            </div>
          </div>

          {/* Right column — inline metadata line, mono (machine-readable) */}
          <div className="col-span-12 md:col-span-5 md:text-right">
            <div className="font-mono uppercase text-[11px] tracking-[0.16em] text-[var(--color-paper)]/85 leading-[1.8] flex flex-wrap md:justify-end gap-x-2">
              <a href="#object" className="hover:text-[var(--color-paper)]">Object</a>
              <span aria-hidden>·</span>
              <a href="#founders" className="hover:text-[var(--color-paper)]">Founders</a>
              <span aria-hidden>·</span>
              <a href="mailto:hello@steelnaked.com" className="hover:text-[var(--color-paper)]">
                hello@steelnaked.com
              </a>
              <span aria-hidden>·</span>
              <span aria-disabled="true" className="opacity-60 cursor-default">Imprint</span>
              <span aria-hidden>·</span>
              <span aria-disabled="true" className="opacity-60 cursor-default">Privacy</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-8 border-t border-[var(--color-paper)]/10">
          <div className="font-sans uppercase text-[var(--color-paper)] text-[13px] md:text-[14px] font-medium">
            NEAR-FUTURE. BRUTALLY PERMANENT.
          </div>
          <div className="font-mono uppercase text-[10px] tracking-[0.18em] text-[var(--color-paper)]/85">
            ©2026 Steel Naked™ · Valencia, Spain
          </div>
        </div>
      </div>

      <motion.div
        aria-hidden
        className="absolute pointer-events-none"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 0.12, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.2, ease: EASE_EDITORIAL }}
        style={{
          left: 0,
          right: 0,
          bottom: '-28%',
          fontFamily: 'var(--font-wordmark, var(--font-display))',
          fontWeight: 800,
          fontSize: 'clamp(120px, 24vw, 360px)',
          color: 'var(--color-ink)',
          whiteSpace: 'nowrap',
          lineHeight: 1,
          textAlign: 'center',
          willChange: 'transform',
        }}
      >
        STEEL NAKED
      </motion.div>
    </footer>
  );
}
