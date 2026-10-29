import type { ManufacturingService } from '../data/manufacturing';
import { siteDescription, siteUrl } from './site';

const organization = {
  '@type': 'Organization',
  '@id': new URL('/#organization', siteUrl).href,
  name: 'Tenacom',
  url: siteUrl.href,
  description: siteDescription,
  logo: new URL('/brand/tenacom.png', siteUrl).href,
};

export function websiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization,
      {
        '@type': 'WebSite',
        '@id': new URL('/#website', siteUrl).href,
        name: 'Tenacom',
        url: siteUrl.href,
        inLanguage: 'en-ZA',
        publisher: { '@id': organization['@id'] },
      },
    ],
  };
}

export function serviceStructuredData(service: ManufacturingService) {
  const url = new URL(`/manufacturing/${service.slug}`, siteUrl).href;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: service.name,
        serviceType: service.name,
        description: service.description,
        url,
        provider: organization,
        areaServed: { '@type': 'Country', name: 'South Africa' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl.href },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Manufacturing',
            item: new URL('/manufacturing', siteUrl).href,
          },
          { '@type': 'ListItem', position: 3, name: service.name, item: url },
        ],
      },
    ],
  };
}
