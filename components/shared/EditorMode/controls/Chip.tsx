'use client';

import type { ColorToken } from '@/lib/tweaks/types';

type Props = {
  token: ColorToken;
  active: boolean;
  onClick: () => void;
};

export function Chip({ token, active, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={token}
      title={token}
      style={{
        width: 24,
        height: 24,
        background: `var(--color-${token})`,
        border: 'none',
        outline: active ? '2px solid #BBFF00' : '1px solid rgba(233,229,218,0.2)',
        outlineOffset: active ? 1 : 0,
        cursor: 'pointer',
        padding: 0,
        borderRadius: 0,
      }}
    />
  );
}
