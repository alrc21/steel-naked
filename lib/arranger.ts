// Pure helpers for the PhotoArranger editor tool. No React, no DOM — so they
// stay trivially testable.

export type PhotoStep = { bg: string; portrait: string };

/** Move the step at `index` by `delta` positions. Out-of-bounds is a no-op. */
export function moveStep(steps: PhotoStep[], index: number, delta: number): PhotoStep[] {
  const target = index + delta;
  if (index < 0 || index >= steps.length) return steps;
  if (target < 0 || target >= steps.length) return steps;
  const next = steps.slice();
  const [item] = next.splice(index, 1);
  next.splice(target, 0, item!); // index is bounds-checked above → always defined
  return next;
}

/** The copyable "setting" — exactly the ordered bg/portrait pairs to hand back. */
export function settingText(steps: PhotoStep[]): string {
  return JSON.stringify(steps, null, 2);
}
