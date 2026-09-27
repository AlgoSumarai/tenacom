import { PageIntro, FinalCTA } from '@/components/ui';
import { industries } from '@/data/content';
import { pageMetadata } from '@/lib/site';
export const metadata = pageMetadata(
  'Where we can create value',
  'Connected engineering for physical assets, infrastructure and product development.',
  '/industries',
);
export default function IndustriesPage() {
  return (
    <>
      <PageIntro
        label="Where we can create value"
        title="Different environments. Connected challenges."
        description="A whole-system approach for operations that need clearer information and better control."
      />
      <div className="container industry-grid">
        {industries.map(([title, description], i) => (
          <section className="industry-item" key={title}>
            <span className="detail-number">0{i + 1}</span>
            <div>
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
          </section>
        ))}
      </div>
      <FinalCTA />
    </>
  );
}
