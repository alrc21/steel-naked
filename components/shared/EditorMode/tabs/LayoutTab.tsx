'use client';

import type { Tweak, Alignment } from '@/lib/tweaks/types';
import { Segmented } from '../controls/Segmented';
import { tweaksStore } from '../useTweaksStore';

type Props = {
  id: string;
  tweak: Tweak;
};

export function LayoutTab({ id, tweak }: Props) {
  return (
    <div>
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
    </div>
  );
}
