# Editor v2 "Studio" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the Steel Naked in-page editor into a Figma-style "Studio": a framed iframe canvas with Desktop/Tablet/Mobile preview, real positioning controls (align + nudge), an editable real-SVG footer logomark, and undo/redo.

**Architecture:** The preview renders the same route inside a same-origin `<iframe>` sized to the active device width so CSS media queries / Tailwind `md:` breakpoints reflow for real. The editor store and overlay live in the parent window and reach into `iframe.contentDocument` directly (same-origin) to select, outline, and apply live inline styles. Tweaks are a flat per-element style map persisted to `content/tweaks.json` (dev-only) and rendered to a static `<style>` block server-side.

**Tech Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Vitest (node env) · pnpm.

**Working dir for all commands:** `steel-naked/` (run `cd steel-naked` first). Verify with `pnpm test`, `pnpm typecheck`, `pnpm lint`.

**Spec:** `docs/superpowers/specs/2026-06-03-editor-v2-studio-design.md`

---

## File Structure

**Create:**
- `lib/tweaks/transform.ts` — pure `composeTransform()` + `alignToMargins()`.
- `lib/tweaks/history.ts` — pure undo/redo history reducer.
- `components/shared/EditorMode/EditorShell.tsx` — full-screen editor overlay: toolbar + canvas iframe + panel + overlay.
- `components/shared/EditorMode/Toolbar.tsx` — device switch + undo/redo + close; exports `DeviceKey`, `DEVICE_WIDTHS`.
- `components/shared/EditorMode/CanvasFrame.tsx` — the iframe wrapper (sizing + load wiring).
- `components/shared/EditorMode/tabs/PositionTab.tsx` — align + nudge + max-width + scale + opacity.
- `tests/tweaks-transform.test.ts`, `tests/tweaks-history.test.ts`, `tests/tweak-to-css.test.ts`.

**Modify:**
- `lib/tweaks/types.ts` — extend `Tweak`, `TWEAK_PROPS` (new `position` group), `TWEAKABLE_IDS` (+`footer-logomark`).
- `lib/tweaks/tweak-to-css.ts` — emit new declarations via `composeTransform`/`alignToMargins`.
- `app/api/save/route.ts` — extend `ALLOWED_KEYS` with the `position` group.
- `components/shared/EditorMode/useTweaksStore.ts` — document-aware apply, `setCanvasDoc`/`getCanvasDoc`, history.
- `components/shared/EditorMode/EditorRoot.tsx` — no-op inside the iframe; render `EditorShell` at top level.
- `components/shared/EditorMode/ElementOverlay.tsx` — operate on the canvas document; arrow-nudge + undo/redo keys.
- `components/shared/EditorMode/EditPanel.tsx` — flex child (not fixed); `Position` tab replaces `Layout`.
- `components/shared/TweakPanel.tsx` — no-op inside the iframe.
- `components/b/FooterB.tsx` — real SVG logomark, tweakable.

**Delete:**
- `components/shared/EditorMode/tabs/LayoutTab.tsx` — replaced by `PositionTab`.

---

## Task 1: Extend the Tweak data model

**Files:**
- Modify: `lib/tweaks/types.ts`

- [ ] **Step 1: Add the position fields to `Tweak` and the new `position` group**

In `lib/tweaks/types.ts`, replace the `Tweak` type (currently lines 17-29) with:

```ts
export type Tweak = {
  fontSize?: string;
  fontWeight?: number;
  letterSpacing?: string;
  lineHeight?: string | number;
  fontFamily?: FontFamilyKey;
  marginTop?: string;
  marginBottom?: string;
  paddingTop?: string;
  paddingBottom?: string;
  textAlign?: Alignment;
  color?: ColorToken;
  // position group (v2)
  align?: Alignment;
  translateX?: string;
  translateY?: string;
  maxWidth?: string;
  scale?: number;
  opacity?: number;
};
```

Replace the `TWEAK_PROPS` const (currently lines 33-38) with:

```ts
export const TWEAK_PROPS = {
  typography: ['fontSize', 'fontWeight', 'letterSpacing', 'lineHeight', 'fontFamily'] as const,
  spacing: ['marginTop', 'marginBottom', 'paddingTop', 'paddingBottom'] as const,
  layout: ['textAlign'] as const,
  position: ['align', 'translateX', 'translateY', 'maxWidth', 'scale', 'opacity'] as const,
  color: ['color'] as const,
} as const;
```

- [ ] **Step 2: Register the footer logomark as a tweakable element**

In the `TWEAKABLE_IDS` array (currently lines 57-84), add `'footer-logomark'` immediately after `'footer-section'`:

```ts
  'footer-section',
  'footer-logomark',
  'footer-tagline',
  'footer-links',
```

- [ ] **Step 3: Verify typecheck passes**

Run: `cd steel-naked && pnpm typecheck`
Expected: no errors. (Other files still compile; new optional fields are additive.)

- [ ] **Step 4: Commit**

```bash
cd steel-naked
git add lib/tweaks/types.ts
git commit -m "feat(editor): extend Tweak model with position group + footer-logomark id

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Pure transform + align helpers (TDD)

**Files:**
- Create: `lib/tweaks/transform.ts`
- Test: `tests/tweaks-transform.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/tweaks-transform.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd steel-naked && pnpm test tweaks-transform`
Expected: FAIL — cannot resolve `@/lib/tweaks/transform`.

- [ ] **Step 3: Write the implementation**

Create `lib/tweaks/transform.ts`:

```ts
import type { Alignment, Tweak } from './types';

export function composeTransform(
  t: Pick<Tweak, 'translateX' | 'translateY' | 'scale'>,
): string | undefined {
  const parts: string[] = [];
  if (t.translateX !== undefined || t.translateY !== undefined) {
    parts.push(`translate(${t.translateX ?? '0px'}, ${t.translateY ?? '0px'})`);
  }
  if (t.scale !== undefined) {
    parts.push(`scale(${t.scale})`);
  }
  return parts.length > 0 ? parts.join(' ') : undefined;
}

export function alignToMargins(
  align: Alignment,
): { marginLeft: string; marginRight: string } {
  switch (align) {
    case 'left':
      return { marginLeft: '0', marginRight: 'auto' };
    case 'center':
      return { marginLeft: 'auto', marginRight: 'auto' };
    case 'right':
      return { marginLeft: 'auto', marginRight: '0' };
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd steel-naked && pnpm test tweaks-transform`
Expected: PASS (7 assertions).

- [ ] **Step 5: Commit**

```bash
cd steel-naked
git add lib/tweaks/transform.ts tests/tweaks-transform.test.ts
git commit -m "feat(editor): pure composeTransform + alignToMargins helpers

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Render new fields to CSS (TDD)

**Files:**
- Modify: `lib/tweaks/tweak-to-css.ts`
- Test: `tests/tweak-to-css.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/tweak-to-css.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd steel-naked && pnpm test tweak-to-css`
Expected: FAIL — new declarations not present.

- [ ] **Step 3: Add the declarations**

In `lib/tweaks/tweak-to-css.ts`, add the import at the top (after the existing `import type` line):

```ts
import { alignToMargins, composeTransform } from './transform';
```

Inside `tweakToDeclarations`, immediately before `return decls;`, insert:

```ts
  if (tweak.maxWidth !== undefined) {
    decls.push(`max-width: ${tweak.maxWidth} !important;`);
  }
  if (tweak.opacity !== undefined) {
    decls.push(`opacity: ${tweak.opacity} !important;`);
  }
  if (tweak.align !== undefined) {
    const m = alignToMargins(tweak.align);
    decls.push(`margin-left: ${m.marginLeft} !important;`);
    decls.push(`margin-right: ${m.marginRight} !important;`);
  }
  const transform = composeTransform(tweak);
  if (transform !== undefined) {
    decls.push(`transform: ${transform} !important;`);
  }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd steel-naked && pnpm test tweak-to-css`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
cd steel-naked
git add lib/tweaks/tweak-to-css.ts tests/tweak-to-css.test.ts
git commit -m "feat(editor): render position fields (max-width, opacity, align, transform) to CSS

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Allow new keys in the save endpoint

**Files:**
- Modify: `app/api/save/route.ts`

- [ ] **Step 1: Include the position group in ALLOWED_KEYS**

In `app/api/save/route.ts`, replace the `ALLOWED_KEYS` set (currently lines 5-10) with:

```ts
const ALLOWED_KEYS = new Set<keyof Tweak>([
  ...TWEAK_PROPS.typography,
  ...TWEAK_PROPS.spacing,
  ...TWEAK_PROPS.layout,
  ...TWEAK_PROPS.position,
  ...TWEAK_PROPS.color,
]);
```

- [ ] **Step 2: Verify typecheck passes**

Run: `cd steel-naked && pnpm typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd steel-naked
git add app/api/save/route.ts
git commit -m "feat(editor): accept position-group keys in /api/save validation

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Pure undo/redo history reducer (TDD)

**Files:**
- Create: `lib/tweaks/history.ts`
- Test: `tests/tweaks-history.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/tweaks-history.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd steel-naked && pnpm test tweaks-history`
Expected: FAIL — cannot resolve `@/lib/tweaks/history`.

- [ ] **Step 3: Write the implementation**

Create `lib/tweaks/history.ts`:

```ts
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
  const previous = h.past[h.past.length - 1];
  return {
    past: h.past.slice(0, -1),
    present: previous,
    future: [h.present, ...h.future].slice(0, MAX),
  };
}

export function redo(h: History): History {
  if (h.future.length === 0) return h;
  const next = h.future[0];
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd steel-naked && pnpm test tweaks-history`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
cd steel-naked
git add lib/tweaks/history.ts tests/tweaks-history.test.ts
git commit -m "feat(editor): pure undo/redo history reducer

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Make the store document-aware + history-backed

**Files:**
- Modify: `components/shared/EditorMode/useTweaksStore.ts`

This task has no unit test (DOM/canvas glue). Verify with `pnpm typecheck` and the manual pass in Task 12.

- [ ] **Step 1: Add imports and canvas-doc + history state**

At the top of `useTweaksStore.ts`, update imports:

```ts
'use client';

import { useEffect, useState } from 'react';
import type { Tweak, TweaksData } from '@/lib/tweaks/types';
import { alignToMargins, composeTransform } from '@/lib/tweaks/transform';
import { canRedo, canUndo, commit, redo, undo } from '@/lib/tweaks/history';
```

Replace the `StoreState` type (currently lines 6-11) with:

```ts
type StoreState = {
  editorMode: boolean;
  selectedId: string | null;
  hoveredId: string | null;
  tweaks: TweaksData;
  past: TweaksData[];
  future: TweaksData[];
  canvasNonce: number;
};
```

Replace the `state` initializer (currently lines 23-28) with:

```ts
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
  if (canvasDoc) return canvasDoc;
  return typeof document !== 'undefined' ? document : null;
}
```

- [ ] **Step 2: Make apply/clear operate on the canvas document and cover new fields**

Replace `applyToElement` (currently lines 44-59) with:

```ts
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
```

Replace `clearElementStyles` (currently lines 61-81) with:

```ts
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
```

- [ ] **Step 3: Wire history into mutations and add canvas-doc + undo/redo methods**

Replace the mutation methods `updateTweak`, `resetElement`, `resetAll` (currently lines 109-128) with:

```ts
  updateTweak(id: string, patch: Partial<Tweak>) {
    const prev = state.tweaks[id] ?? {};
    const nextTweaks: TweaksData = { ...state.tweaks, [id]: { ...prev, ...patch } };
    const h = commit({ past: state.past, present: state.tweaks, future: state.future }, nextTweaks);
    state.past = h.past;
    state.future = h.future;
    state.tweaks = h.present;
    applyToElement(id, h.present[id]);
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
    const h = undo({ past: state.past, present: state.tweaks, future: state.future });
    state.past = h.past;
    state.future = h.future;
    setPresent(prev, h.present);
    notify();
  },
  redo() {
    const prev = state.tweaks;
    const h = redo({ past: state.past, present: state.tweaks, future: state.future });
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
```

- [ ] **Step 4: Verify typecheck and existing tests pass**

Run: `cd steel-naked && pnpm typecheck && pnpm test`
Expected: typecheck clean; all tests pass.

- [ ] **Step 5: Commit**

```bash
cd steel-naked
git add components/shared/EditorMode/useTweaksStore.ts
git commit -m "feat(editor): document-aware store with canvas wiring + undo/redo + new fields

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Position tab (replaces Layout)

**Files:**
- Create: `components/shared/EditorMode/tabs/PositionTab.tsx`
- Delete: `components/shared/EditorMode/tabs/LayoutTab.tsx`
- Modify: `components/shared/EditorMode/EditPanel.tsx`

- [ ] **Step 1: Create the Position tab**

Create `components/shared/EditorMode/tabs/PositionTab.tsx`:

```tsx
'use client';

import type { Tweak, Alignment } from '@/lib/tweaks/types';
import { Segmented } from '../controls/Segmented';
import { Slider } from '../controls/Slider';
import { tweaksStore } from '../useTweaksStore';

type Props = {
  id: string;
  tweak: Tweak;
};

function parsePx(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : fallback;
}

export function PositionTab({ id, tweak }: Props) {
  return (
    <div>
      <Segmented<Alignment>
        label="Block Align"
        value={tweak.align}
        options={[
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'right', label: 'Right' },
        ]}
        onChange={(v) => tweaksStore.updateTweak(id, { align: v })}
      />
      <Segmented<Alignment>
        label="Text Align"
        value={tweak.textAlign}
        options={[
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'right', label: 'Right' },
        ]}
        onChange={(v) => tweaksStore.updateTweak(id, { textAlign: v })}
      />
      <Slider
        label="Nudge X"
        value={parsePx(tweak.translateX, 0)}
        min={-300}
        max={300}
        step={1}
        unit="px"
        hint="← → arrows nudge 1px · Shift 10px"
        onChange={(v) => tweaksStore.updateTweak(id, { translateX: `${v}px` })}
      />
      <Slider
        label="Nudge Y"
        value={parsePx(tweak.translateY, 0)}
        min={-300}
        max={300}
        step={1}
        unit="px"
        onChange={(v) => tweaksStore.updateTweak(id, { translateY: `${v}px` })}
      />
      <Slider
        label="Max Width"
        value={parsePx(tweak.maxWidth, 0)}
        min={0}
        max={1400}
        step={10}
        format={(v) => (v === 0 ? 'none' : `${v}px`)}
        onChange={(v) =>
          tweaksStore.updateTweak(id, v === 0 ? { maxWidth: 'none' } : { maxWidth: `${v}px` })
        }
      />
      <Slider
        label="Scale"
        value={tweak.scale ?? 1}
        min={0.2}
        max={3}
        step={0.05}
        format={(v) => `${v.toFixed(2)}×`}
        onChange={(v) => tweaksStore.updateTweak(id, { scale: v })}
      />
      <Slider
        label="Opacity"
        value={tweak.opacity ?? 1}
        min={0}
        max={1}
        step={0.01}
        format={(v) => v.toFixed(2)}
        onChange={(v) => tweaksStore.updateTweak(id, { opacity: v })}
      />
    </div>
  );
}
```

- [ ] **Step 2: Delete the old Layout tab**

Run: `cd steel-naked && git rm components/shared/EditorMode/tabs/LayoutTab.tsx`

- [ ] **Step 3: Swap the tab in EditPanel**

In `components/shared/EditorMode/EditPanel.tsx`:

Replace the import line `import { LayoutTab } from './tabs/LayoutTab';` with:

```ts
import { PositionTab } from './tabs/PositionTab';
```

Replace the `TabKey` type (line 10) with:

```ts
type TabKey = 'typography' | 'spacing' | 'position' | 'color';
```

Replace the `TABS` array (lines 12-17) with:

```ts
const TABS: ReadonlyArray<{ key: TabKey; label: string }> = [
  { key: 'typography', label: 'Type' },
  { key: 'spacing', label: 'Space' },
  { key: 'position', label: 'Position' },
  { key: 'color', label: 'Color' },
];
```

Replace the layout tab render line (`{tab === 'layout' && <LayoutTab id={selectedId} tweak={tweak} />}`) with:

```tsx
            {tab === 'position' && <PositionTab id={selectedId} tweak={tweak} />}
```

- [ ] **Step 4: Verify typecheck/lint pass**

Run: `cd steel-naked && pnpm typecheck && pnpm lint`
Expected: clean.

- [ ] **Step 5: Commit**

```bash
cd steel-naked
git add components/shared/EditorMode/tabs/PositionTab.tsx components/shared/EditorMode/EditPanel.tsx
git commit -m "feat(editor): Position tab (align + nudge + max-width + scale + opacity)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: Convert EditPanel into a flex child

**Files:**
- Modify: `components/shared/EditorMode/EditPanel.tsx`

The panel is currently a fixed full-height rail (`position:fixed; top:0; right:0; height:100vh`). Inside the shell it must be a normal flex child sitting beside the canvas.

- [ ] **Step 1: Replace the panel's positioning styles**

In `EditPanel.tsx`, in the root `<div>`'s `style` object (currently lines 64-79), replace these properties:

```ts
        position: 'fixed',
        top: 0,
        right: 0,
        width: 320,
        height: '100vh',
```

with:

```ts
        position: 'relative',
        flex: '0 0 340px',
        width: 340,
        height: '100%',
```

Leave the rest (`background`, `color`, `borderLeft`, etc.) unchanged.

- [ ] **Step 2: Verify typecheck passes**

Run: `cd steel-naked && pnpm typecheck`
Expected: clean. (Visual placement is verified in Task 12.)

- [ ] **Step 3: Commit**

```bash
cd steel-naked
git add components/shared/EditorMode/EditPanel.tsx
git commit -m "refactor(editor): EditPanel as flex child for the shell layout

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: Toolbar + EditorShell + CanvasFrame (the iframe canvas)

**Files:**
- Create: `components/shared/EditorMode/Toolbar.tsx`
- Create: `components/shared/EditorMode/CanvasFrame.tsx`
- Create: `components/shared/EditorMode/EditorShell.tsx`

- [ ] **Step 1: Create the Toolbar**

Create `components/shared/EditorMode/Toolbar.tsx`:

```tsx
'use client';

import { tweaksStore, useTweaksStore } from './useTweaksStore';

export type DeviceKey = 'desktop' | 'tablet' | 'mobile';

export const DEVICE_WIDTHS: Record<DeviceKey, number | 'fill'> = {
  desktop: 'fill',
  tablet: 834,
  mobile: 390,
};

const ACCENT = '#BBFF00';
const FG = '#FFF7D4';
const FONT = 'var(--font-mono), ui-monospace, monospace';
const DEVICES: ReadonlyArray<{ key: DeviceKey; label: string }> = [
  { key: 'desktop', label: 'Desktop' },
  { key: 'tablet', label: 'Tablet' },
  { key: 'mobile', label: 'Mobile' },
];

type Props = {
  device: DeviceKey;
  onDevice: (d: DeviceKey) => void;
};

export function Toolbar({ device, onDevice }: Props) {
  // subscribe so undo/redo enabled state re-renders
  useTweaksStore();
  const undoable = tweaksStore.canUndo();
  const redoable = tweaksStore.canRedo();

  const btn = (active: boolean): React.CSSProperties => ({
    background: active ? ACCENT : 'transparent',
    color: active ? '#0E0E0E' : FG,
    border: '1px solid rgba(233,229,218,0.2)',
    padding: '5px 12px',
    fontFamily: FONT,
    fontSize: 10,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    borderRadius: 0,
  });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '8px 14px',
        background: 'rgba(14,14,14,0.98)',
        borderBottom: '1px solid rgba(233,229,218,0.12)',
        color: FG,
        fontFamily: FONT,
        flex: '0 0 auto',
      }}
    >
      <span style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        _studio
      </span>

      <div style={{ display: 'flex', gap: 0 }}>
        {DEVICES.map((d) => (
          <button key={d.key} type="button" style={btn(device === d.key)} onClick={() => onDevice(d.key)}>
            {d.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button
          type="button"
          style={{ ...btn(false), opacity: undoable ? 1 : 0.4, cursor: undoable ? 'pointer' : 'not-allowed' }}
          onClick={() => tweaksStore.undo()}
          disabled={!undoable}
        >
          ↺ Undo
        </button>
        <button
          type="button"
          style={{ ...btn(false), opacity: redoable ? 1 : 0.4, cursor: redoable ? 'pointer' : 'not-allowed' }}
          onClick={() => tweaksStore.redo()}
          disabled={!redoable}
        >
          ↻ Redo
        </button>
        <button type="button" style={btn(false)} onClick={() => tweaksStore.setEditorMode(false)}>
          [ × ]
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create the CanvasFrame**

Create `components/shared/EditorMode/CanvasFrame.tsx`:

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { tweaksStore } from './useTweaksStore';
import { DEVICE_WIDTHS, type DeviceKey } from './Toolbar';

type Props = {
  device: DeviceKey;
  path: string;
};

export function CanvasFrame({ device, path }: Props) {
  const ref = useRef<HTMLIFrameElement>(null);
  const width = DEVICE_WIDTHS[device];

  useEffect(() => {
    return () => tweaksStore.setCanvasDoc(null);
  }, []);

  function handleLoad() {
    tweaksStore.setCanvasDoc(ref.current?.contentDocument ?? null);
  }

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        overflow: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: device === 'desktop' ? 0 : 24,
        background: '#161616',
      }}
    >
      <iframe
        ref={ref}
        key={device}
        src={`${path}?sn-canvas=1`}
        title="canvas"
        onLoad={handleLoad}
        style={{
          width: width === 'fill' ? '100%' : width,
          maxWidth: '100%',
          height: '100%',
          border: device === 'desktop' ? 'none' : '1px solid rgba(233,229,218,0.25)',
          background: '#ffffff',
          display: 'block',
        }}
      />
    </div>
  );
}
```

- [ ] **Step 3: Create the EditorShell**

Create `components/shared/EditorMode/EditorShell.tsx`:

```tsx
'use client';

import { useEffect, useState } from 'react';
import { tweaksStore, useTweaksStore } from './useTweaksStore';
import { Toolbar, type DeviceKey } from './Toolbar';
import { CanvasFrame } from './CanvasFrame';
import { EditPanel } from './EditPanel';
import { ElementOverlay } from './ElementOverlay';

export function EditorShell() {
  const { editorMode } = useTweaksStore();
  const [device, setDevice] = useState<DeviceKey>('desktop');
  const [path, setPath] = useState('/');

  useEffect(() => {
    setPath(window.location.pathname || '/');
  }, []);

  // undo/redo shortcuts on the parent window (focus outside the iframe)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        if (e.shiftKey) tweaksStore.redo();
        else tweaksStore.undo();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!editorMode) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2147483000,
        display: 'flex',
        flexDirection: 'column',
        background: '#0E0E0E',
      }}
    >
      <Toolbar device={device} onDevice={setDevice} />
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <CanvasFrame device={device} path={path} />
        <EditPanel />
      </div>
      <ElementOverlay />
    </div>
  );
}
```

- [ ] **Step 4: Verify typecheck/lint pass**

Run: `cd steel-naked && pnpm typecheck && pnpm lint`
Expected: clean.

- [ ] **Step 5: Commit**

```bash
cd steel-naked
git add components/shared/EditorMode/Toolbar.tsx components/shared/EditorMode/CanvasFrame.tsx components/shared/EditorMode/EditorShell.tsx
git commit -m "feat(editor): Studio shell — toolbar, iframe canvas with device preview

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: Rewire EditorRoot + overlay for the iframe; suppress chrome inside the frame

**Files:**
- Modify: `components/shared/EditorMode/EditorRoot.tsx`
- Modify: `components/shared/EditorMode/ElementOverlay.tsx`
- Modify: `components/shared/TweakPanel.tsx`

- [ ] **Step 1: EditorRoot renders the shell at top level, nothing inside the iframe**

Replace the entire body of `components/shared/EditorMode/EditorRoot.tsx` with:

```tsx
'use client';

import { useEffect, useState } from 'react';
import { tweaksStore, useTweaksStore } from './useTweaksStore';
import { EditorShell } from './EditorShell';

export function EditorRoot() {
  const { editorMode } = useTweaksStore();
  const [mounted, setMounted] = useState(false);
  const [framed, setFramed] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isFramed = window.self !== window.top;
    setFramed(isFramed);
    if (!isFramed) {
      // eslint-disable-next-line no-console
      console.log('%c[EditorMode] Shift+E para activar', 'color:#BBFF00;font-family:monospace');
    }
  }, []);

  useEffect(() => {
    if (window.self !== window.top) return; // never toggle inside the canvas iframe
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      const isShiftE = e.shiftKey && (e.key === 'E' || e.key === 'e');
      if (isShiftE) {
        e.preventDefault();
        tweaksStore.setEditorMode(!tweaksStore.getState().editorMode);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!mounted) return null;
  if (framed) return null;
  if (!editorMode) return null;

  return <EditorShell />;
}
```

- [ ] **Step 2: Point the overlay at the canvas document + add nudge/undo keys**

Replace the entire body of `components/shared/EditorMode/ElementOverlay.tsx` with:

```tsx
'use client';

import { useEffect } from 'react';
import { tweaksStore, useTweaksStore } from './useTweaksStore';

function findTweakAncestor(node: EventTarget | null): HTMLElement | null {
  let el = node as HTMLElement | null;
  while (el && el.nodeType === 1) {
    if (el.dataset && el.dataset.tweakId) return el;
    el = el.parentElement;
  }
  return null;
}

const HOVER_OUTLINE = '0 0 0 2px var(--color-accent)';
const SELECT_OUTLINE = '0 0 0 2px var(--color-accent), 0 0 0 4px rgba(187,255,0,0.25)';
const LABEL_ATTR = 'data-sn-editor-label';

function applyOutline(id: string, type: 'hover' | 'select') {
  const doc = tweaksStore.getCanvasDoc();
  const el = doc?.querySelector(`[data-tweak-id="${id}"]`) as HTMLElement | null;
  if (!el) return;
  el.style.boxShadow = type === 'select' ? SELECT_OUTLINE : HOVER_OUTLINE;
  el.style.cursor = 'pointer';
}

function clearOutline(id: string | null) {
  if (!id) return;
  const doc = tweaksStore.getCanvasDoc();
  const el = doc?.querySelector(`[data-tweak-id="${id}"]`) as HTMLElement | null;
  if (!el) return;
  el.style.boxShadow = '';
  el.style.cursor = '';
}

function removeAllLabels() {
  const doc = tweaksStore.getCanvasDoc();
  doc?.querySelectorAll(`[${LABEL_ATTR}]`).forEach((l) => l.remove());
}

function ensureLabel(id: string) {
  const doc = tweaksStore.getCanvasDoc();
  const el = doc?.querySelector(`[data-tweak-id="${id}"]`) as HTMLElement | null;
  if (!doc || !el) return;
  removeAllLabels();
  const rect = el.getBoundingClientRect();
  const label = doc.createElement('div');
  label.setAttribute(LABEL_ATTR, '');
  label.textContent = `[ ${id} ]`;
  label.style.cssText = [
    'position:fixed',
    `top:${Math.max(0, rect.top - 18)}px`,
    `left:${Math.max(0, rect.left)}px`,
    'background:var(--color-accent)',
    'color:#0E0E0E',
    'font-family:var(--font-mono),ui-monospace,monospace',
    'font-size:10px',
    'letter-spacing:0.04em',
    'padding:2px 6px',
    'z-index:9999',
    'pointer-events:none',
    'text-transform:uppercase',
  ].join(';');
  doc.body.appendChild(label);
}

function nudge(axis: 'x' | 'y', delta: number) {
  const id = tweaksStore.getState().selectedId;
  if (!id) return;
  const cur = tweaksStore.getState().tweaks[id] ?? {};
  if (axis === 'x') {
    const x = parseFloat(cur.translateX ?? '0') || 0;
    tweaksStore.updateTweak(id, { translateX: `${x + delta}px` });
  } else {
    const y = parseFloat(cur.translateY ?? '0') || 0;
    tweaksStore.updateTweak(id, { translateY: `${y + delta}px` });
  }
}

export function ElementOverlay() {
  const { editorMode, selectedId, hoveredId, canvasNonce } = useTweaksStore();

  // bind interaction listeners to the current canvas document
  useEffect(() => {
    if (!editorMode) {
      removeAllLabels();
      return;
    }
    const doc = tweaksStore.getCanvasDoc();
    if (!doc) return;

    function onMove(e: MouseEvent) {
      const el = findTweakAncestor(e.target);
      const id = el?.dataset.tweakId ?? null;
      if (id !== tweaksStore.getState().hoveredId) tweaksStore.setHovered(id);
    }

    function onClick(e: MouseEvent) {
      const el = findTweakAncestor(e.target);
      if (!el || !el.dataset.tweakId) return;
      e.preventDefault();
      e.stopPropagation();
      tweaksStore.setSelected(el.dataset.tweakId);
    }

    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (e.key === 'Escape') {
        tweaksStore.setSelected(null);
        return;
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        if (e.shiftKey) tweaksStore.redo();
        else tweaksStore.undo();
        return;
      }
      if (!tweaksStore.getState().selectedId) return;
      const step = e.shiftKey ? 10 : 1;
      if (e.key === 'ArrowLeft') { e.preventDefault(); nudge('x', -step); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); nudge('x', step); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); nudge('y', -step); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); nudge('y', step); }
    }

    doc.addEventListener('mousemove', onMove, true);
    doc.addEventListener('click', onClick, true);
    doc.addEventListener('keydown', onKey, true);
    return () => {
      doc.removeEventListener('mousemove', onMove, true);
      doc.removeEventListener('click', onClick, true);
      doc.removeEventListener('keydown', onKey, true);
    };
  }, [editorMode, canvasNonce]);

  // selection outline + label
  useEffect(() => {
    if (!editorMode) return;
    if (selectedId) {
      applyOutline(selectedId, 'select');
      ensureLabel(selectedId);
    }
    return () => {
      if (selectedId) clearOutline(selectedId);
      removeAllLabels();
    };
  }, [editorMode, selectedId, canvasNonce]);

  // hover outline
  useEffect(() => {
    if (!editorMode) return;
    if (hoveredId && hoveredId !== selectedId) applyOutline(hoveredId, 'hover');
    return () => {
      if (hoveredId && hoveredId !== selectedId) clearOutline(hoveredId);
    };
  }, [editorMode, hoveredId, selectedId, canvasNonce]);

  return null;
}
```

- [ ] **Step 3: Suppress the legacy TweakPanel inside the iframe**

In `components/shared/TweakPanel.tsx`, find the start of the component function `export function TweakPanel() {` and insert as its **first statements** (before any other hooks — it must run unconditionally, so use an effect-free early constant + guard at render). Add this `useEffect`-free guard by introducing a mounted+framed check identical to EditorRoot. Concretely, add these two state hooks right after the function opening brace, before the existing hooks:

```tsx
  const [framed, setFramed] = useState(false);
  useEffect(() => {
    setFramed(window.self !== window.top);
  }, []);
```

Then, at the component's `return` for its visible UI, wrap so that when `framed` is true it returns `null`. Add immediately before the final `return (` that renders the panel/button:

```tsx
  if (framed) return null;
```

(If `useState`/`useEffect` are not already imported in this file, they are — it imports `useEffect, useState` on line 3. Keep hook order stable: the two new hooks must come before any early `return`.)

- [ ] **Step 4: Verify typecheck/lint/tests**

Run: `cd steel-naked && pnpm typecheck && pnpm lint && pnpm test`
Expected: all clean/green.

- [ ] **Step 5: Commit**

```bash
cd steel-naked
git add components/shared/EditorMode/EditorRoot.tsx components/shared/EditorMode/ElementOverlay.tsx components/shared/TweakPanel.tsx
git commit -m "feat(editor): drive canvas iframe from parent; nudge + undo keys; suppress chrome in frame

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 11: Footer — real SVG logomark, editable

**Files:**
- Modify: `components/b/FooterB.tsx`

The current "big logo" is a giant text `STEEL NAKED` (lines 67-89, a `motion.div`). Replace it with the real `/images/logo.svg`, oversized and bleeding off the bottom (the footer already has `overflow-hidden`, which crops it), recolored to paper via filter, low base opacity, and tagged `footer-logomark` so the editor controls its scale/position/opacity.

- [ ] **Step 1: Replace the text wordmark with the SVG logomark**

In `components/b/FooterB.tsx`, replace the entire `<motion.div ...>STEEL NAKED</motion.div>` block (lines 67-89) with:

```tsx
      <div
        aria-hidden
        data-tweak-id="footer-logomark"
        className="absolute left-0 right-0 flex justify-center pointer-events-none"
        style={{ bottom: '-32%' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo.svg"
          alt=""
          aria-hidden
          style={{
            width: 'clamp(420px, 92vw, 1280px)',
            maxWidth: 'none',
            height: 'auto',
            opacity: 0.12,
            filter: 'brightness(0) invert(1)',
          }}
        />
      </div>
```

- [ ] **Step 2: Remove the now-unused motion import**

If `motion` and `EASE_EDITORIAL` are no longer referenced anywhere else in `FooterB.tsx` (they are not — this was their only use), delete lines 3-4:

```tsx
import { motion } from 'motion/react';
import { EASE_EDITORIAL } from '@/lib/motion-presets';
```

- [ ] **Step 3: Verify typecheck/lint**

Run: `cd steel-naked && pnpm typecheck && pnpm lint`
Expected: clean. (If lint flags the `<img>`, the inline disable comment in Step 1 covers it; remove any duplicate.)

- [ ] **Step 4: Commit**

```bash
cd steel-naked
git add components/b/FooterB.tsx
git commit -m "feat(footer): real SVG logomark, cropped + editor-tweakable

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 12: Full verification pass

**Files:** none (manual + automated verification).

- [ ] **Step 1: Run the whole automated suite**

Run: `cd steel-naked && pnpm test && pnpm typecheck && pnpm lint`
Expected: all green.

- [ ] **Step 2: Start the dev server**

Run: `cd steel-naked && pnpm dev`
Open `http://localhost:3000`.

- [ ] **Step 3: Manual checklist (confirm each)**

- [ ] Press `Shift+E` → the page is replaced by the Studio shell: toolbar on top, page inside a centered canvas, panel on the right. The page is fully visible (not covered).
- [ ] Toolbar device switch: click `Tablet` then `Mobile` → the canvas narrows and the layout reflows to the mobile/tablet breakpoints (e.g. footer columns stack). This is real reflow, not scaling.
- [ ] Hover elements in the canvas → accent outline + `[ id ]` label appear in the right place. Click → element selected, panel header shows the id.
- [ ] Position tab: select `about-headline`, drag `Nudge X`/`Nudge Y` → text moves without breaking layout. Set `Block Align` center and a `Max Width` → element recenters.
- [ ] With an element selected, press arrow keys → it nudges 1px; Shift+arrow → 10px.
- [ ] Select `footer-logomark` → adjust `Scale` and `Opacity`; the real logo (not text) is visible, cropped at the footer bottom.
- [ ] Undo/Redo: make 3 edits, click `↺ Undo` (or `Cmd/Ctrl+Z`) → reverts; `↻ Redo` → re-applies.
- [ ] Click `[ save → json ]` in the panel → toast `saved`. Confirm `content/tweaks.json` now contains the edits.
- [ ] Reload the page (editor off) → saved tweaks are visible on the live page (server-rendered style block).
- [ ] Press `Shift+E` to close, or click `[ × ]` → shell disappears, page interactive again.

- [ ] **Step 4: Commit the saved tweaks file if it changed during testing (optional)**

```bash
cd steel-naked
git add content/tweaks.json
git commit -m "chore(editor): sample tweaks from verification pass

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review notes (addressed)

- **Spec coverage:** canvas/iframe + device preview (Tasks 8-10), position model (Tasks 1-3, 6, 7), footer logo (Tasks 1, 11), undo/redo (Tasks 5, 6, 9, 10), page-adapts (Tasks 8, 9). All covered.
- **Type consistency:** `composeTransform`/`alignToMargins` (Task 2) are reused verbatim in `tweak-to-css` (Task 3) and the store (Task 6). Store methods `undo/redo/canUndo/canRedo/getCanvasDoc/setCanvasDoc` (Task 6) match their callers in Toolbar/CanvasFrame/EditorShell/ElementOverlay (Tasks 9-10). Tab key renamed `layout`→`position` consistently (Task 7).
- **Known limitations (documented, acceptable):** applying `transform` to a framer-motion-driven element (`hero-image`) can conflict with motion on scroll — avoid nudging that element. The footer logomark drops its entrance animation in exchange for clean editability. Tablet/mobile frames assume a stage wider than 834px; on a very narrow stage the frame scrolls.
