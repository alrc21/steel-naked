import localFont from 'next/font/local';

export const graphikWide = localFont({
  src: [
    { path: '../public/fonts/graphik-wide/Graphik Wide Thin.otf', weight: '100', style: 'normal' },
    { path: '../public/fonts/graphik-wide/Graphik Wide Thin Italic.otf', weight: '100', style: 'italic' },
    { path: '../public/fonts/graphik-wide/Graphik Wide Extralight.otf', weight: '200', style: 'normal' },
    { path: '../public/fonts/graphik-wide/Graphik Wide Extralight Italic.otf', weight: '200', style: 'italic' },
    { path: '../public/fonts/graphik-wide/Graphik Wide Light.otf', weight: '300', style: 'normal' },
    { path: '../public/fonts/graphik-wide/Graphik Wide Light Italic.otf', weight: '300', style: 'italic' },
    { path: '../public/fonts/graphik-wide/Graphik Wide Regular.otf', weight: '400', style: 'normal' },
    { path: '../public/fonts/graphik-wide/Graphik Wide Regular Italic.otf', weight: '400', style: 'italic' },
    { path: '../public/fonts/graphik-wide/Graphik Wide Medium.otf', weight: '500', style: 'normal' },
    { path: '../public/fonts/graphik-wide/Graphik Wide Medium Italic.otf', weight: '500', style: 'italic' },
    { path: '../public/fonts/graphik-wide/Graphik Wide Semibold.otf', weight: '600', style: 'normal' },
    { path: '../public/fonts/graphik-wide/Graphik Wide Semibold Italic.otf', weight: '600', style: 'italic' },
    { path: '../public/fonts/graphik-wide/Graphik Wide Bold.otf', weight: '700', style: 'normal' },
    { path: '../public/fonts/graphik-wide/Graphik Wide Bold Italic.otf', weight: '700', style: 'italic' },
    { path: '../public/fonts/graphik-wide/Graphik Wide Black.otf', weight: '900', style: 'normal' },
    { path: '../public/fonts/graphik-wide/Graphik Wide Black Italic.otf', weight: '900', style: 'italic' },
  ],
  variable: '--font-display',
  display: 'swap',
});

export const spaceGrotesk = localFont({
  src: [
    { path: '../public/fonts/space-grotesk/SpaceGrotesk-Light.otf', weight: '300', style: 'normal' },
    { path: '../public/fonts/space-grotesk/SpaceGrotesk-Regular.otf', weight: '400', style: 'normal' },
    { path: '../public/fonts/space-grotesk/SpaceGrotesk-Medium.otf', weight: '500', style: 'normal' },
    { path: '../public/fonts/space-grotesk/SpaceGrotesk-SemiBold.otf', weight: '600', style: 'normal' },
    { path: '../public/fonts/space-grotesk/SpaceGrotesk-Bold.otf', weight: '700', style: 'normal' },
  ],
  variable: '--font-sans',
  display: 'swap',
});

export const spaceMono = localFont({
  src: [
    { path: '../public/fonts/space-mono/SpaceMono-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/space-mono/SpaceMono-Italic.ttf', weight: '400', style: 'italic' },
    { path: '../public/fonts/space-mono/SpaceMono-Bold.ttf', weight: '700', style: 'normal' },
    { path: '../public/fonts/space-mono/SpaceMono-BoldItalic.ttf', weight: '700', style: 'italic' },
  ],
  variable: '--font-mono',
  display: 'swap',
});
