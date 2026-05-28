'use client';

import { useEffect, useState, useCallback } from 'react';

type FontKey = 'graphik-wide' | 'space-grotesk' | 'space-mono';

const FONT_VAR: Record<FontKey, string> = {
  'graphik-wide': 'var(--font-display)',
  'space-grotesk': 'var(--font-sans)',
  'space-mono': 'var(--font-mono)',
};

const DEFAULTS = {
  display: 'graphik-wide' as FontKey,
  body: 'space-grotesk' as FontKey,
  mono: 'space-mono' as FontKey,
  displayWeight: 300,
};

const STORAGE_KEY = 'sn:tweak';

type State = { display: FontKey; body: FontKey; mono: FontKey; displayWeight: number };

const WEIGHTS: ReadonlyArray<{ value: number; label: string }> = [
  { value: 100, label: '100 Thin' },
  { value: 200, label: '200 Extralight' },
  { value: 300, label: '300 Light' },
  { value: 400, label: '400 Regular' },
  { value: 500, label: '500 Medium' },
  { value: 600, label: '600 Semibold' },
  { value: 700, label: '700 Bold' },
  { value: 900, label: '900 Black' },
];

function applyToRoot(state: State) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--font-display', FONT_VAR[state.display]);
  root.style.setProperty('--font-sans', FONT_VAR[state.body]);
  root.style.setProperty('--font-mono', FONT_VAR[state.mono]);
  root.style.setProperty('--font-display-weight', String(state.displayWeight));
  if (state.displayWeight !== DEFAULTS.displayWeight) {
    root.dataset.weightOverride = '';
  } else {
    delete root.dataset.weightOverride;
  }
}

function clearRoot() {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.removeProperty('--font-display');
  root.style.removeProperty('--font-sans');
  root.style.removeProperty('--font-mono');
  root.style.removeProperty('--font-display-weight');
  delete root.dataset.weightOverride;
}

function readStored(): State {
  if (typeof window === 'undefined') return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<State>;
    return {
      display: parsed.display ?? DEFAULTS.display,
      body: parsed.body ?? DEFAULTS.body,
      mono: parsed.mono ?? DEFAULTS.mono,
      displayWeight:
        typeof parsed.displayWeight === 'number' ? parsed.displayWeight : DEFAULTS.displayWeight,
    };
  } catch {
    return DEFAULTS;
  }
}

export function TweakPanel() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<State>(DEFAULTS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = readStored();
    applyToRoot(stored);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(stored);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.log('%c[TweakPanel] Shift+T o ? para abrir', 'color:#BBFF00;font-family:monospace');
    }
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      const isQuestion = e.key === '?';
      const isShiftT = e.shiftKey && (e.key === 'T' || e.key === 't');
      if (isQuestion || isShiftT) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const update = useCallback((patch: Partial<State>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      applyToRoot(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setState(DEFAULTS);
    clearRoot();
  }, []);

  if (!mounted) return null;

  return (
    <div className="hidden md:contents">
      {open && (
        <div
          role="dialog"
          aria-label="Tweak panel"
          style={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            width: 260,
            padding: 12,
            background: 'rgba(14,14,14,0.92)',
            color: '#E9E5DA',
            fontFamily: 'var(--font-mono), ui-monospace, monospace',
            fontSize: 11,
            letterSpacing: '0.04em',
            zIndex: 70,
            borderRadius: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
              textTransform: 'uppercase',
            }}
          >
            <span>_tweak / fonts</span>
            <button
              type="button"
              aria-label="Close tweak panel"
              onClick={() => setOpen(false)}
              style={{
                background: 'transparent',
                color: '#E9E5DA',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                fontFamily: 'inherit',
                fontSize: 11,
                letterSpacing: '0.04em',
              }}
            >
              [ × ]
            </button>
          </div>
          <Row label="Display" value={state.display} onChange={(v) => update({ display: v })} />
          <WeightRow
            label="Display Weight"
            value={state.displayWeight}
            onChange={(v) => update({ displayWeight: v })}
          />
          <Row label="Body" value={state.body} onChange={(v) => update({ body: v })} />
          <Row label="Mono" value={state.mono} onChange={(v) => update({ mono: v })} />
          <div style={{ marginTop: 10, textAlign: 'right' }}>
            <button
              type="button"
              onClick={reset}
              style={{
                background: 'transparent',
                color: '#E9E5DA',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                fontFamily: 'inherit',
                fontSize: 11,
                letterSpacing: '0.04em',
                opacity: 0.7,
              }}
            >
              [ reset ]
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  onChange,
}: {
  label: string;
  value: FontKey;
  onChange: (v: FontKey) => void;
}) {
  return (
    <label
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
      }}
    >
      <span style={{ textTransform: 'uppercase', opacity: 0.7 }}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as FontKey)}
        style={{
          background: 'rgba(255,255,255,0.05)',
          color: '#E9E5DA',
          border: '1px solid rgba(233,229,218,0.2)',
          fontFamily: 'inherit',
          fontSize: 11,
          padding: '4px 6px',
          letterSpacing: '0.04em',
          borderRadius: 0,
          outline: 'none',
        }}
      >
        <option value="graphik-wide">graphik-wide</option>
        <option value="space-grotesk">space-grotesk</option>
        <option value="space-mono">space-mono</option>
      </select>
    </label>
  );
}

function WeightRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
      }}
    >
      <span style={{ textTransform: 'uppercase', opacity: 0.7 }}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          background: 'rgba(255,255,255,0.05)',
          color: '#E9E5DA',
          border: '1px solid rgba(233,229,218,0.2)',
          fontFamily: 'inherit',
          fontSize: 11,
          padding: '4px 6px',
          letterSpacing: '0.04em',
          borderRadius: 0,
          outline: 'none',
        }}
      >
        {WEIGHTS.map((w) => (
          <option key={w.value} value={w.value}>
            {w.label}
          </option>
        ))}
      </select>
    </label>
  );
}
