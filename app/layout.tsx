import type { Metadata, Viewport } from 'next';
import { graphikWide, spaceGrotesk, spaceMono } from '@/lib/fonts';
import { TweakPanel } from '@/components/shared/TweakPanel';
import { SmoothScroll } from '@/components/shared/SmoothScroll';
import { TweaksHydrator } from '@/components/shared/EditorMode/TweaksHydrator';
import { EditorRoot } from '@/components/shared/EditorMode/EditorRoot';
import { BrandSignature } from '@/components/shared/BrandSignature';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://steel-naked.vercel.app'),
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
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
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
