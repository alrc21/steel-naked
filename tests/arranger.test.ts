import { describe, expect, it } from 'vitest';
import { settingText, type SettingRow } from '@/lib/arranger';

describe('settingText', () => {
  const rows: SettingRow[] = [
    { paso: 1, titular: 'Near-Future', wide: '/images/a.webp', vertical: '/images/v1.webp' },
    { paso: 2, titular: 'Brutally Permanent', wide: '/images/b.webp', vertical: '/images/v2.webp' },
  ];

  it('round-trips the ordered rows as JSON', () => {
    expect(JSON.parse(settingText(rows))).toEqual(rows);
  });

  it('is pretty-printed (multi-line)', () => {
    expect(settingText(rows).split('\n').length).toBeGreaterThan(1);
  });
});
