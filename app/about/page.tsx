import { PageIntro, FinalCTA, Eyebrow } from '@/components/ui';
import { pageMetadata } from '@/lib/site';
export const metadata = pageMetadata(
  'About Tenacom',
  'A South African engineering and technology company bringing mechanical engineering and intelligent software together.',
  '/about',
);
export default function AboutPage() {
  return (
    <>
      <PageIntro
        label="About Tenacom"
        title="Engineering across disciplines."
        description="Tenacom is a South African intelligent systems and product engineering company. We connect physical equipment, products and operations to software that makes them more useful."
      />
      <section className="container about-statement">
        <h2>
          Physical systems.
          <br />
          Digital intelligence.
          <br />
          Shared purpose.
        </h2>
        <div>
          <p>
            Modern products and operations need mechanical systems, embedded devices, software and
            data to work together. We consider them as parts of one system, from the original
            problem through design, prototyping and integration.
          </p>
          <p style={{ marginTop: 22 }}>
            We are building a focused engineering company around complementary software and
            mechanical capabilities. The aim is practical: make the physical world measurable,
            connected and controllable.
          </p>
        </div>
      </section>
      <section className="container about-pillars">
        <div className="about-pillar">
          <Eyebrow>Software & intelligent systems</Eyebrow>
          <h2>Make information useful.</h2>
          <p>
            From embedded behaviour to the software teams use every day, we connect signals to
            decisions and actions.
          </p>
          <ul className="detail-items">
            <li>Software engineering & cloud platforms</li>
            <li>Embedded development & connected systems</li>
            <li>Applications, data & automation</li>
          </ul>
        </div>
        <div className="about-pillar">
          <Eyebrow>Mechanical & physical systems</Eyebrow>
          <h2>Make technology work in reality.</h2>
          <p>
            Physical design and validation support the complete system, including how it is built,
            fitted, protected and tested.
          </p>
          <ul className="detail-items">
            <li>Mechanical design, CAD & packaging</li>
            <li>Prototyping & electromechanical integration</li>
            <li>Testing & manufacturing support</li>
          </ul>
        </div>
      </section>
      <section className="dark-section section">
        <div className="container">
          <Eyebrow>Direct access to the engineers</Eyebrow>
          <h2>
            You bring the problem.
            <br />
            We work through the system.
          </h2>
          <p className="lead" style={{ maxWidth: 710, marginTop: 28 }}>
            You don’t need to choose the sensor, enclosure, controller or software platform before
            speaking to us. Understanding those requirements is part of the work.
          </p>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
