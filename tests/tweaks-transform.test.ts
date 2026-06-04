import { describe, expect, it } from 'vitest';
import { composeTransform, alignToMargins } from '@/lib/tweaks/transform';

describe('composeTransform', () => {
  it('returns undefined when no transform fields are set', () => {
    expect(composeTransform({})).toBeUndefined();
  });

  it('emits translate with both axes', () => {
    expect(composeTransform({ translateX: '10px', translateY: '-4px' })).toBe(
      'translate(10px, -4px)',
    );
  });

  it('fills a missing axis with 0px', () => {
    expect(composeTransform({ translateX: '12px' })).toBe('translate(12px, 0px)');
    expect(composeTransform({ translateY: '12px' })).toBe('translate(0px, 12px)');
  });

  it('composes translate and scale together', () => {
    expect(composeTransform({ translateX: '8px', scale: 1.5 })).toBe(
      'translate(8px, 0px) scale(1.5)',
    );
  });

  it('emits scale alone', () => {
    expect(composeTransform({ scale: 2 })).toBe('scale(2)');
  });
});

describe('alignToMargins', () => {
  it('maps left/center/right to margin pairs', () => {
    expect(alignToMargins('left')).toEqual({ marginLeft: '0', marginRight: 'auto' });
    expect(alignToMargins('center')).toEqual({ marginLeft: 'auto', marginRight: 'auto' });
    expect(alignToMargins('right')).toEqual({ marginLeft: 'auto', marginRight: '0' });
  });
});
