import type { Metadata } from 'next';
import { Topbar } from '@/components/b/Topbar';
import { Hero } from '@/components/b/Hero';
import { About } from '@/components/b/About';
import { Concept } from '@/components/b/Concept';
import { ThreeStudies } from '@/components/b/ThreeStudies';
import { Materiality } from '@/components/b/Materiality';
import { Experience } from '@/components/b/Experience';
import { Philosophy } from '@/components/b/Philosophy';
import { WaitlistB } from '@/components/b/WaitlistB';
import { FooterB } from '@/components/b/FooterB';

export const metadata: Metadata = {
  title: 'Editorial Edition',
  description:
    'Sculpted from steel, folded with precision. Steel Naked™ — editorial edition.',
};

export default function VersionB() {
  return (
    <main className="font-b relative">
      <Topbar />
      <Hero />
      <About />
      <Concept />
      <ThreeStudies />
      <Materiality />
      <Experience />
      <Philosophy />
      <WaitlistB />
      <FooterB />
    </main>
  );
}
