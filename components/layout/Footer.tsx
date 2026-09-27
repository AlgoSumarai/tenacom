import Link from 'next/link';
import { navigation } from '@/data/content';

export default function Footer() {
  return (
    <footer>
      <div className="container footer-top">
        <div>
          <Link className="footer-wordmark" href="/">
            tenacom
          </Link>
          <p>Physical systems. Digital intelligence.</p>
          <span className="footer-location">Engineering from South Africa.</span>
        </div>
        <nav aria-label="Footer navigation">
          {[...navigation, ['Contact', '/contact']].map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Tenacom</span>
        <Link href="/privacy">Privacy</Link>
        <span>Intelligent systems & product engineering</span>
      </div>
    </footer>
  );
}
