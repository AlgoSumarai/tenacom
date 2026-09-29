import Image from 'next/image';
import { Button, Eyebrow } from './ui';
import { manufacturingServices } from '@/data/manufacturing';

export default function ManufacturingServices({ exclude }: { exclude?: string }) {
  return (
    <div className="manufacturing-services">
      {manufacturingServices
        .filter((service) => service.slug !== exclude)
        .map((service, index) => (
          <article className="manufacturing-card" key={service.slug}>
            <div className="manufacturing-card-image">
              <Image
                src={service.image}
                alt={service.alt}
                fill
                sizes="(max-width: 800px) 100vw, 45vw"
              />
            </div>
            <div className="manufacturing-card-copy">
              <Eyebrow>
                0{index + 1} /{' '}
                {service.designOnly ? 'Design for production' : 'Design + production'}
              </Eyebrow>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <ul className="manufacturing-tags">
                {(service.designOnly
                  ? ['CAD & drawings', 'Manufacturing geometry', 'Artwork & profiles']
                  : service.options.map((option) => option.name)
                ).map((option) => (
                  <li key={option}>{option}</li>
                ))}
              </ul>
              <Button href={`/manufacturing/${service.slug}`}>Explore service</Button>
            </div>
          </article>
        ))}
    </div>
  );
}
