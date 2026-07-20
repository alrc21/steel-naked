// Pure helper for the PhotoArranger editor tool. No React, no DOM — trivially testable.

export type PhotoStep = { bg: string; portrait: string };

/** A copyable, human-readable row for the setting the user hands back. */
export type SettingRow = { paso: number; titular: string; wide: string; vertical: string };

/** The "setting" the user copies and pastes back — pretty JSON, one row per step. */
export function settingText(rows: SettingRow[]): string {
  return JSON.stringify(rows, null, 2);
}
