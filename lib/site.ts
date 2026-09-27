import type { Metadata } from 'next';
export const siteUrl = new URL(process.env.SITE_URL || 'http://localhost:3000');
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title: { absolute: `${title} | Tenacom` },
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | Tenacom`,
      description,
      url: path,
      siteName: 'Tenacom',
      type: 'website',
      locale: 'en_ZA',
      images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title: `${title} | Tenacom`, description },
  };
}
