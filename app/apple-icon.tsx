import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

// Branded apple-touch-icon: near-black field, lime "SN" monogram.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0d0c0a',
          color: '#BBFF00',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 96,
          fontWeight: 700,
          letterSpacing: -4,
          fontFamily: 'system-ui',
        }}
      >
        SN
      </div>
    ),
    { ...size }
  );
}
