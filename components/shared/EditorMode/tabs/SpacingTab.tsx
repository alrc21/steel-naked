'use client';

import type { Tweak } from '@/lib/tweaks/types';
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

export function SpacingTab({ id, tweak }: Props) {
  return (
    <div>
      <Slider
        label="Margin Top"
        value={parsePx(tweak.marginTop, 0)}
        min={0}
        max={240}
        step={4}
        unit="px"
        onChange={(v) => tweaksStore.updateTweak(id, { marginTop: `${v}px` })}
      />
      <Slider
        label="Margin Bottom"
        value={parsePx(tweak.marginBottom, 0)}
        min={0}
        max={240}
        step={4}
        unit="px"
        onChange={(v) => tweaksStore.updateTweak(id, { marginBottom: `${v}px` })}
      />
      <Slider
        label="Padding Top"
        value={parsePx(tweak.paddingTop, 0)}
        min={0}
        max={240}
        step={4}
        unit="px"
        onChange={(v) => tweaksStore.updateTweak(id, { paddingTop: `${v}px` })}
      />
      <Slider
        label="Padding Bottom"
        value={parsePx(tweak.paddingBottom, 0)}
        min={0}
        max={240}
        step={4}
        unit="px"
        onChange={(v) => tweaksStore.updateTweak(id, { paddingBottom: `${v}px` })}
      />
    </div>
  );
}
