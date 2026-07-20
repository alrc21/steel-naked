import { describe, expect, it } from 'vitest';
import { moveStep, settingText, type PhotoStep } from '@/lib/arranger';

const s = (bg: string): PhotoStep => ({ bg, portrait: `${bg}-p` });
const list = [s('a'), s('b'), s('c')];

describe('moveStep', () => {
  it('moves an item up', () => {
    expect(moveStep(list, 1, -1).map((x) => x.bg)).toEqual(['b', 'a', 'c']);
  });
  it('moves an item down', () => {
    expect(moveStep(list, 0, 1).map((x) => x.bg)).toEqual(['b', 'a', 'c']);
  });
  it('is a no-op past the edges', () => {
    expect(moveStep(list, 0, -1)).toBe(list);
    expect(moveStep(list, 2, 1)).toBe(list);
  });
  it('does not mutate the input', () => {
    moveStep(list, 1, -1);
    expect(list.map((x) => x.bg)).toEqual(['a', 'b', 'c']);
  });
});

describe('settingText', () => {
  it('emits ordered bg/portrait pairs as JSON', () => {
    expect(JSON.parse(settingText([s('a')]))).toEqual([{ bg: 'a', portrait: 'a-p' }]);
  });
});
