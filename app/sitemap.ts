import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';
import { manufacturingServices } from '@/data/manufacturing';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    '',
    '/manufacturing',
    ...manufacturingServices.map(({ slug }) => `/manufacturing/${slug}`),
    '/capabilities',
    '/solutions',
    '/industries',
    '/about',
    '/contact',
    '/privacy',
  ].map((path) => ({
    url: new URL(path, siteUrl).href,
    changeFrequency: 'monthly',
    priority: path ? 0.7 : 1,
  }));
}
