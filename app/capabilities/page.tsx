import { PageIntro, FinalCTA } from '@/components/ui';
import Reveal from '@/components/motion/Reveal';
import { capabilities } from '@/data/content';
import { pageMetadata } from '@/lib/site';
export const metadata = pageMetadata(
  'Our capabilities',
  'Mechanical and product engineering, embedded systems, software platforms and practical automation, considered as one system.',
  '/capabilities',
);
export default function CapabilitiesPage() {
  return (
    <>
      <PageIntro
        label="Our capabilities"
        title="The whole system. Considered together."
        description="Physical design, sensing, communication and software all influence each other. We bring those decisions into one engineering process."
      />
      <div className="container detail-list">
        {capabilities.map((item, i) => (
          <section className="capability-detail" id={`capability-${i + 1}`} key={item.title}>
            <span className="detail-number">0{i + 1}</span>
            <Reveal>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </Reveal>
            <ul className="detail-items">
              {item.items.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </section>
        ))}
        <p className="boundaries">
          The right expertise for the scope. Specialised electronics, RF design, certification, EMC
          and functional safety requirements are assessed at discovery and may involve specialist
          collaborators.
        </p>
      </div>
      <FinalCTA />
    </>
  );
}
