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
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        nudge('x', -step);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nudge('x', step);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        nudge('y', -step);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        nudge('y', step);
      }
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
