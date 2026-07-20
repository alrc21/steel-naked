import { promises as fs } from 'fs';
import path from 'path';

// Local-only helper for the editor's PhotoArranger: lists the images available
// in public/images so newly dropped files show up without a code change.
// Enabled in dev and in a local `next start`, but never on a real Vercel deploy.
export async function GET() {
  if (process.env.VERCEL) {
    return Response.json({ ok: false, error: 'Disabled on deploy' }, { status: 403 });
  }
  try {
    const dir = path.join(process.cwd(), 'public', 'images');
    const files = await fs.readdir(dir);
    const images = files
      .filter((f) => /\.(webp|png|jpe?g|avif)$/i.test(f))
      .sort()
      .map((f) => `/images/${f}`);
    return Response.json({ ok: true, images });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
