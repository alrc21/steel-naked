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
};

const STORAGE_KEY = 'sn:tweak';

type State = { display: FontKey; body: FontKey; mono: FontKey };

function applyToRoot(state: State) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--font-display', FONT_VAR[state.display]);
  root.style.setProperty('--font-sans', FONT_VAR[state.body]);
  root.style.setProperty('--font-mono', FONT_VAR[state.mono]);
}

function clearRoot() {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.removeProperty('--font-display');
  root.style.removeProperty('--font-sans');
  root.style.removeProperty('--font-mono');
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
    function onKey(e: KeyboardEvent) {
      if (e.key === '?') {
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
