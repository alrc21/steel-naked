import { describe, expect, it } from 'vitest';
import { tweaksToStyleBlock } from '@/lib/tweaks/tweak-to-css';

describe('tweaksToStyleBlock', () => {
  it('returns empty string for an empty tweak', () => {
    expect(tweaksToStyleBlock({ el: {} })).toBe('');
  });

  it('renders existing typography fields', () => {
    const css = tweaksToStyleBlock({ el: { fontSize: '20px' } });
    expect(css).toContain('[data-tweak-id="el"]');
    expect(css).toContain('font-size: 20px !important;');
  });

  it('renders max-width and opacity', () => {
    const css = tweaksToStyleBlock({ el: { maxWidth: '640px', opacity: 0.5 } });
    expect(css).toContain('max-width: 640px !important;');
    expect(css).toContain('opacity: 0.5 !important;');
  });

  it('renders block align as margin pair', () => {
    const css = tweaksToStyleBlock({ el: { align: 'center' } });
    expect(css).toContain('margin-left: auto !important;');
    expect(css).toContain('margin-right: auto !important;');
  });

  it('composes transform from translate + scale', () => {
    const css = tweaksToStyleBlock({ el: { translateX: '10px', scale: 1.2 } });
    expect(css).toContain('transform: translate(10px, 0px) scale(1.2) !important;');
  });
});
