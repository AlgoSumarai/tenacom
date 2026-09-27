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
      <ArrowUpRight size={17} />
    </Link>
  );
}
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="eyebrow">
      <span />
      {children}
    </p>
  );
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
    <section className="page-intro container">
      <Eyebrow>{label}</Eyebrow>
      <h1>{title}</h1>
      <p className="lead">{description}</p>
    </section>
  );
}
export function FinalCTA() {
  return (
    <section className="final-cta">
      <div className="container cta-inner">
        <div>
          <Eyebrow>Start with the problem</Eyebrow>
          <h2>What should your physical systems be doing better?</h2>
          <p>You bring the challenge. We help engineer the solution.</p>
        </div>
        <Button>Discuss Your Project</Button>
      </div>
    </section>
  );
}
