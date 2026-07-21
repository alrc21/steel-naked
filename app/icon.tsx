import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

// Branded favicon: "SN" monogram, lime on near-black — legible down to 16px
// (the STEELNAKED wordmark logo is too wide to read at favicon size).
export default function Icon() {
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
          fontSize: 40,
          fontWeight: 800,
          letterSpacing: -3,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        SN
      </div>
    ),
    { ...size }
  );
}
