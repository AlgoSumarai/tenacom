import Image from 'next/image';
import { PageIntro, FinalCTA, Eyebrow } from '@/components/ui';
import { pageMetadata } from '@/lib/site';
export const metadata = pageMetadata(
  'About Tenacom',
  'Meet Tenacom, a South African product engineering company bringing mechanical design, embedded systems and software together from concept to working system.',
  '/about',
);
export default function AboutPage() {
  return (
    <>
      <PageIntro
        label="About Tenacom"
        title="Engineering across disciplines."
        description="We bring mechanical engineering, connected systems and software into one practical engineering process."
      />
      <section className="container about-statement">
        <figure className="about-photo editorial-image">
          <Image
            src="/images/engineers-machine.jpg"
            alt="Engineers inspecting industrial machinery"
            fill
            sizes="(max-width: 800px) 100vw, 50vw"
          />
        </figure>
        <div>
          <Eyebrow>Direct access to the engineers</Eyebrow>
          <h2>People who stay close to the work.</h2>
          <p>
            Tenacom connects physical design, embedded systems and software so the complete system
            can be understood, built and tested together.
          </p>
        </div>
      </section>
      <section className="container about-pillars">
        <div className="about-pillar">
          <Eyebrow>Software & intelligent systems</Eyebrow>
          <h2>Make information useful.</h2>
          <p>Connect equipment data to clear decisions and useful action.</p>
          <ul className="detail-items">
            <li>Software engineering & cloud platforms</li>
            <li>Embedded development & connected systems</li>
            <li>Applications, data & automation</li>
          </ul>
        </div>
        <div className="about-pillar">
          <Eyebrow>Mechanical & physical systems</Eyebrow>
          <h2>Make technology work in reality.</h2>
          <p>Design, integrate and validate the parts that must work in the real world.</p>
          <ul className="detail-items">
            <li>Mechanical design, CAD & packaging</li>
            <li>Prototyping & electromechanical integration</li>
            <li>Testing & manufacturing support</li>
          </ul>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
