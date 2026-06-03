# Editor v2 "Studio" — Design Spec

**Date:** 2026-06-03
**Project:** Steel Naked landing (`steel-naked/`)
**Status:** Approved, ready for planning

## Problem

The current in-page editor (`components/shared/EditorMode/`, toggled with `Shift+E`) lets
the user tweak typography, spacing, a single `text-align`, and color per element. Four
concrete pain points:

1. **No real positioning control.** The "Layout" tab only exposes `text-align`. Text
   frequently ends up in the wrong place and there is no way to reposition it.
2. **Footer "big logo" is text, not the logo.** `FooterB.tsx:67-89` renders a giant
   `STEEL NAKED` text wordmark that is clipped and never fully visible. It should be the
   real SVG logo (`public/images/logo.svg`), oversized so only a portion bleeds into view.
3. **The page does not adapt when the editor opens.** The panel is `position:fixed` over a
   full-screen page, so it covers the content being edited.
4. **No mobile preview.** There is no way to see the mobile layout.

Goal: a top-tier, curated, professional editor that is the easiest and most efficient way to
art-direct this landing.

## Approved decisions

- **Canvas:** Figma-style framed canvas (an iframe of the same site) with a Desktop /
  Tablet / Mobile device switcher.
- **Positioning:** "Align + nudge" model (self-align within section, X/Y offset, max-width)
  — no free-drag for now.
- **Footer logo:** real SVG, cropped/bleeding, **and** editable from the panel (scale,
  position, opacity).

## Architecture

### 1. Canvas shell (iframe-based preview)

The decisive constraint: CSS media queries and Tailwind `md:` breakpoints respond to the
**viewport** width, not a container width. Scaling a `<div>` would never trigger the mobile
layout. Therefore the preview renders the **same route inside a same-origin `<iframe>`**
sized to the chosen device width — the iframe's viewport is the device viewport, so the
layout reflows for real.

Components:

- `EditorShell.tsx` — rendered by the **top-level** window only, when `editorMode` is on.
  A fixed, full-viewport overlay (dark backdrop) containing: `Toolbar` (top), `CanvasFrame`
  (center), `EditPanel` (right rail). It hides/covers the underlying page.
- `CanvasFrame.tsx` — centers an `<iframe>` whose `src` is the current path plus a marker
  (`?sn-canvas=1`). Its width is the active device width; height fills the stage. The frame
  has the brutalist chrome (thin border, device label).
- `Toolbar.tsx` — device switcher (Desktop 1440 / Tablet 834 / Mobile 390), Save, Undo,
  Redo, selection breadcrumb, close.
- `EditorRoot.tsx` — refactored so that **inside the iframe** (`window.self !== window.top`)
  it renders nothing (no nested shell); it only keeps the `Shift+E` toggle on the top-level
  window. The iframe instance still applies saved tweaks via `TweaksHydrator` as today.

**Cross-frame editing.** The store and overlay live in the parent. Because the iframe is
same-origin, the parent reaches into `iframe.contentDocument` directly: it queries
`[data-tweak-id]`, attaches `mousemove`/`click`/`keydown` listeners there, draws hover/
select outlines there, and applies live inline styles there. A `getCanvasDoc()` helper
returns the iframe's `contentDocument` when in canvas mode, falling back to `document`.

Device widths (initial): Desktop 1440, Tablet 834, Mobile 390. Configurable constant.

### 2. Positioning model — "Align + nudge"

Extend `Tweak` with a position group, applied so it never fights document flow:

| Field         | CSS                                  | Control                          |
|---------------|--------------------------------------|----------------------------------|
| `align`       | `margin-inline` auto (L/C/R block)   | Segmented L / C / R              |
| `textAlign`   | `text-align` (existing)              | Segmented L / C / R              |
| `translateX`  | combined into `transform: translate` | Slider (−200…200 px)             |
| `translateY`  | combined into `transform: translate` | Slider (−200…200 px)             |
| `maxWidth`    | `max-width`                          | Slider (px) + "none"             |
| `scale`       | combined into `transform`            | Slider (logo / images)           |
| `opacity`     | `opacity`                            | Slider (logo / images)           |

`translateX`, `translateY`, and `scale` compose into a **single** `transform` string
(`translate(Xpx, Ypx) scale(S)`) both in live application (`applyToElement`) and in the
static CSS block (`tweak-to-css`). Using `transform` (not `top`/`left`) keeps the element in
flow and fully reversible — the right tool for "nudge text where it should be."

The "Layout" tab is renamed **Position** and hosts Align, Text Align, Nudge X, Nudge Y,
Max Width (and Scale / Opacity when relevant). Final tab order: **Type · Position · Space ·
Color**.

**Keyboard nudge (pro):** with an element selected, arrow keys adjust `translateX`/
`translateY` by 1px, `Shift+arrow` by 10px. Disabled while focus is in an input.

### 3. Footer logo

Replace the giant text wordmark in `FooterB.tsx` with the real `/images/logo.svg`, rendered
oversized and positioned so only a portion bleeds into the bottom of the footer, low
opacity, behind content (`pointer-events:none`, `aria-hidden`). Give it
`data-tweak-id="footer-logomark"` and add `footer-logomark` to `TWEAKABLE_IDS`, so its
scale, position (X/Y), and opacity are editable from the Position tab. Keep the small
`Steel Naked™` wordmark in the left column.

### 4. Undo / redo + history

The store gains a bounded history stack. `updateTweak` / `resetElement` / `resetAll` push
onto it. `undo()` / `redo()` restore prior `tweaks` snapshots and re-apply to the canvas
document. Bound `Cmd/Ctrl+Z` (undo) and `Cmd/Ctrl+Shift+Z` (redo) on the top-level window.

### 5. Data, persistence, validation

- `lib/tweaks/types.ts` — add `translateX`, `translateY`, `maxWidth`, `align`, `scale`,
  `opacity` to `Tweak`; extend `TWEAK_PROPS` (new `position` group) and keep `TWEAKABLE_IDS`
  updated (`footer-logomark`).
- `lib/tweaks/tweak-to-css.ts` — emit the new declarations, composing `transform`.
- `components/shared/EditorMode/useTweaksStore.ts` — document-aware apply/clear, history.
- `app/api/save/route.ts` — extend `ALLOWED_KEYS` from the new `TWEAK_PROPS`. Stays
  dev-only (returns 403 in production) and writes `content/tweaks.json`.
- Backwards compatible: current `content/tweaks.json` is `{}`.

## Units & boundaries

- **Shell/UI** (`EditorShell`, `CanvasFrame`, `Toolbar`, `EditPanel`, `PositionTab`): pure
  presentation, talk to the store via its API.
- **Store** (`useTweaksStore`): single source of truth for editor state, history, and
  applying styles to the canvas document. Knows nothing about React.
- **Tweak model** (`types`, `tweak-to-css`): pure data → CSS. Independently testable.
- **Persistence** (`/api/save`, `load-tweaks`): I/O only.
- **Footer** (`FooterB`): consumes a tweakable id; no editor logic.

## Testing

- `tweak-to-css`: new fields render correct declarations; `transform` composition
  (translate + scale together) is correct; empty tweak → no rule.
- Store history: update → undo restores previous, redo re-applies; bounded length.
- `/api/save` validation: new keys allowed, unknown keys rejected, prod returns 403.
- Position model: align maps to the right margins; maxWidth applied.
- Manual: open editor, switch Desktop/Tablet/Mobile and confirm real reflow; select an
  element, nudge with sliders and arrow keys; edit footer logo scale/opacity; Save and
  reload to confirm persistence.

## Out of scope (YAGNI)

- Free-drag absolute positioning (revisit later).
- Editing raw text content / copy.
- Adding/removing/reordering sections.
- Multi-breakpoint per-element overrides (one global tweak set, previewed at any width).

## Implementation tracks (parallelizable)

- **A — Canvas shell:** `EditorShell`, `CanvasFrame`, `Toolbar`, iframe wiring, store
  document-awareness, `EditorRoot` no-op-in-iframe.
- **B — Position model:** `types`/`tweak-to-css`/`/api/save` fields, `PositionTab`, keyboard
  nudge, store apply.
- **C — Footer logo:** `FooterB` real SVG + `footer-logomark` tweakable id.
- **D — Undo/redo:** store history + shortcuts.

Tracks B and C depend on the shared `Tweak` model change (do that first, then fan out).
Track A is independent. Track D builds on the store.
