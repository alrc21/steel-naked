import type { Metadata } from 'next';
import { graphikWide, spaceGrotesk, spaceMono } from '@/lib/fonts';
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
    title: 'STEEL NAKED™',
    description: 'Near-future. Brutally permanent.',
    images: [{ url: '/og.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${graphikWide.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
