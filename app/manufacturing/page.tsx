import Image from 'next/image';
import { Button, Eyebrow } from '@/components/ui';
import ManufacturingServices from '@/components/ManufacturingServices';
import { pageMetadata } from '@/lib/site';
export const metadata = pageMetadata(
  'Manufacturing',
  '3D printing, laser cutting and manufacturing design. Bring Tenacom your idea, drawing or model and start a project enquiry.',
  '/manufacturing',
);
export default function ManufacturingPage() {
  return (
    <>
      <section className="manufacturing-hero container">
        <div>
          <Eyebrow>Manufacturing / Tenacom</Eyebrow>
          <h1>
            From idea.
            <br />
            To something real.
          </h1>
          <p className="lead">
            Design, 3D printing and laser cutting. A considered path from your first sketch to a
            manufacturable solution.
          </p>
          <Button href="#services">Explore manufacturing</Button>
        </div>
        <figure className="manufacturing-hero-image">
          <Image
            src="/images/engineer-cad.jpg"
            alt="Engineer reviewing a mechanical design in CAD"
            fill
            loading="eager"
            sizes="(max-width: 800px) 100vw, 45vw"
          />
          <figcaption>Design intent. Physical possibilities.</figcaption>
        </figure>
      </section>
      <section className="section container" id="services">
        <div className="section-heading">
          <div>
            <Eyebrow>Our manufacturing services</Eyebrow>
            <h2>Start where you are.</h2>
          </div>
          <p className="manufacturing-intro">
            An idea, a ready-to-make file or something in between. Choose the support your project
            needs.
          </p>
        </div>
        <ManufacturingServices />
        <p className="form-caption">
          Illustrative engineering photography; application examples are not a portfolio of
          completed Tenacom work.
        </p>
      </section>
      <section className="manufacturing-callout">
        <div className="container">
          <Eyebrow>No design file? No problem.</Eyebrow>
          <h2>A rough sketch can be a good beginning.</h2>
          <p>
            Send a photograph, measurements or a description through any service enquiry. We can
            help turn it into a manufacturable design.
          </p>
          <Button href="/manufacturing/sheet-metal-design#enquiry">Discuss your design</Button>
        </div>
      </section>
    </>
  );
}
