'use client';
import Image from 'next/image';

export function Hero() {
  return (
    <section
      className="relative w-full bg-[var(--color-paper)]"
      style={{ height: '92vh', padding: 'clamp(20px, 3vw, 32px)' }}
    >
      <div className="relative w-full h-full overflow-hidden bg-[var(--color-paper-2)]">
        <Image
          src="/images/hero-b.webp"
          alt="Steel Naked™"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
