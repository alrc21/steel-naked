import type { MetadataRoute } from 'next';

const BASE = 'https://steel-naked.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/legal-notice`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
