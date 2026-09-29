import { PageIntro } from '@/components/ui';
import { pageMetadata } from '@/lib/site';
export const metadata = pageMetadata(
  'Privacy',
  'How this website handles project enquiry information.',
  '/privacy',
);
export default function Privacy() {
  return (
    <>
      <PageIntro
        label="Website privacy"
        title="Your enquiry information."
        description="Share only the information needed to begin a project conversation. Please leave out passwords, confidential designs and sensitive personal information."
      />
      <article className="container legal">
        <h2>What the enquiry form collects</h2>
        <p>
          The form asks for contact details and context about your project. Required information is
          marked. Optional fields help us understand the equipment, environment and outcome you have
          in mind.
        </p>
        <h2>How the information is used</h2>
        <p>
          For general contact enquiries, when delivery is configured, information is sent to
          Tenacom’s designated enquiry inbox through its email delivery provider. It is used to
          assess and respond to your enquiry. This website does not subscribe you to marketing
          messages.
        </p>
        <h2>Storage and service providers</h2>
        <p>
          Manufacturing enquiries, including optional uploaded designs and reference files, are
          stored privately with their service, project details and enquiry reference so Tenacom can
          assess the work and prepare a quotation. Files are not published on the website. General
          contact enquiries are delivered by email. Delivered enquiries are held in the designated
          mailbox and processed by the configured email service. The hosting service may also retain
          operational request logs. Anti-spam controls use a short-lived, in-memory request
          identifier.
        </p>
        <h2>Cookies and analytics</h2>
        <p>
          This implementation does not set advertising cookies or include third-party analytics.
          Essential hosting services may process technical information needed to serve the website.
        </p>
        <h2>Questions and corrections</h2>
        <p>
          You can request a correction or deletion of enquiry information by replying to the project
          correspondence. If direct email is available on the contact page, you may also use that
          address.
        </p>
      </article>
    </>
  );
}
