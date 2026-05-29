'use client';

import type { ChangeEvent } from 'react';

type Props = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  unit?: string;
  format?: (v: number) => string;
  hint?: string;
};

export function Slider({ label, value, min, max, step, onChange, unit, format, hint }: Props) {
  const display = format ? format(value) : `${value}${unit ?? ''}`;
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
          textTransform: 'uppercase',
          opacity: 0.7,
          fontSize: 10,
          letterSpacing: '0.06em',
        }}
      >
        <span>{label}</span>
        <span style={{ color: '#FFF7D4', opacity: 1 }}>{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={Number.isFinite(value) ? value : min}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value))}
        style={{
          width: '100%',
          accentColor: '#BBFF00',
          background: 'transparent',
          cursor: 'pointer',
        }}
      />
      {hint && (
        <div style={{ marginTop: 2, fontSize: 9, opacity: 0.5, letterSpacing: '0.04em' }}>
          {hint}
        </div>
      )}
    </div>
  );
}
