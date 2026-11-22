import type { MetadataRoute } from 'next';
import legal from '@/legal.config.json';

const BASE = legal.web;

// Fixed dates: bump a route's date when its content actually changes
// (a build-time `new Date()` makes Google ignore lastmod).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, lastModified: '2026-10-12', changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE}/privacy`, lastModified: '2026-07-21', changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/legal-notice`, lastModified: '2026-07-21', changeFrequency: 'yearly', priority: 0.3 },
  ];
}
