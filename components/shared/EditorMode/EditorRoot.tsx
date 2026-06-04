'use client';

import { useEffect, useState } from 'react';
import { tweaksStore, useTweaksStore } from './useTweaksStore';
import { EditorShell } from './EditorShell';

export function EditorRoot() {
  const { editorMode } = useTweaksStore();
  // Are we rendered inside the canvas iframe? Read once at first render
  // (SSR-safe: window is undefined on the server, so it resolves to false there
  // and on the top-level client — only the framed instance flips to true).
  const [framed] = useState(() => typeof window !== 'undefined' && window.self !== window.top);

  useEffect(() => {
    if (framed) return;
    console.log('%c[EditorMode] Shift+E para activar', 'color:#BBFF00;font-family:monospace');
  }, [framed]);

  useEffect(() => {
    if (framed) return; // never toggle inside the canvas iframe
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
  }, [framed]);

  if (framed) return null;
  if (!editorMode) return null;

  return <EditorShell />;
}
