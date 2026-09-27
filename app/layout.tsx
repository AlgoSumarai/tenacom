import type { Metadata } from 'next';
import { getImageProps } from 'next/image';
import { Manrope, IBM_Plex_Mono } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { siteUrl } from '@/lib/site';
import './globals.css';
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' });
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});
const favicon = getImageProps({ src: '/brand/tenacom.png', alt: 'Tenacom', width: 32, height: 32 })
  .props.src;
export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: 'Tenacom | Engineering intelligence into the physical world',
    template: '%s | Tenacom',
  },
  description:
    'Tenacom combines mechanical engineering, connected systems and software to help businesses monitor, control and automate physical operations.',
  openGraph: {
    type: 'website',
    siteName: 'Tenacom',
    locale: 'en_ZA',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: favicon },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-ZA">
      <body className={`${manrope.variable} ${mono.variable}`}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        {process.env.SITE_URL && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'Tenacom',
                url: siteUrl.href,
                description: 'A South African intelligent systems and product engineering company.',
                logo: new URL('/brand/tenacom.png', siteUrl).href,
              }).replace(/</g, '\\u003c'),
            }}
          />
        )}
      </body>
    </html>
  );
}
