import type { Metadata } from 'next';

export const productionOrigin = 'https://www.tenacom.co.za';

export function resolveSiteUrl(value?: string, production = process.env.NODE_ENV === 'production') {
  const url = new URL(value?.trim() || productionOrigin);
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
  ) {
    throw new Error('SITE_URL must be an HTTP(S) origin without credentials, a path or a query.');
  }
  if (url.hostname === 'tenacom.co.za' || url.hostname === 'www.tenacom.co.za') {
    return new URL(productionOrigin);
  }
  const local =
    url.hostname === 'localhost' ||
    url.hostname.endsWith('.localhost') ||
    url.hostname.startsWith('127.') ||
    url.hostname === '0.0.0.0' ||
    url.hostname === '[::1]';
  if (production && (url.protocol !== 'https:' || local)) {
    throw new Error(
      'Production SITE_URL must use a public HTTPS origin, such as ' + productionOrigin,
    );
  }
  return url;
}

export const siteUrl = resolveSiteUrl(process.env.SITE_URL);
export const isPreviewDeployment = process.env.VERCEL_ENV === 'preview';
export const siteDescription =
  'South African product engineering, mechanical design, embedded systems, software and automation. Turn your idea into a connected, working system with Tenacom.';
export const socialImage = {
  url: new URL('/opengraph-image', siteUrl).href,
  width: 1200,
  height: 630,
  alt: 'Tenacom — Physical systems. Digital intelligence.',
};

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const url = new URL(path, siteUrl).href;
  return {
    title: { absolute: `${title} | Tenacom` },
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | Tenacom`,
      description,
      url,
      siteName: 'Tenacom',
      type: 'website',
      locale: 'en_ZA',
      images: [socialImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Tenacom`,
      description,
      images: [socialImage],
    },
  };
}
