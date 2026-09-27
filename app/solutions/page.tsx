import { PageIntro, FinalCTA, Eyebrow } from '@/components/ui';
import { solutions } from '@/data/content';
import { pageMetadata } from '@/lib/site';
export const metadata = pageMetadata(
  'What we can build',
  'Potential systems for monitoring, connected products and practical automation.',
  '/solutions',
);
export default function SolutionsPage() {
  return (
    <>
      <PageIntro
        label="Example applications"
        title="Start with what needs to work better."
        description="Illustrative systems shaped around your equipment, environment and operating goals."
      />
      <div className="container solutions-list">
        {solutions.map((item, i) => (
          <section key={item.title} id={`solution-${i + 1}`} className="solution-detail">
            <Eyebrow>
              {item.category} / 0{i + 1}
            </Eyebrow>
            <h2>{item.title}</h2>
            <p className="solution-outcome">{item.description}</p>
            <p className="signal-label">{item.signals}</p>
          </section>
        ))}
      </div>
      <FinalCTA />
    </>
  );
}
