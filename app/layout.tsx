import type { Metadata } from 'next';
import { Manrope, IBM_Plex_Mono } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { isPreviewDeployment, siteDescription, siteUrl, socialImage } from '@/lib/site';
import './globals.css';
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' });
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});
export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: 'Engineering & Intelligent Systems in South Africa | Tenacom',
    template: '%s | Tenacom',
  },
  description: siteDescription,
  applicationName: 'Tenacom',
  robots: isPreviewDeployment
    ? { index: false, follow: false }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
          'max-video-preview': -1,
        },
      },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION
      ? { 'msvalidate.01': process.env.BING_SITE_VERIFICATION }
      : undefined,
  },
  openGraph: {
    type: 'website',
    siteName: 'Tenacom',
    locale: 'en_ZA',
    images: [socialImage],
  },
  twitter: { card: 'summary_large_image', images: [socialImage] },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-ZA" data-scroll-behavior="smooth">
      <body className={`${manrope.variable} ${mono.variable}`}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
