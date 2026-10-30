import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Button, Eyebrow, FinalCTA } from '@/components/ui';
import { capabilities, process, solutions } from '@/data/content';
import { pageMetadata, siteDescription } from '@/lib/site';
import StructuredData from '@/components/StructuredData';
import { websiteStructuredData } from '@/lib/structured-data';

export const metadata = pageMetadata(
  'Engineering & Intelligent Systems in South Africa',
  siteDescription,
  '/',
);

export default function Home() {
  return (
    <>
      <StructuredData data={websiteStructuredData()} />
      <section className="home-hero">
        <Image
          src="/images/engineers-pcb.jpg"
          alt="Engineers inspecting an electronic assembly in a workshop"
          fill
          priority
          sizes="100vw"
          className="hero-photo"
        />
        <div className="hero-shade" />
        <div className="container hero-content">
          <Eyebrow>Intelligent systems & product engineering</Eyebrow>
          <h1>
            Physical systems.
            <br />
            Digital intelligence.
          </h1>
          <p>We engineer the mechanical, connected and software layers as one working system.</p>
          <div className="hero-actions">
            <Button>Discuss your project</Button>
            <Link className="quiet-link light-link" href="/capabilities">
              See our capabilities <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <div className="container hero-meta" aria-label="Tenacom at a glance">
          <span>South Africa</span>
          <span>Mechanical + connected + software</span>
          <span>From problem to working system</span>
        </div>
      </section>

      <section className="section statement-section">
        <div className="container statement-grid">
          <Eyebrow>What we do</Eyebrow>
          <div>
            <h2>One engineering partner across the physical and digital system.</h2>
            <p>
              Tenacom is a South African engineering company helping organisations see, understand
              and improve what is happening in the real world—from a connected product to a
              distributed operation.
            </p>
          </div>
        </div>
      </section>

      <section className="section capability-section">
        <div className="container">
          <div className="section-heading compact-heading">
            <div>
              <Eyebrow>Capabilities</Eyebrow>
              <h2>Disciplines that work together.</h2>
            </div>
            <Link className="text-link" href="/capabilities">
              View all capabilities <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="capability-list">
            {capabilities.map((item, index) => (
              <Link href={`/capabilities#capability-${index + 1}`} key={item.title}>
                <span>0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.short}</p>
                <ArrowUpRight size={18} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section people-section">
        <div className="container people-grid">
          <figure className="editorial-image portrait-image">
            <Image
              src="/images/engineers-prototype.jpg"
              alt="Engineers discussing a prototype in a workshop"
              fill
              sizes="(max-width: 800px) 100vw, 52vw"
            />
          </figure>
          <div className="people-copy">
            <Eyebrow>How we think</Eyebrow>
            <h2>Engineering improves when the disciplines share the same table.</h2>
            <p>
              Mechanical fit, sensing, control and software decisions affect one another. We work
              through those trade-offs early, before they become expensive problems in the field.
            </p>
            <Link className="text-link" href="/about">
              About Tenacom <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section applications-section">
        <div className="container">
          <div className="section-heading compact-heading">
            <div>
              <Eyebrow>Example applications</Eyebrow>
              <h2>Built around an operational need.</h2>
            </div>
            <p>Illustrative possibilities—not claims of completed client work.</p>
          </div>
          <div className="application-list">
            {solutions.slice(0, 4).map((solution, index) => (
              <Link href={`/solutions#solution-${index + 1}`} key={solution.title}>
                <span>{solution.category}</span>
                <h3>{solution.title}</h3>
                <p>{solution.description}</p>
                <ArrowUpRight size={18} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section process-section" id="process">
        <div className="container process-layout">
          <div className="process-intro">
            <Eyebrow>How we work</Eyebrow>
            <h2>Start with the problem. Prove the system.</h2>
            <p>You do not need a finished specification before speaking to us.</p>
          </div>
          <figure className="editorial-image process-image">
            <Image
              src="/images/engineer-cad.jpg"
              alt="Engineer using CAD software beside a physical test rig"
              fill
              sizes="(max-width: 800px) 100vw, 46vw"
            />
          </figure>
          <ol className="process-list">
            {process.map(([title, body], index) => (
              <li key={title}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
