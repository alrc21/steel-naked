import type { FontFamilyKey, Tweak, TweaksData } from './types';

function fontFamilyValue(key: FontFamilyKey): string {
  switch (key) {
    case 'display':
      return 'var(--font-display), serif';
    case 'sans':
      return 'var(--font-sans), system-ui, sans-serif';
    case 'mono':
      return 'var(--font-mono), ui-monospace, monospace';
  }
}

function tweakToDeclarations(tweak: Tweak): string[] {
  const decls: string[] = [];

  if (tweak.fontSize !== undefined) {
    decls.push(`font-size: ${tweak.fontSize} !important;`);
  }
  if (tweak.fontWeight !== undefined) {
    decls.push(`font-weight: ${tweak.fontWeight} !important;`);
  }
  if (tweak.letterSpacing !== undefined) {
    decls.push(`letter-spacing: ${tweak.letterSpacing} !important;`);
  }
  if (tweak.lineHeight !== undefined) {
    decls.push(`line-height: ${tweak.lineHeight} !important;`);
  }
  if (tweak.fontFamily !== undefined) {
    decls.push(`font-family: ${fontFamilyValue(tweak.fontFamily)} !important;`);
  }
  if (tweak.marginTop !== undefined) {
    decls.push(`margin-top: ${tweak.marginTop} !important;`);
  }
  if (tweak.marginBottom !== undefined) {
    decls.push(`margin-bottom: ${tweak.marginBottom} !important;`);
  }
  if (tweak.paddingTop !== undefined) {
    decls.push(`padding-top: ${tweak.paddingTop} !important;`);
  }
  if (tweak.paddingBottom !== undefined) {
    decls.push(`padding-bottom: ${tweak.paddingBottom} !important;`);
  }
  if (tweak.textAlign !== undefined) {
    decls.push(`text-align: ${tweak.textAlign} !important;`);
  }
  if (tweak.color !== undefined) {
    decls.push(`color: var(--color-${tweak.color}) !important;`);
  }

  return decls;
}

export function tweaksToStyleBlock(tweaks: TweaksData): string {
  const rules: string[] = [];

  for (const [id, tweak] of Object.entries(tweaks)) {
    if (!tweak || typeof tweak !== 'object') continue;
    const decls = tweakToDeclarations(tweak);
    if (decls.length === 0) continue;
    rules.push(`[data-tweak-id="${id}"] {\n  ${decls.join('\n  ')}\n}`);
  }

  return rules.join('\n');
}
