import { NextResponse } from 'next/server';
import { waitlistSchema, normalizeEmail } from '@/components/shared/waitlist-schema';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const parsed = waitlistSchema.safeParse(
    typeof json === 'object' && json !== null
      ? { ...json, email: normalizeEmail((json as { email?: string }).email ?? '') }
      : {}
  );

  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid input' }, { status: 422 });
  }

  // No persistence yet (v2: Supabase + Resend). Say so instead of a fake ok,
  // and never log the submitted email.
  return NextResponse.json({ error: 'waitlist not live yet' }, { status: 503 });
}
