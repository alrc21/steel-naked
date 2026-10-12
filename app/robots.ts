import type { MetadataRoute } from 'next';
import legal from '@/legal.config.json';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${legal.web}/sitemap.xml`,
  };
}
