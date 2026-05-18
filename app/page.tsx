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
  title: 'Steel Naked™ — Near-future seating, brutally permanent',
  description:
    'A radical seating object folded from one continuous sheet of stainless steel. Designed and crafted in Valencia, Spain.',
};

export default function Home() {
  return (
    <main className="relative">
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
