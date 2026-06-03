import { describe, expect, it } from 'vitest';
import {
  initHistory,
  commit,
  undo,
  redo,
  canUndo,
  canRedo,
} from '@/lib/tweaks/history';

describe('history reducer', () => {
  it('starts empty', () => {
    const h = initHistory({});
    expect(canUndo(h)).toBe(false);
    expect(canRedo(h)).toBe(false);
    expect(h.present).toEqual({});
  });

  it('commit moves present to past and clears future', () => {
    let h = initHistory({});
    h = commit(h, { a: { fontSize: '10px' } });
    expect(h.present).toEqual({ a: { fontSize: '10px' } });
    expect(canUndo(h)).toBe(true);
    expect(canRedo(h)).toBe(false);
  });

  it('undo restores the previous present and enables redo', () => {
    let h = initHistory({});
    h = commit(h, { a: { fontSize: '10px' } });
    h = commit(h, { a: { fontSize: '20px' } });
    h = undo(h);
    expect(h.present).toEqual({ a: { fontSize: '10px' } });
    expect(canRedo(h)).toBe(true);
  });

  it('redo re-applies the undone present', () => {
    let h = initHistory({});
    h = commit(h, { a: { fontSize: '10px' } });
    h = commit(h, { a: { fontSize: '20px' } });
    h = redo(undo(h));
    expect(h.present).toEqual({ a: { fontSize: '20px' } });
  });

  it('a new commit after undo discards the redo branch', () => {
    let h = initHistory({});
    h = commit(h, { a: { fontSize: '10px' } });
    h = commit(h, { a: { fontSize: '20px' } });
    h = undo(h);
    h = commit(h, { a: { fontSize: '30px' } });
    expect(canRedo(h)).toBe(false);
    expect(h.present).toEqual({ a: { fontSize: '30px' } });
  });

  it('undo/redo are no-ops at the ends', () => {
    const h = initHistory({ a: {} });
    expect(undo(h)).toBe(h);
    expect(redo(h)).toBe(h);
  });
});
