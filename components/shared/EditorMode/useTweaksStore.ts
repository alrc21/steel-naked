'use client';

import { useEffect, useState } from 'react';
import type { Tweak, TweaksData } from '@/lib/tweaks/types';

type StoreState = {
  editorMode: boolean;
  selectedId: string | null;
  hoveredId: string | null;
  tweaks: TweaksData;
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
};

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
  if (typeof document === 'undefined') return;
  const el = document.querySelector(`[data-tweak-id="${id}"]`) as HTMLElement | null;
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
}

function clearElementStyles(id: string) {
  if (typeof document === 'undefined') return;
  const el = document.querySelector(`[data-tweak-id="${id}"]`) as HTMLElement | null;
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
  ];
  for (const p of props) {
    (el.style as unknown as Record<string, string>)[p as string] = '';
  }
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
    const next: Tweak = { ...prev, ...patch };
    state.tweaks = { ...state.tweaks, [id]: next };
    applyToElement(id, next);
    notify();
  },
  resetElement(id: string) {
    const next = { ...state.tweaks };
    delete next[id];
    state.tweaks = next;
    clearElementStyles(id);
    notify();
  },
  resetAll() {
    const ids = Object.keys(state.tweaks);
    state.tweaks = {};
    for (const id of ids) clearElementStyles(id);
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
