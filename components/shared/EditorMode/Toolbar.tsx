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
  onPhotos: () => void;
};

export function Toolbar({ device, onDevice, onPhotos }: Props) {
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
        <button type="button" style={btn(false)} onClick={onPhotos}>
          ▦ Fotos
        </button>
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
