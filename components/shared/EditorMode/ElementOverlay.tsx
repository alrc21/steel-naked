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
  const el = document.querySelector(`[data-tweak-id="${id}"]`) as HTMLElement | null;
  if (!el) return;
  el.style.boxShadow = type === 'select' ? SELECT_OUTLINE : HOVER_OUTLINE;
  el.style.cursor = 'pointer';
}

function clearOutline(id: string | null) {
  if (!id) return;
  const el = document.querySelector(`[data-tweak-id="${id}"]`) as HTMLElement | null;
  if (!el) return;
  el.style.boxShadow = '';
  el.style.cursor = '';
}

function ensureLabel(id: string) {
  const el = document.querySelector(`[data-tweak-id="${id}"]`) as HTMLElement | null;
  if (!el) return;
  removeAllLabels();
  const rect = el.getBoundingClientRect();
  const label = document.createElement('div');
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
  document.body.appendChild(label);
}

function removeAllLabels() {
  const labels = document.querySelectorAll(`[${LABEL_ATTR}]`);
  labels.forEach((l) => l.remove());
}

export function ElementOverlay() {
  const { editorMode, selectedId, hoveredId } = useTweaksStore();

  useEffect(() => {
    if (!editorMode) {
      removeAllLabels();
      return;
    }

    function onMove(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (target && target.hasAttribute(LABEL_ATTR)) return;
      if (target && target.closest('[data-sn-editor-panel]')) return;
      const el = findTweakAncestor(e.target);
      const id = el?.dataset.tweakId ?? null;
      const current = tweaksStore.getState().hoveredId;
      if (id !== current) {
        tweaksStore.setHovered(id);
      }
    }

    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('[data-sn-editor-panel]')) return;
      const el = findTweakAncestor(e.target);
      if (!el) return;
      const id = el.dataset.tweakId;
      if (!id) return;
      e.preventDefault();
      e.stopPropagation();
      tweaksStore.setSelected(id);
    }

    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (e.key === 'Escape') {
        tweaksStore.setSelected(null);
      }
    }

    document.addEventListener('mousemove', onMove, true);
    document.addEventListener('click', onClick, true);
    document.addEventListener('keydown', onKey, true);

    return () => {
      document.removeEventListener('mousemove', onMove, true);
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('keydown', onKey, true);
    };
  }, [editorMode]);

  useEffect(() => {
    if (!editorMode) return;
    if (selectedId) {
      applyOutline(selectedId, 'select');
      ensureLabel(selectedId);
    }
    return () => {
      if (selectedId) {
        clearOutline(selectedId);
      }
      removeAllLabels();
    };
  }, [editorMode, selectedId]);

  useEffect(() => {
    if (!editorMode) return;
    if (hoveredId && hoveredId !== selectedId) {
      applyOutline(hoveredId, 'hover');
    }
    return () => {
      if (hoveredId && hoveredId !== selectedId) {
        clearOutline(hoveredId);
      }
    };
  }, [editorMode, hoveredId, selectedId]);

  return null;
}
