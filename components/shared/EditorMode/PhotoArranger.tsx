'use client';

/* eslint-disable @next/next/no-img-element -- dev-only editor tool, dynamic srcs */

import { useEffect, useState } from 'react';
import { STEPS } from '@/components/b/brutally-steps';
import { settingText, type PhotoStep, type SettingRow } from '@/lib/arranger';

const ACCENT = '#BBFF00';
const FG = '#FFF7D4';
const INK = '#0E0E0E';
const DIM = 'rgba(233,229,218,0.55)';
const FONT = 'var(--font-mono), ui-monospace, monospace';
const BORDER = '1px solid rgba(233,229,218,0.16)';

const btn: React.CSSProperties = {
  background: 'transparent',
  color: FG,
  border: BORDER,
  padding: '6px 12px',
  fontFamily: FONT,
  fontSize: 10,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  cursor: 'pointer',
  borderRadius: 0,
};

type Slot = 'bg' | 'portrait';

const seed = (): PhotoStep[] => STEPS.map((s) => ({ bg: s.bg, portrait: s.portrait }));
const name = (src: string) => (src ? src.replace('/images/', '') : '—');

/** Clipboard with a legacy fallback — the async API needs a focused document. */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    /* fall through */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

export function PhotoArranger({ onClose }: { onClose: () => void }) {
  const [steps, setSteps] = useState<PhotoStep[]>(seed);
  const [sel, setSel] = useState(0);
  const [slot, setSlot] = useState<Slot>('bg');
  const [gallery, setGallery] = useState<string[]>([]);
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
    setSteps((prev) => prev.map((s, i) => (i === sel ? { ...s, [slot]: src } : s)));
  }
  async function copy() {
    const rows: SettingRow[] = steps.map((s, i) => ({
      paso: i + 1,
      titular: STEPS[i]!.headline,
      wide: s.bg,
      vertical: s.portrait,
    }));
    const ok = await copyText(settingText(rows));
    if (!ok) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  const cur = steps[sel]!;
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
          flex: '0 0 auto',
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
        {/* ── Preview (left) ── */}
        <div
          style={{
            flex: 1.5,
            minWidth: 0,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            justifyContent: 'center',
          }}
        >
          <StepPreview step={cur} index={sel} />

          {/* slot picker + filenames */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
            <SlotButton
              label="WIDE · fondo"
              file={name(cur.bg)}
              active={slot === 'bg'}
              onClick={() => setSlot('bg')}
            />
            <SlotButton
              label="VERTICAL · centro"
              file={name(cur.portrait)}
              active={slot === 'portrait'}
              onClick={() => setSlot('portrait')}
            />
          </div>
          <p style={{ fontSize: 10, color: DIM, margin: 0, lineHeight: 1.5 }}>
            Elige un slot arriba, luego una foto de la galería para asignarla. La miniatura de cada
            paso a la derecha te deja saltar entre los 3.
          </p>
        </div>

        {/* ── Steps + gallery (right) ── */}
        <div style={{ width: 380, borderLeft: BORDER, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {/* step tabs */}
          <div style={{ padding: 12, borderBottom: BORDER, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {steps.map((s, i) => (
              <StepTab
                key={i}
                index={i}
                step={s}
                headline={STEPS[i]!.headline}
                counter={STEPS[i]!.counter}
                selected={i === sel}
                onSelect={() => setSel(i)}
              />
            ))}
          </div>

          {/* gallery */}
          <div style={{ padding: '10px 14px', borderBottom: BORDER, fontSize: 10, letterSpacing: '0.06em' }}>
            GALERÍA → PASO {pad(sel)} · <span style={{ color: ACCENT }}>{slot === 'bg' ? 'WIDE' : 'VERTICAL'}</span>
          </div>
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 12,
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 8,
              alignContent: 'start',
            }}
          >
            {gallery.map((src) => {
              const inUse = src === cur[slot];
              return (
                <button
                  key={src}
                  type="button"
                  onClick={() => assign(src)}
                  title={name(src)}
                  style={{
                    padding: 0,
                    border: inUse ? `2px solid ${ACCENT}` : BORDER,
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <img
                    src={src}
                    alt=""
                    style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block' }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Faithful static preview of one step's desktop composition. */
function StepPreview({ step, index }: { step: PhotoStep; index: number }) {
  const s = STEPS[index]!;
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 'min(100%, calc(62vh * 16 / 9))',
        aspectRatio: '16 / 9',
        overflow: 'hidden',
        background: '#000',
        border: BORDER,
        alignSelf: 'center',
      }}
    >
      {/* wide bg */}
      {step.bg ? (
        <img
          src={step.bg}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <Empty label="foto WIDE" />
      )}
      {/* scrim */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.18))',
        }}
      />
      {/* portrait card */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '30%',
          aspectRatio: '3 / 4',
          border: '1px solid rgba(255,255,255,0.18)',
          overflow: 'hidden',
          background: '#000',
        }}
      >
        {step.portrait ? (
          <img
            src={step.portrait}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <Empty label="VERTICAL" small />
        )}
      </div>
      {/* label */}
      <span
        className="font-mono"
        style={{ position: 'absolute', top: 14, left: 18, fontSize: 9, letterSpacing: '0.18em', color: ACCENT }}
      >
        _BRUTALLY PERMANENT / 03
      </span>
      {/* counter */}
      <span
        className="font-mono"
        style={{ position: 'absolute', top: 14, right: 18, fontSize: 9, letterSpacing: '0.18em', color: ACCENT }}
      >
        {s.counter}
      </span>
      {/* headline */}
      <h2
        className="font-display"
        style={{
          position: 'absolute',
          top: '50%',
          left: 18,
          transform: 'translateY(-50%)',
          margin: 0,
          fontSize: 'clamp(20px, 3vw, 54px)',
          fontWeight: 700,
          lineHeight: 0.95,
          letterSpacing: '-0.015em',
          color: ACCENT,
          whiteSpace: 'pre-line',
        }}
      >
        {s.headline.replace(/ /g, '\n')}
      </h2>
      {/* caption */}
      <span
        className="font-mono"
        style={{
          position: 'absolute',
          bottom: 14,
          right: 18,
          maxWidth: '48%',
          textAlign: 'right',
          fontSize: 9,
          lineHeight: 1.6,
          letterSpacing: '0.02em',
          color: ACCENT,
          whiteSpace: 'pre-line',
        }}
      >
        {s.caption}
      </span>
    </div>
  );
}

function StepTab({
  index,
  step,
  headline,
  counter,
  selected,
  onSelect,
}: {
  index: number;
  step: PhotoStep;
  headline: string;
  counter: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: 8,
        background: selected ? 'rgba(187,255,0,0.08)' : 'transparent',
        border: selected ? `1px solid ${ACCENT}` : BORDER,
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      {step.bg ? (
        <img src={step.bg} alt="" style={{ width: 56, height: 32, objectFit: 'cover', display: 'block' }} />
      ) : (
        <div style={{ width: 56, height: 32, background: '#1a1a1a' }} />
      )}
      {step.portrait ? (
        <img src={step.portrait} alt="" style={{ width: 24, height: 32, objectFit: 'cover', display: 'block' }} />
      ) : (
        <div style={{ width: 24, height: 32, background: '#1a1a1a' }} />
      )}
      <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <span style={{ fontSize: 9, letterSpacing: '0.1em', color: selected ? ACCENT : DIM }}>{counter}</span>
        <span
          className="font-display"
          style={{ fontSize: 14, color: FG, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {headline}
        </span>
      </span>
    </button>
  );
}

function SlotButton({
  label,
  file,
  active,
  onClick,
}: {
  label: string;
  file: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1,
        textAlign: 'left',
        padding: '8px 12px',
        background: active ? 'rgba(187,255,0,0.08)' : 'transparent',
        border: active ? `1px solid ${ACCENT}` : BORDER,
        cursor: 'pointer',
      }}
    >
      <div style={{ fontSize: 9, letterSpacing: '0.1em', color: active ? ACCENT : DIM }}>{label}</div>
      <div style={{ fontSize: 11, color: FG, marginTop: 3, wordBreak: 'break-all', fontFamily: FONT }}>{file}</div>
    </button>
  );
}

function Empty({ label, small }: { label: string; small?: boolean }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: DIM,
        fontSize: small ? 9 : 11,
        letterSpacing: '0.1em',
      }}
    >
      + {label}
    </div>
  );
}
