export type ColorToken =
  | 'ink'
  | 'ink-2'
  | 'paper'
  | 'paper-2'
  | 'mute'
  | 'steel'
  | 'dark'
  | 'stone'
  | 'accent'
  | 'accent-2';

export type Alignment = 'left' | 'center' | 'right';

export type FontFamilyKey = 'display' | 'sans' | 'mono';

export type Tweak = {
  fontSize?: string;
  fontWeight?: number;
  letterSpacing?: string;
  lineHeight?: string | number;
  fontFamily?: FontFamilyKey;
  marginTop?: string;
  marginBottom?: string;
  paddingTop?: string;
  paddingBottom?: string;
  textAlign?: Alignment;
  color?: ColorToken;
};

export type TweaksData = Record<string, Tweak>;

export const TWEAK_PROPS = {
  typography: ['fontSize', 'fontWeight', 'letterSpacing', 'lineHeight', 'fontFamily'] as const,
  spacing: ['marginTop', 'marginBottom', 'paddingTop', 'paddingBottom'] as const,
  layout: ['textAlign'] as const,
  color: ['color'] as const,
} as const;

export const COLOR_TOKENS: ReadonlyArray<ColorToken> = [
  'ink',
  'ink-2',
  'paper',
  'paper-2',
  'mute',
  'steel',
  'dark',
  'stone',
  'accent',
  'accent-2',
];

export const ALIGNMENTS: ReadonlyArray<Alignment> = ['left', 'center', 'right'];

export const FONT_FAMILIES: ReadonlyArray<FontFamilyKey> = ['display', 'sans', 'mono'];

export const TWEAKABLE_IDS = [
  'topbar-nav',
  'topbar-locale',
  'hero-image',
  'about-section',
  'about-label',
  'about-eyebrow',
  'about-headline',
  'about-image',
  'about-caption-1',
  'about-caption-2',
  'about-indicator',
  'concept-section',
  'concept-eyebrow',
  'concept-headline',
  'concept-caption',
  'bp-preview-label',
  'bp-step-counter',
  'bp-headline',
  'bp-caption',
  'waitlist-section',
  'waitlist-headline',
  'waitlist-form',
  'waitlist-cta',
  'footer-section',
  'footer-tagline',
  'footer-links',
] as const;

export type TweakableId = (typeof TWEAKABLE_IDS)[number];
