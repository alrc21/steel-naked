'use client';

import type { Tweak } from '@/lib/tweaks/types';
import { COLOR_TOKENS } from '@/lib/tweaks/types';
import { Chip } from '../controls/Chip';
import { tweaksStore } from '../useTweaksStore';

type Props = {
  id: string;
  tweak: Tweak;
};

export function ColorTab({ id, tweak }: Props) {
  return (
    <div>
      <div
        style={{
          marginBottom: 8,
          textTransform: 'uppercase',
          opacity: 0.7,
          fontSize: 10,
          letterSpacing: '0.06em',
        }}
      >
        Color {tweak.color ? `(${tweak.color})` : ''}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 8,
        }}
      >
        {COLOR_TOKENS.map((token) => (
          <Chip
            key={token}
            token={token}
            active={tweak.color === token}
            onClick={() => tweaksStore.updateTweak(id, { color: token })}
          />
        ))}
      </div>
    </div>
  );
}
