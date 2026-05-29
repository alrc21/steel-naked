'use client';

import type { Tweak, FontFamilyKey } from '@/lib/tweaks/types';
import { Slider } from '../controls/Slider';
import { Segmented } from '../controls/Segmented';
import { tweaksStore } from '../useTweaksStore';

type Props = {
  id: string;
  tweak: Tweak;
};

const WEIGHT_LABELS: Record<number, string> = {
  100: 'Thin',
  200: 'Extralight',
  300: 'Light',
  400: 'Regular',
  500: 'Medium',
  600: 'Semibold',
  700: 'Bold',
  800: 'Extrabold',
  900: 'Black',
};

function parsePx(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : fallback;
}

function parseEm(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : fallback;
}

function isClamp(value: string | undefined): boolean {
  return typeof value === 'string' && value.trim().toLowerCase().startsWith('clamp(');
}

export function TypographyTab({ id, tweak }: Props) {
  const fsClamp = isClamp(tweak.fontSize);
  const fontSizePx = parsePx(tweak.fontSize, 16);
  const weight = tweak.fontWeight ?? 400;
  const ls = parseEm(tweak.letterSpacing, 0);
  const lh =
    typeof tweak.lineHeight === 'number'
      ? tweak.lineHeight
      : parseEm(typeof tweak.lineHeight === 'string' ? tweak.lineHeight : undefined, 1.2);

  return (
    <div>
      <Segmented<FontFamilyKey>
        label="Font Family"
        value={tweak.fontFamily}
        options={[
          { value: 'display', label: 'Display' },
          { value: 'sans', label: 'Sans' },
          { value: 'mono', label: 'Mono' },
        ]}
        onChange={(v) => tweaksStore.updateTweak(id, { fontFamily: v })}
      />

      {fsClamp ? (
        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              marginBottom: 4,
              textTransform: 'uppercase',
              opacity: 0.7,
              fontSize: 10,
              letterSpacing: '0.06em',
            }}
          >
            Font Size
          </div>
          <div
            style={{
              fontSize: 10,
              opacity: 0.7,
              marginBottom: 6,
              wordBreak: 'break-all',
            }}
          >
            current: {tweak.fontSize}
          </div>
          <button
            type="button"
            onClick={() => tweaksStore.updateTweak(id, { fontSize: '16px' })}
            style={{
              background: 'transparent',
              color: '#BBFF00',
              border: '1px solid rgba(187,255,0,0.4)',
              padding: '4px 8px',
              fontFamily: 'inherit',
              fontSize: 10,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              borderRadius: 0,
            }}
          >
            [ overwrite ]
          </button>
        </div>
      ) : (
        <Slider
          label="Font Size"
          value={fontSizePx}
          min={8}
          max={200}
          step={1}
          unit="px"
          onChange={(v) => tweaksStore.updateTweak(id, { fontSize: `${v}px` })}
        />
      )}

      <Slider
        label="Font Weight"
        value={weight}
        min={100}
        max={900}
        step={100}
        format={(v) => `${v} ${WEIGHT_LABELS[v] ?? ''}`}
        onChange={(v) => tweaksStore.updateTweak(id, { fontWeight: v })}
      />

      <Slider
        label="Letter Spacing"
        value={ls}
        min={-0.05}
        max={0.2}
        step={0.005}
        format={(v) => `${v.toFixed(3)}em`}
        onChange={(v) => tweaksStore.updateTweak(id, { letterSpacing: `${v}em` })}
      />

      <Slider
        label="Line Height"
        value={lh}
        min={0.8}
        max={2.0}
        step={0.05}
        format={(v) => v.toFixed(2)}
        onChange={(v) => tweaksStore.updateTweak(id, { lineHeight: v })}
      />
    </div>
  );
}
