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
  // Read the route once at first render. The shell only ever mounts client-side
  // (after the user toggles editor mode), so window is available here.
  const [path] = useState(() =>
    typeof window !== 'undefined' ? window.location.pathname || '/' : '/',
  );

  // undo/redo shortcuts on the parent window (focus outside the iframe)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
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
