import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'STEEL NAKED — Near-future. Brutally permanent.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/jpeg';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0d0c0a',
          color: '#f5f2eb',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          fontFamily: 'system-ui',
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 4, textTransform: 'uppercase', opacity: 0.6 }}>
          STEEL NAKED™
        </div>
        <div style={{ fontSize: 96, lineHeight: 1, fontWeight: 300, maxWidth: 900 }}>
          Near-future.
          <br />
          <span style={{ fontStyle: 'italic', color: '#c0573a' }}>Brutally</span> permanent.
        </div>
        <div style={{ fontSize: 18, letterSpacing: 3, textTransform: 'uppercase', opacity: 0.5 }}>
          Sculpted from steel · Valencia, Spain · 2026
        </div>
      </div>
    ),
    { ...size }
  );
}
