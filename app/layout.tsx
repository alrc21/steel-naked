import type { Metadata, Viewport } from 'next';
import dynamic from 'next/dynamic';
import { graphikWide, spaceGrotesk, spaceMono } from '@/lib/fonts';
import { SmoothScroll } from '@/components/shared/SmoothScroll';
import { TweaksHydrator } from '@/components/shared/EditorMode/TweaksHydrator';
import { BrandSignature } from '@/components/shared/BrandSignature';
import legal from '@/legal.config.json';
import './globals.css';

// Internal design tools (Shift+T / Shift+E): only compiled into builds with
// NEXT_PUBLIC_EDITOR=1 (e.g. `NEXT_PUBLIC_EDITOR=1 pnpm dev`).
const TweakPanel =
  process.env.NEXT_PUBLIC_EDITOR === '1'
    ? dynamic(() => import('@/components/shared/TweakPanel').then((m) => m.TweakPanel))
    : () => null;
const EditorRoot =
  process.env.NEXT_PUBLIC_EDITOR === '1'
    ? dynamic(() => import('@/components/shared/EditorMode/EditorRoot').then((m) => m.EditorRoot))
    : () => null;

export const metadata: Metadata = {
  metadataBase: new URL(legal.web),
  title: {
    default: 'STEEL NAKED — Near-future. Brutally permanent.',
    template: '%s · STEEL NAKED',
  },
  description:
    'Near-future seating sculpted from a single sheet of stainless steel. Designed and crafted in Valencia, Spain. Limited founder edition.',
  openGraph: {
    siteName: 'STEEL NAKED',
    title: 'STEEL NAKED™',
    description: 'Near-future. Brutally permanent.',
    type: 'website',
    url: '/',
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: '#E6E6E6',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${graphikWide.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`}
      style={{ ['--font-wordmark' as string]: graphikWide.style.fontFamily }}
    >
      <body>
        <TweaksHydrator />
        <SmoothScroll />
        <BrandSignature />
        {children}
        <TweakPanel />
        <EditorRoot />
      </body>
    </html>
  );
}
