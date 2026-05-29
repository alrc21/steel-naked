import { promises as fs } from 'fs';
import path from 'path';
import { TWEAK_PROPS, type Tweak, type TweaksData } from '@/lib/tweaks/types';

const ALLOWED_KEYS = new Set<keyof Tweak>([
  ...TWEAK_PROPS.typography,
  ...TWEAK_PROPS.spacing,
  ...TWEAK_PROPS.layout,
  ...TWEAK_PROPS.color,
]);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validateTweaks(input: unknown): TweaksData | null {
  if (!isPlainObject(input)) return null;
  const result: TweaksData = {};
  for (const [id, value] of Object.entries(input)) {
    if (!isPlainObject(value)) return null;
    const cleaned: Tweak = {};
    for (const key of Object.keys(value)) {
      if (!ALLOWED_KEYS.has(key as keyof Tweak)) return null;
      (cleaned as Record<string, unknown>)[key] = value[key];
    }
    result[id] = cleaned;
  }
  return result;
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return Response.json({ ok: false, error: 'Disabled in production' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!isPlainObject(body) || !('tweaks' in body)) {
    return Response.json({ ok: false, error: 'Missing tweaks field' }, { status: 400 });
  }

  const tweaks = validateTweaks((body as { tweaks: unknown }).tweaks);
  if (!tweaks) {
    return Response.json({ ok: false, error: 'Invalid tweaks payload' }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), 'content', 'tweaks.json');
    await fs.writeFile(filePath, JSON.stringify(tweaks, null, 2) + '\n', 'utf-8');
    return Response.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
