import { PageIntro, FinalCTA } from '@/components/ui';
import { capabilities } from '@/data/content';
import { pageMetadata } from '@/lib/site';
export const metadata = pageMetadata(
  'Our capabilities',
  'Mechanical engineering, connected systems, software and automation, engineered together.',
  '/capabilities',
);
export default function CapabilitiesPage() {
  return (
    <>
      <PageIntro
        label="Our capabilities"
        title="The whole system. Considered together."
        description="Physical design, sensing, control and software belong in the same engineering conversation."
      />
      <div className="container detail-list">
        {capabilities.map((item, i) => (
          <section className="capability-detail" id={`capability-${i + 1}`} key={item.title}>
            <span className="detail-number">0{i + 1}</span>
            <div>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </div>
            <ul className="detail-items">
              {item.items.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </section>
        ))}
        <p className="boundaries">
          Specialist electronics, RF, certification, EMC and functional safety expertise is engaged
          when the scope requires it.
        </p>
      </div>
      <FinalCTA />
    </>
  );
}
