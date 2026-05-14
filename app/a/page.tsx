import type { Metadata } from 'next';
import { CornersUI } from '@/components/a/CornersUI';
import { Hero } from '@/components/a/Hero';
import { PlateGrid } from '@/components/a/PlateGrid';
import { Manifesto } from '@/components/a/Manifesto';
import { WaitlistA } from '@/components/a/WaitlistA';
import { FooterA } from '@/components/a/FooterA';
import { Cursor } from '@/components/shared/Cursor';

export const metadata: Metadata = {
  title: 'Brutalist Edition',
  description: 'One sheet. One gesture. One object. Steel Naked™ — brutalist edition.',
};

export default function VersionA() {
  return (
    <main className="relative">
      <Cursor variant="brutalist" />
      <CornersUI />
      <Hero />
      <PlateGrid />
      <Manifesto />
      <WaitlistA />
      <FooterA />
    </main>
  );
}
