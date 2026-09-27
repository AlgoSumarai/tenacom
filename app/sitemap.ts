import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';
export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/capabilities', '/solutions', '/industries', '/about', '/contact', '/privacy'].map(
    (path) => ({
      url: new URL(path, siteUrl).href,
      changeFrequency: 'monthly',
      priority: path ? 0.7 : 1,
    }),
  );
}
