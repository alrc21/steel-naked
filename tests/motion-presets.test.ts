import { describe, expect, it } from 'vitest';
import { fadeUp, staggerChildren, wordReveal } from '@/lib/motion-presets';

describe('motion-presets', () => {
  it('fadeUp returns variants with hidden y offset and visible y zero', () => {
    expect(fadeUp.hidden).toEqual({ opacity: 0, y: 28 });
    expect(fadeUp.visible).toMatchObject({ opacity: 1, y: 0 });
  });

  it('staggerChildren returns container variants with delayChildren and staggerChildren', () => {
    const variants = staggerChildren(0.08, 0.1);
    const visible = variants.visible as {
      transition: { delayChildren: number; staggerChildren: number };
    };
    expect(visible.transition.delayChildren).toBe(0.1);
    expect(visible.transition.staggerChildren).toBe(0.08);
  });

  it('wordReveal returns variants with translateY 110% hidden', () => {
    expect(wordReveal.hidden).toEqual({ y: '110%' });
    expect(wordReveal.visible).toMatchObject({ y: '0%' });
  });
});
