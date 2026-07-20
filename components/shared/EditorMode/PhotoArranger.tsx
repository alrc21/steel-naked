'use client';

/* eslint-disable @next/next/no-img-element -- dev-only editor tool, dynamic srcs */

import { useEffect, useState } from 'react';
import { STEPS } from '@/components/b/brutally-steps';
import { moveStep, settingText, type PhotoStep } from '@/lib/arranger';

const ACCENT = '#BBFF00';
const FG = '#FFF7D4';
const INK = '#0E0E0E';
const FONT = 'var(--font-mono), ui-monospace, monospace';
const BORDER = '1px solid rgba(233,229,218,0.16)';

const btn: React.CSSProperties = {
  background: 'transparent',
  color: FG,
  border: BORDER,
  padding: '5px 12px',
  fontFamily: FONT,
  fontSize: 10,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  cursor: 'pointer',
  borderRadius: 0,
};

type Slot = 'bg' | 'portrait';
type Picking = { step: number; slot: Slot } | null;

const seed = (): PhotoStep[] => STEPS.map((s) => ({ bg: s.bg, portrait: s.portrait }));

export function PhotoArranger({ onClose }: { onClose: () => void }) {
  const [steps, setSteps] = useState<PhotoStep[]>(seed);
  const [gallery, setGallery] = useState<string[]>([]);
  const [picking, setPicking] = useState<Picking>(null);
  const [copied, setCopied] = useState(false);

  async function loadGallery() {
    try {
      const res = await fetch('/api/images');
      const data = await res.json();
      if (data.ok) setGallery(data.images as string[]);
    } catch {
      /* dev tool — silent */
    }
  }
  useEffect(() => {
    loadGallery();
  }, []);

  function assign(src: string) {
    if (!picking) return;
    setSteps((prev) =>
      prev.map((s, i) => (i === picking.step ? { ...s, [picking.slot]: src } : s)),
    );
  }
  function move(i: number, delta: number) {
    setSteps((prev) => moveStep(prev, i, delta));
    setPicking(null);
  }
  function removeStep(i: number) {
    setSteps((prev) => prev.filter((_, idx) => idx !== i));
    setPicking(null);
  }
  function addStep() {
    setSteps((prev) => [...prev, { bg: '', portrait: '' }]);
  }
  async function copy() {
    await navigator.clipboard.writeText(settingText(steps));
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  const pad = (n: number) => String(n + 1).padStart(2, '0');

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2147483600,
        background: INK,
        color: FG,
        fontFamily: FONT,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '10px 16px',
          borderBottom: BORDER,
        }}
      >
        <span style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          _arreglar fotos · brutally permanent
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" style={btn} onClick={loadGallery}>
            ↻ Recargar
          </button>
          <button
            type="button"
            style={{ ...btn, background: copied ? ACCENT : 'transparent', color: copied ? INK : FG }}
            onClick={copy}
          >
            {copied ? 'Copiado ✓' : 'Copiar setting'}
          </button>
          <button type="button" style={btn} onClick={onClose}>
            [ × ]
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* steps */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ border: BORDER, padding: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 11, letterSpacing: '0.14em', color: ACCENT }}>
                  PASO {pad(i)} / {pad(steps.length - 1)}
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button type="button" style={{ ...btn, opacity: i === 0 ? 0.35 : 1 }} onClick={() => move(i, -1)}>
                    ↑
                  </button>
                  <button
                    type="button"
                    style={{ ...btn, opacity: i === steps.length - 1 ? 0.35 : 1 }}
                    onClick={() => move(i, 1)}
                  >
                    ↓
                  </button>
                  <button type="button" style={btn} onClick={() => removeStep(i)}>
                    ✕
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <SlotBox
                  label="WIDE (fondo)"
                  ratio="16 / 9"
                  src={s.bg}
                  active={picking?.step === i && picking.slot === 'bg'}
                  onPick={() => setPicking({ step: i, slot: 'bg' })}
                />
                <SlotBox
                  label="VERTICAL (centro)"
                  ratio="3 / 4"
                  width={110}
                  src={s.portrait}
                  active={picking?.step === i && picking.slot === 'portrait'}
                  onPick={() => setPicking({ step: i, slot: 'portrait' })}
                />
              </div>
            </div>
          ))}
          <button type="button" style={{ ...btn, padding: '10px 12px' }} onClick={addStep}>
            + Añadir paso
          </button>
        </div>

        {/* gallery */}
        <div style={{ width: 340, borderLeft: BORDER, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ padding: '10px 14px', borderBottom: BORDER, fontSize: 10, letterSpacing: '0.08em' }}>
            {picking
              ? `GALERÍA → asignar a PASO ${pad(picking.step)} · ${picking.slot === 'bg' ? 'WIDE' : 'VERTICAL'}`
              : 'GALERÍA — elige un slot a la izquierda'}
          </div>
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 12,
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 8,
              opacity: picking ? 1 : 0.5,
            }}
          >
            {gallery.map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => assign(src)}
                title={src}
                style={{ padding: 0, border: BORDER, background: 'transparent', cursor: picking ? 'pointer' : 'not-allowed' }}
              >
                <img src={src} alt="" style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block' }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SlotBox({
  label,
  ratio,
  src,
  active,
  onPick,
  width,
}: {
  label: string;
  ratio: string;
  src: string;
  active: boolean;
  onPick: () => void;
  width?: number;
}) {
  return (
    <div style={{ width }}>
      <div style={{ fontSize: 9, letterSpacing: '0.08em', opacity: 0.7, marginBottom: 5 }}>{label}</div>
      <button
        type="button"
        onClick={onPick}
        style={{
          padding: 0,
          width: '100%',
          aspectRatio: ratio,
          border: active ? `2px solid ${ACCENT}` : BORDER,
          background: '#000',
          cursor: 'pointer',
          display: 'block',
        }}
      >
        {src ? (
          <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <span style={{ fontSize: 10, color: FG, opacity: 0.6 }}>elegir…</span>
        )}
      </button>
      <div style={{ fontSize: 8, opacity: 0.5, marginTop: 4, wordBreak: 'break-all' }}>
        {src ? src.replace('/images/', '') : '—'}
      </div>
    </div>
  );
}
