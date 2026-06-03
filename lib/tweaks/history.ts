import type { TweaksData } from './types';

export type History = {
  past: TweaksData[];
  present: TweaksData;
  future: TweaksData[];
};

const MAX = 50;

export function initHistory(present: TweaksData): History {
  return { past: [], present, future: [] };
}

export function commit(h: History, next: TweaksData): History {
  return {
    past: [...h.past, h.present].slice(-MAX),
    present: next,
    future: [],
  };
}

export function undo(h: History): History {
  if (h.past.length === 0) return h;
  const previous = h.past[h.past.length - 1]!;
  return {
    past: h.past.slice(0, -1),
    present: previous,
    future: [h.present, ...h.future].slice(0, MAX),
  };
}

export function redo(h: History): History {
  if (h.future.length === 0) return h;
  const next = h.future[0]!;
  return {
    past: [...h.past, h.present].slice(-MAX),
    present: next,
    future: h.future.slice(1),
  };
}

export function canUndo(h: History): boolean {
  return h.past.length > 0;
}

export function canRedo(h: History): boolean {
  return h.future.length > 0;
}
