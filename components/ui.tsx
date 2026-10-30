import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';

export function Button({
  children,
  href = '/contact',
  secondary = false,
}: {
  children: ReactNode;
  href?: string;
  secondary?: boolean;
}) {
  return (
    <Link className={`button ${secondary ? 'secondary' : ''}`} href={href}>
      {children}
      <ArrowUpRight size={16} />
    </Link>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

export function PageIntro({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <section className="page-intro">
      <div className="container">
        <Eyebrow>{label}</Eyebrow>
        <h1>{title}</h1>
        <p className="lead">{description}</p>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="final-cta">
      <Image
        src="/images/engineer-factory.jpg"
        alt="Engineer reviewing information in an industrial facility"
        fill
        sizes="100vw"
      />
      <div className="cta-shade" />
      <div className="container cta-inner">
        <div>
          <Eyebrow>Start with the problem</Eyebrow>
          <h2>What should your physical systems be doing better?</h2>
        </div>
        <Button>Discuss your project</Button>
      </div>
    </section>
  );
}
