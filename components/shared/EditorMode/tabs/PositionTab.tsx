'use client';

import type { Tweak, Alignment } from '@/lib/tweaks/types';
import { Segmented } from '../controls/Segmented';
import { Slider } from '../controls/Slider';
import { tweaksStore } from '../useTweaksStore';

type Props = {
  id: string;
  tweak: Tweak;
};

function parsePx(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : fallback;
}

export function PositionTab({ id, tweak }: Props) {
  return (
    <div>
      <Segmented<Alignment>
        label="Block Align"
        value={tweak.align}
        options={[
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'right', label: 'Right' },
        ]}
        onChange={(v) => tweaksStore.updateTweak(id, { align: v })}
      />
      <Segmented<Alignment>
        label="Text Align"
        value={tweak.textAlign}
        options={[
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'right', label: 'Right' },
        ]}
        onChange={(v) => tweaksStore.updateTweak(id, { textAlign: v })}
      />
      <Slider
        label="Nudge X"
        value={parsePx(tweak.translateX, 0)}
        min={-300}
        max={300}
        step={1}
        unit="px"
        hint="← → arrows nudge 1px · Shift 10px"
        onChange={(v) => tweaksStore.updateTweak(id, { translateX: `${v}px` })}
      />
      <Slider
        label="Nudge Y"
        value={parsePx(tweak.translateY, 0)}
        min={-300}
        max={300}
        step={1}
        unit="px"
        onChange={(v) => tweaksStore.updateTweak(id, { translateY: `${v}px` })}
      />
      <Slider
        label="Max Width"
        value={parsePx(tweak.maxWidth, 0)}
        min={0}
        max={1400}
        step={10}
        format={(v) => (v === 0 ? 'none' : `${v}px`)}
        onChange={(v) =>
          tweaksStore.updateTweak(id, v === 0 ? { maxWidth: 'none' } : { maxWidth: `${v}px` })
        }
      />
      <Slider
        label="Scale"
        value={tweak.scale ?? 1}
        min={0.2}
        max={3}
        step={0.05}
        format={(v) => `${v.toFixed(2)}×`}
        onChange={(v) => tweaksStore.updateTweak(id, { scale: v })}
      />
      <Slider
        label="Opacity"
        value={tweak.opacity ?? 1}
        min={0}
        max={1}
        step={0.01}
        format={(v) => v.toFixed(2)}
        onChange={(v) => tweaksStore.updateTweak(id, { opacity: v })}
      />
    </div>
  );
}
