import ContactForm from '@/components/ContactForm';
import { PageIntro } from '@/components/ui';
import { pageMetadata } from '@/lib/site';
export const metadata = pageMetadata(
  'Contact Our Engineering Team',
  'Discuss your product engineering, connected systems or manufacturing project with Tenacom in South Africa. Share your idea, requirements or operational challenge.',
  '/contact',
);
export default function ContactPage() {
  const email = process.env.CONTACT_PUBLIC_EMAIL;
  return (
    <>
      <PageIntro
        label="Discuss your project"
        title="Tell us what needs to work better."
        description="Share the challenge and the outcome you need. A finished specification is not required."
      />
      <div className="container contact-layout">
        <aside className="contact-aside">
          <h2>Talk directly with an engineer.</h2>
          <p>We will review the fit, clarify the requirements and suggest a practical next step.</p>
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
