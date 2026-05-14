# Steel Naked™ — Web v1

Two single-page design interpretations of the Steel Naked™ coming-soon site, deployed together on Vercel:

- `/a` — **Brutalist Edition** (mono, monolithic, scroll-driven, inspired by carlesfaus.com + the original `studio.html`)
- `/b` — **Editorial Edition** (italic-accent, serif/sans dialogue, "Three studies" focal, inspired by marasrl.it + the original `italic.html`)
- `/` — landing selector to compare the two

## Stack

- Next.js 15 (App Router) + TypeScript strict
- Tailwind v4 + CSS custom properties
- Motion (ex-Framer Motion) for reveals/parallax/stagger
- next/font/local for Graphik Wide, Space Grotesk, Space Mono
- next/image for optimized photography
- Vercel deploy

## Development

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

## Status

**v1 (this commit set):** frontend complete, waitlist form is a UI stub (logs to console, no persistence).
**v2 (next):** connect `/api/waitlist` to Supabase + Resend for real persistence and confirmation email.

## Brand

Steel Naked™ — Near-future. Brutally permanent. A sculptural seating object crafted from a single folded sheet of stainless steel. Designed and crafted in Valencia, Spain. Limited founder edition.
