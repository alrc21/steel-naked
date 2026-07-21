import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Steel Naked™',
    short_name: 'Steel Naked',
    description:
      'Near-future seating, brutally permanent — folded from one continuous sheet of stainless steel. Valencia, Spain.',
    start_url: '/',
    display: 'standalone',
    background_color: '#141414',
    theme_color: '#141414',
    icons: [{ src: '/favicon.ico', sizes: '256x256', type: 'image/x-icon' }],
  };
}
