// Data for the scroll-driven "Brutally Permanent" section (page section 03).
// Single source of truth — read by both the section component and the editor's
// PhotoArranger. Backgrounds MUST be landscape (2400×1339); portraits 1340×2400.

export type BrutallyStep = {
  bg: string; // wide, full-bleed background
  portrait: string; // vertical, centered card
  headline: string; // big display headline (changes each step)
  label: string;
  counter: string;
  caption: string;
};

export const STEPS: readonly BrutallyStep[] = [
  {
    bg: '/images/hero-c.webp',
    portrait: '/images/bg09.webp',
    headline: 'Near-Future',
    label: '[ THE_ANTIDOTE ]',
    counter: '[ 01 / 03 ]',
    caption:
      'Designed as an antidote to disposable\nculture — an object made to survive\ntrends, seasons and obsolescence.',
  },
  {
    bg: '/images/hero-sunset.webp',
    portrait: '/images/bg-cave.webp',
    headline: 'Brutally Permanent',
    label: '[ THE_FOLD ]',
    counter: '[ 02 / 03 ]',
    caption:
      'A single sheet folded with intention.\nNo screws, no joints — only the geometry\nof steel under tension.',
  },
  {
    bg: '/images/hero-a.webp',
    portrait: '/images/bg-ocean.webp',
    headline: 'Collectible Seating',
    label: '[ THE_GESTURE ]',
    counter: '[ 03 / 03 ]',
    caption:
      'Forged in Valencia. Built to outlive\nthe rooms it inhabits. Not a chair —\na statement folded from one gesture.',
  },
];
