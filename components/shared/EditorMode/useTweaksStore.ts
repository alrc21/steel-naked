'use client';

import { useEffect, useState } from 'react';
import type { Tweak, TweaksData } from '@/lib/tweaks/types';
import { alignToMargins, composeTransform } from '@/lib/tweaks/transform';
import {
  canRedo,
  canUndo,
  commit,
  redo as historyRedo,
  undo as historyUndo,
} from '@/lib/tweaks/history';

type StoreState = {
  editorMode: boolean;
  selectedId: string | null;
  hoveredId: string | null;
  tweaks: TweaksData;
  past: TweaksData[];
  future: TweaksData[];
  canvasNonce: number;
};

type Listener = () => void;

declare global {
  interface Window {
    __SN_TWEAKS__?: TweaksData;
  }
}

const listeners = new Set<Listener>();

const state: StoreState = {
  editorMode: false,
  selectedId: null,
  hoveredId: null,
  tweaks: {},
  past: [],
  future: [],
  canvasNonce: 0,
};

let canvasDoc: Document | null = null;

function getCanvasDoc(): Document | null {
  // Only ever the iframe canvas document. Never fall back to the parent
  // `document` — canvas DOM ops must not touch the host page.
  return canvasDoc;
}

let hydrated = false;

function hydrate() {
  if (hydrated) return;
  hydrated = true;
  if (typeof window !== 'undefined' && window.__SN_TWEAKS__) {
    state.tweaks = { ...window.__SN_TWEAKS__ };
  }
}

function notify() {
  for (const l of listeners) l();
}

function applyToElement(id: string, tweak: Tweak) {
  const doc = getCanvasDoc();
  if (!doc) return;
  const el = doc.querySelector(`[data-tweak-id="${id}"]`) as HTMLElement | null;
  if (!el) return;
  if (tweak.fontSize !== undefined) el.style.fontSize = tweak.fontSize;
  if (tweak.fontWeight !== undefined) el.style.fontWeight = String(tweak.fontWeight);
  if (tweak.letterSpacing !== undefined) el.style.letterSpacing = tweak.letterSpacing;
  if (tweak.lineHeight !== undefined) el.style.lineHeight = String(tweak.lineHeight);
  if (tweak.fontFamily !== undefined) el.style.fontFamily = `var(--font-${tweak.fontFamily})`;
  if (tweak.marginTop !== undefined) el.style.marginTop = tweak.marginTop;
  if (tweak.marginBottom !== undefined) el.style.marginBottom = tweak.marginBottom;
  if (tweak.paddingTop !== undefined) el.style.paddingTop = tweak.paddingTop;
  if (tweak.paddingBottom !== undefined) el.style.paddingBottom = tweak.paddingBottom;
  if (tweak.textAlign !== undefined) el.style.textAlign = tweak.textAlign;
  if (tweak.color !== undefined) el.style.color = `var(--color-${tweak.color})`;
  if (tweak.maxWidth !== undefined) el.style.maxWidth = tweak.maxWidth;
  if (tweak.opacity !== undefined) el.style.opacity = String(tweak.opacity);
  if (tweak.align !== undefined) {
    const m = alignToMargins(tweak.align);
    el.style.marginLeft = m.marginLeft;
    el.style.marginRight = m.marginRight;
  }
  const transform = composeTransform(tweak);
  if (transform !== undefined) el.style.transform = transform;
}

function clearElementStyles(id: string) {
  const doc = getCanvasDoc();
  if (!doc) return;
  const el = doc.querySelector(`[data-tweak-id="${id}"]`) as HTMLElement | null;
  if (!el) return;
  const props: ReadonlyArray<keyof CSSStyleDeclaration> = [
    'fontSize',
    'fontWeight',
    'letterSpacing',
    'lineHeight',
    'fontFamily',
    'marginTop',
    'marginBottom',
    'paddingTop',
    'paddingBottom',
    'textAlign',
    'color',
    'maxWidth',
    'opacity',
    'marginLeft',
    'marginRight',
    'transform',
  ];
  for (const p of props) {
    (el.style as unknown as Record<string, string>)[p as string] = '';
  }
}

function reapplyAll() {
  for (const [id, tweak] of Object.entries(state.tweaks)) applyToElement(id, tweak);
}

function setPresent(prev: TweaksData, next: TweaksData) {
  const ids = new Set([...Object.keys(prev), ...Object.keys(next)]);
  for (const id of ids) clearElementStyles(id);
  state.tweaks = next;
  for (const [id, tweak] of Object.entries(next)) applyToElement(id, tweak);
}

export const tweaksStore = {
  getState(): StoreState {
    return state;
  },
  subscribe(l: Listener): () => void {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
  setEditorMode(b: boolean) {
    state.editorMode = b;
    if (!b) {
      state.selectedId = null;
      state.hoveredId = null;
    }
    notify();
  },
  setSelected(id: string | null) {
    state.selectedId = id;
    notify();
  },
  setHovered(id: string | null) {
    state.hoveredId = id;
    notify();
  },
  updateTweak(id: string, patch: Partial<Tweak>) {
    const prev = state.tweaks[id] ?? {};
    const nextTweaks: TweaksData = { ...state.tweaks, [id]: { ...prev, ...patch } };
    const h = commit({ past: state.past, present: state.tweaks, future: state.future }, nextTweaks);
    state.past = h.past;
    state.future = h.future;
    state.tweaks = h.present;
    const applied = h.present[id];
    if (applied !== undefined) applyToElement(id, applied);
    notify();
  },
  resetElement(id: string) {
    const nextTweaks = { ...state.tweaks };
    delete nextTweaks[id];
    const h = commit({ past: state.past, present: state.tweaks, future: state.future }, nextTweaks);
    state.past = h.past;
    state.future = h.future;
    state.tweaks = h.present;
    clearElementStyles(id);
    notify();
  },
  resetAll() {
    const ids = Object.keys(state.tweaks);
    const h = commit({ past: state.past, present: state.tweaks, future: state.future }, {});
    state.past = h.past;
    state.future = h.future;
    state.tweaks = h.present;
    for (const id of ids) clearElementStyles(id);
    notify();
  },
  undo() {
    const prev = state.tweaks;
    const h = historyUndo({ past: state.past, present: state.tweaks, future: state.future });
    state.past = h.past;
    state.future = h.future;
    setPresent(prev, h.present);
    notify();
  },
  redo() {
    const prev = state.tweaks;
    const h = historyRedo({ past: state.past, present: state.tweaks, future: state.future });
    state.past = h.past;
    state.future = h.future;
    setPresent(prev, h.present);
    notify();
  },
  canUndo(): boolean {
    return canUndo({ past: state.past, present: state.tweaks, future: state.future });
  },
  canRedo(): boolean {
    return canRedo({ past: state.past, present: state.tweaks, future: state.future });
  },
  getCanvasDoc(): Document | null {
    return getCanvasDoc();
  },
  setCanvasDoc(doc: Document | null) {
    canvasDoc = doc;
    state.canvasNonce += 1;
    if (doc) reapplyAll();
    notify();
  },
  async save(): Promise<{ ok: boolean; error?: string }> {
    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tweaks: state.tweaks }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => 'request failed');
        return { ok: false, error: text || `HTTP ${res.status}` };
      }
      return { ok: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error';
      return { ok: false, error: message };
    }
  },
};

export function useTweaksStore(): StoreState {
  hydrate();
  const [, setTick] = useState(0);
  useEffect(() => {
    const unsub = tweaksStore.subscribe(() => setTick((t) => t + 1));
    return unsub;
  }, []);
  return state;
}
