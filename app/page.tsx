import type { Metadata } from 'next';
import { Topbar } from '@/components/b/Topbar';
import { Hero } from '@/components/b/Hero';
import { About } from '@/components/b/About';
import { BrutallyPermanent } from '@/components/b/BrutallyPermanent';
import { Concept } from '@/components/b/Concept';
// Temporarily disabled while we refine the v2 layout:
// import { ThreeStudies } from '@/components/b/ThreeStudies';
// import { Materiality } from '@/components/b/Materiality';
// import { Experience } from '@/components/b/Experience';
// import { Philosophy } from '@/components/b/Philosophy';
import { WaitlistB } from '@/components/b/WaitlistB';
import { FooterB } from '@/components/b/FooterB';
import legal from '@/legal.config.json';

export const metadata: Metadata = {
  title: 'Steel Naked™ — Near-future seating, brutally permanent',
  description:
    'A radical seating object folded from one continuous sheet of stainless steel. Designed and crafted in Valencia, Spain.',
  alternates: { canonical: '/' },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Steel Naked',
  url: legal.web,
  logo: `${legal.web}/images/logo.svg`,
  email: legal.email,
  address: { '@type': 'PostalAddress', addressLocality: 'Valencia', addressCountry: 'ES' },
};

export default function Home() {
  return (
    <main className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Topbar />
      <Hero />
      <About />
      <BrutallyPermanent />
      <Concept />
      {/* <ThreeStudies /> */}
      {/* <Materiality /> */}
      {/* <Experience /> */}
      {/* <Philosophy /> */}
      <WaitlistB />
      <FooterB />
    </main>
  );
}
