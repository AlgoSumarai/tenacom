import ContactForm from '@/components/ContactForm';
import { PageIntro } from '@/components/ui';
import { pageMetadata } from '@/lib/site';
export const metadata = pageMetadata(
  'Discuss your project',
  'Tell Tenacom what you need to measure, connect, control or automate. Start a practical engineering conversation.',
  '/contact',
);
export default function ContactPage() {
  const email = process.env.CONTACT_PUBLIC_EMAIL;
  return (
    <>
      <PageIntro
        label="Let’s build something useful"
        title="Tell us what you’re trying to solve."
        description="An operational challenge. An idea for a product. A system that could work better. Start wherever you are — you don’t need a finished specification."
      />
      <div className="container contact-layout">
        <aside className="contact-aside">
          <h2>
            A conversation,
            <br />
            before a specification.
          </h2>
          <p>
            Share the problem and the outcome you have in mind. We can work through the engineering
            questions together.
          </p>
          <ol>
            <li>Tell us about your challenge.</li>
            <li>We review the fit and requirements.</li>
            <li>We discuss a practical next step.</li>
          </ol>
          <p>Short on time? Choose “Quick enquiry” for a simpler starting point.</p>
          {email && (
            <a className="text-link" href={`mailto:${email}`}>
              {email} ↗
            </a>
          )}
          <p>Based in South Africa.</p>
        </aside>
        <ContactForm />
      </div>
    </>
  );
}
