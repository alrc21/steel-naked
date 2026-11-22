import localFont from 'next/font/local';

// Only the weights the site renders. Add a file back here before using a new
// weight/style, or the browser will synthesize it.
// Not preloaded either: above the fold on mobile there is no Graphik text (the
// topbar labels are hidden below sm/md), and the four .otf preloads (~310 KB)
// were downloading at High priority ahead of the hero image (the LCP).
export const graphikWide = localFont({
  src: [
    { path: '../public/fonts/graphik-wide/Graphik Wide Light.otf', weight: '300', style: 'normal' },
    { path: '../public/fonts/graphik-wide/Graphik Wide Regular.otf', weight: '400', style: 'normal' },
    { path: '../public/fonts/graphik-wide/Graphik Wide Medium.otf', weight: '500', style: 'normal' },
    { path: '../public/fonts/graphik-wide/Graphik Wide Bold.otf', weight: '700', style: 'normal' },
  ],
  variable: '--font-display',
  display: 'swap',
  preload: false,
});

// Not preloaded: the hero is image-only, so body/mono text is never what
// paints first; preloading it only competes with the LCP image.
export const spaceGrotesk = localFont({
  src: [
    { path: '../public/fonts/space-grotesk/SpaceGrotesk-Regular.otf', weight: '400', style: 'normal' },
    { path: '../public/fonts/space-grotesk/SpaceGrotesk-Medium.otf', weight: '500', style: 'normal' },
    { path: '../public/fonts/space-grotesk/SpaceGrotesk-SemiBold.otf', weight: '600', style: 'normal' },
  ],
  variable: '--font-sans',
  display: 'swap',
  preload: false,
});

export const spaceMono = localFont({
  src: [
    { path: '../public/fonts/space-mono/SpaceMono-Regular.ttf', weight: '400', style: 'normal' },
  ],
  variable: '--font-mono',
  display: 'swap',
  preload: false,
});
