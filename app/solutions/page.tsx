import { PageIntro, FinalCTA, Eyebrow } from '@/components/ui';
import { solutions } from '@/data/content';
import { pageMetadata } from '@/lib/site';
export const metadata = pageMetadata(
  'What we can build',
  'Explore potential systems for remote monitoring, connected products, environmental sensing and operational automation.',
  '/solutions',
);
export default function SolutionsPage() {
  return (
    <>
      <PageIntro
        label="Example applications"
        title="Start with what needs to work better."
        description="These are systems we can develop, not a list of past deployments. Each application is shaped around your equipment, environment and operational goals."
      />
      <div className="container solutions-list">
        {solutions.map((item, i) => (
          <section key={item.title} id={`solution-${i + 1}`} className="solution-detail">
            <Eyebrow>
              {item.category} / 0{i + 1}
            </Eyebrow>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <p className="signal-label">{item.signals}</p>
            <p className="solution-outcome">{item.outcome}</p>
          </section>
        ))}
      </div>
      <FinalCTA />
    </>
  );
}
