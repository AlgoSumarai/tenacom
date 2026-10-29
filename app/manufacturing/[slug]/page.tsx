import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { manufacturingServices, findManufacturingService } from '@/data/manufacturing';
import ManufacturingServices from '@/components/ManufacturingServices';
import ManufacturingEnquiryForm from '@/components/ManufacturingEnquiryForm';
import { Button, Eyebrow } from '@/components/ui';
import { pageMetadata } from '@/lib/site';
import StructuredData from '@/components/StructuredData';
import { serviceStructuredData } from '@/lib/structured-data';
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return manufacturingServices.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props) {
  const service = findManufacturingService((await params).slug);
  if (!service) notFound();
  return pageMetadata(service.seoTitle, service.seoDescription, `/manufacturing/${service.slug}`);
}
export default async function ServicePage({ params }: Props) {
  const service = findManufacturingService((await params).slug);
  if (!service) notFound();
  const workflow = [
    [
      'Tell us what you need',
      'Share your idea, use case and any quantity or timing you have in mind.',
    ],
    [
      'Send what you have',
      'Drawings, models, photographs, measurements or a rough sketch all help. Finished files are optional.',
    ],
    [
      'Review the requirements',
      'We discuss specifications, materials, feasibility, deliverables and pricing with you.',
    ],
    [
      service.designOnly ? 'Develop and review the design' : 'Approve the design and production',
      service.designOnly
        ? 'We develop the agreed design and review it with you against the intended manufacturing process.'
        : 'Design is completed if needed. Manufacturing begins only after the scope and specifications are approved.',
    ],
    [
      service.designOnly ? 'Receive your design files' : 'Receive your completed work',
      service.designOnly
        ? 'Receive the agreed drawings or digital files for your next manufacturing step.'
        : 'Delivery or collection is arranged as part of the agreed project.',
    ],
  ];
  return (
    <>
      <StructuredData data={serviceStructuredData(service)} />
      <section className="manufacturing-hero service-hero container">
        <div>
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true"> / </span>
            <Link href="/manufacturing">Manufacturing</Link>
            <span aria-hidden="true"> / </span>
            <span>{service.name}</span>
          </nav>
          <h1>{service.name}</h1>
          <p className="service-headline">{service.headline}</p>
          <p className="lead">{service.description}</p>
          <Button href="#enquiry">Enquire about this service</Button>
        </div>
        <figure className="manufacturing-hero-image">
          <Image
            src={service.image}
            alt={service.alt}
            fill
            loading="eager"
            sizes="(max-width: 800px) 100vw, 45vw"
          />
          <figcaption>Illustrative engineering photography</figcaption>
        </figure>
      </section>
      <section className="section container">
        <Eyebrow>What we offer</Eyebrow>
        <h2>
          {service.designOnly
            ? 'Design for your next step.'
            : 'The right support. At the right stage.'}
        </h2>
        <div className="manufacturing-options">
          {service.options.map((option, index) => (
            <article key={option.name}>
              <span className="detail-number">0{index + 1}</span>
              <h3>{option.name}</h3>
              <p>{option.description}</p>
            </article>
          ))}
        </div>
        <p className="manufacturing-note">{service.note}</p>
      </section>
      <section className="manufacturing-applications">
        <div className="container">
          <Eyebrow>Applications / subject to project review</Eyebrow>
          <h2>{service.designOnly ? 'What can we design?' : 'What can we make?'}</h2>
          <ul>
            {service.applications.map((application) => (
              <li key={application}>{application}</li>
            ))}
          </ul>
          <p>
            Tell us how the part will be used. We will review the practical requirements before
            confirming the scope.
          </p>
        </div>
      </section>
      <section className="section container manufacturing-workflow">
        <div>
          <Eyebrow>How it works</Eyebrow>
          <h2>A clear path forward.</h2>
          <p>
            No finished engineering files required. We start with what you know and work through the
            details together.
          </p>
        </div>
        <ol className="process-list">
          {workflow.map(([title, description], i) => (
            <li key={title}>
              <span>0{i + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className="section container contact-layout manufacturing-contact" id="enquiry">
        <div className="contact-aside">
          <Eyebrow>Start your project</Eyebrow>
          <h2>Tell us what you have in mind.</h2>
          <p>
            This enquiry is for <strong>{service.name}</strong>. Share as much as you know; we can
            work through the rest with you.
          </p>
          <p>Files are optional. A photograph, sketch or description is a useful starting point.</p>
        </div>
        <ManufacturingEnquiryForm key={service.slug} service={service} />
      </section>
      <section className="section container">
        <div className="section-heading">
          <div>
            <Eyebrow>Explore further</Eyebrow>
            <h2>Other manufacturing services.</h2>
          </div>
        </div>
        <ManufacturingServices exclude={service.slug} />
      </section>
    </>
  );
}
