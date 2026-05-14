import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'STEEL NAKED — two interpretations',
  description: 'Two design interpretations. Pick one.',
};

export default function Landing() {
  return (
    <main className="relative min-h-screen w-full bg-[var(--color-paper)]">
      <header className="absolute top-0 inset-x-0 z-20 px-[var(--gutter)] py-6 flex items-center justify-between">
        <div className="font-mono uppercase text-[11px] tracking-[0.18em]">STEEL NAKED™</div>
        <div className="font-mono uppercase text-[10px] tracking-[0.18em] text-[var(--color-mute)]">
          two interpretations · select
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
        <Card
          href="/a"
          image="/images/hero-a.webp"
          label="_a · brutalist edition"
          title="Sheet,"
          titleAccent="folded."
          italic={false}
        />
        <Card
          href="/b"
          image="/images/hero-b.webp"
          label="_b · editorial edition"
          title="Steel,"
          titleAccent="sculpted."
          italic
        />
      </div>
    </main>
  );
}

type CardProps = {
  href: string;
  image: string;
  label: string;
  title: string;
  titleAccent: string;
  italic: boolean;
};

function Card({ href, image, label, title, titleAccent, italic }: CardProps) {
  return (
    <Link
      href={href}
      className="relative group overflow-hidden h-screen md:h-auto md:min-h-screen flex items-end p-[var(--gutter)] text-[var(--color-paper)]"
    >
      <Image
        src={image}
        alt=""
        fill
        sizes="50vw"
        className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-[var(--color-ink)]/35 group-hover:bg-[var(--color-ink)]/20 transition-colors duration-700" />
      <div className="relative z-10">
        <div className="font-mono uppercase text-[10px] tracking-[0.18em] text-[var(--color-paper)]/80 mb-6">
          {label}
        </div>
        <div
          className="font-display tracking-[-0.02em] leading-[0.95]"
          style={{ fontSize: 'clamp(40px, 7vw, 120px)' }}
        >
          {title}{' '}
          <span className={italic ? 'italic text-[var(--color-accent)]' : ''}>{titleAccent}</span>
        </div>
        <div className="font-mono uppercase text-[11px] tracking-[0.18em] text-[var(--color-paper)] mt-6 inline-flex items-center gap-2 border-b border-[var(--color-paper)]/60 group-hover:border-[var(--color-paper)] pb-1">
          enter →
        </div>
      </div>
    </Link>
  );
}
