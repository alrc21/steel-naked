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

  // v1 STUB: log only. v2 (2026-05-14) will insert into Supabase and send via Resend.
  console.info('[stub] /api/waitlist POST:', parsed.data);

  return NextResponse.json({ ok: true, stub: true });
}
