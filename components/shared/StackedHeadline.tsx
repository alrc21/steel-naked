'use client';

import { motion } from 'motion/react';
import type { CSSProperties } from 'react';
import { lineReveal, staggerChildren } from '@/lib/motion-presets';

type StackedHeadlineProps = {
  lines: readonly string[];
  className?: string;
  style?: CSSProperties;
  as?: 'h1' | 'h2' | 'h3';
  amount?: number;
  'data-tweak-id'?: string;
};

/**
 * Headline that reveals line-by-line. Each line is a clipping mask
 * containing a child that translates from y:100% → y:0%.
 * Stagger 60ms between lines, ease editorial, 800ms duration.
 *
 * Descender room: wrapper has padding-bottom + negative margin so that
 * glyph descenders (g, p, y, j, q) are not clipped by overflow:hidden,
 * while the visual line position remains unchanged.
 */
export function StackedHeadline({
  lines,
  className,
  style,
  as = 'h2',
  amount = 0.4,
  'data-tweak-id': dataTweakId,
}: StackedHeadlineProps) {
  const Tag =
    as === 'h1' ? motion.h1 : as === 'h3' ? motion.h3 : motion.h2;
  const container = staggerChildren(0.06, 0);

  return (
    <Tag
      className={className}
      data-tweak-id={dataTweakId}
      style={style}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
    >
      {lines.map((line, i) => (
        <span
          key={i}
          style={{
            display: 'block',
            overflow: 'hidden',
            paddingBottom: '0.18em',
            marginBottom: '-0.12em',
          }}
        >
          <motion.span
            style={{ display: 'block', willChange: 'transform' }}
            variants={lineReveal}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
