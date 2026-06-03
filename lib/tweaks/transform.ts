import type { Alignment, Tweak } from './types';

export function composeTransform(
  t: Pick<Tweak, 'translateX' | 'translateY' | 'scale'>,
): string | undefined {
  const parts: string[] = [];
  if (t.translateX !== undefined || t.translateY !== undefined) {
    parts.push(`translate(${t.translateX ?? '0px'}, ${t.translateY ?? '0px'})`);
  }
  if (t.scale !== undefined) {
    parts.push(`scale(${t.scale})`);
  }
  return parts.length > 0 ? parts.join(' ') : undefined;
}

export function alignToMargins(
  align: Alignment,
): { marginLeft: string; marginRight: string } {
  switch (align) {
    case 'left':
      return { marginLeft: '0', marginRight: 'auto' };
    case 'center':
      return { marginLeft: 'auto', marginRight: 'auto' };
    case 'right':
      return { marginLeft: 'auto', marginRight: '0' };
  }
}
