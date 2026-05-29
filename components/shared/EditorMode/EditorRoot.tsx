'use client';

import { useEffect, useState } from 'react';
import { tweaksStore, useTweaksStore } from './useTweaksStore';
import { ElementOverlay } from './ElementOverlay';
import { EditPanel } from './EditPanel';

export function EditorRoot() {
  const { editorMode } = useTweaksStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.log(
        '%c[EditorMode] Shift+E para activar',
        'color:#BBFF00;font-family:monospace',
      );
    }
  }, []);

  useEffect(() => {
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
  if (!editorMode) return null;

  return (
    <>
      <ElementOverlay />
      <EditPanel />
    </>
  );
}
