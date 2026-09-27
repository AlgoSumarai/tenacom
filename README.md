# Tenacom website

Tenacom is a South African intelligent systems and product engineering company. This website explains how mechanical engineering, embedded and connected systems, software and automation can work together to improve physical operations.

The site includes a homepage, capabilities, example solutions, potential industries, about, project enquiry, privacy and branded 404 pages. Application examples are explicitly conceptual; no clients, deployments, performance figures or credentials have been invented.

## Stack

- Next.js 16 App Router, React 19 and strict TypeScript. Pages remain server components; client components own only navigation and form behaviour.
- Plain CSS with central brand tokens and responsive editorial layouts. The interface uses restrained state transitions without an animation library.
- Manrope and IBM Plex Mono via `next/font`; font files are served locally after the build.
- Licensed, documentary-style engineering photography and Lucide interface icons. Image sources and representation notes are documented in `public/images/README.md`. The supplied logo is preserved in `public/brand/tenacom.png` and delivered through `next/image`.
- A server-only Resend HTTP adapter for enquiry delivery. No database or public credentials are needed.
- ESLint, Prettier, Node tests through tsx, and Playwright browser regression tests.

## Getting started

Use Node.js 22.13+ or 24 LTS and npm. The lockfile was generated with npm 12. Internet access is needed for dependency installation and the initial font download.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

In PowerShell, use `Copy-Item .env.example .env.local` instead of `cp`. Open http://localhost:3000.

```sh
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
npm start
```

Browser tests use an installed Google Chrome via Playwright. For a CI machine without Chrome, install the browser with `npx playwright install chrome`, or change the Playwright channel to your managed Chromium installation. Browser tests start the development server automatically if one is not already running. They never send real email: delivery responses are stubbed, and server-side adapter tests mock the outbound fetch.

`npm run format` formats source files; `npm run format:check` checks formatting. Keep source files UTF-8 **without a BOM**: a BOM at the start of CSS can become an unintended selector when stylesheets are concatenated.

If your network uses a system-trusted TLS proxy and Node cannot verify the npm certificate, use Node’s system certificate store (for example `$env:NODE_OPTIONS='--use-system-ca'` on Node 24). Do not disable certificate verification.

## Environment and email delivery

| Variable               | Purpose                                                                                                                                                                    |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SITE_URL`             | Verified canonical origin, including `https://` in production. Used in canonical links, sitemap, social metadata and origin checks. Defaults to localhost for development. |
| `RESEND_API_KEY`       | Server-only Resend sending credential.                                                                                                                                     |
| `CONTACT_FROM_EMAIL`   | Sender on a domain verified with the email provider.                                                                                                                       |
| `CONTACT_TO_EMAIL`     | Tenacom’s real project enquiry inbox.                                                                                                                                      |
| `CONTACT_PUBLIC_EMAIL` | Optional public address displayed on the contact page.                                                                                                                     |
| `TRUST_PROXY`          | Set to `true` only if your hosting proxy overwrites `x-forwarded-for`.                                                                                                     |

Configure the three delivery variables together. Without them, valid submissions return HTTP 503 and clearly say that the message was **not sent**. No fake success is shown and entered data is retained. Contact and metadata values are included during static generation, so rebuild after changing public-facing environment values.

`lib/mail.ts` is the email-provider boundary. It sends a plain-text message to the configured inbox, uses the visitor’s validated email only for `reply_to`, checks the provider receipt, and applies a timeout. Replace this module if another provider is preferred. See the [Resend send-email API](https://resend.com/docs/api-reference/emails/send-email).

The form offers a full project brief and a quick enquiry. Both require name, email, a meaningful problem description and permission to respond. Optional context includes company, phone, equipment, desired outcome, industry, environment, existing systems, scale, stage, timeline, budget and additional information.

The API enforces shared validation, allowed select values, field lengths, a 24 KB streamed body limit, same-origin browser requests, a honeypot and a bounded instance-local rate guard. Untrusted proxy headers are ignored by default, using a shared limit instead. For production, configure a trustworthy proxy and an edge/WAF or shared-store limit; the in-memory guard is not a distributed spam prevention service. The application does not store enquiry bodies or log personal enquiry content.

## Project structure

```text
app/
  page.tsx                  Homepage composition
  layout.tsx                Shared shell, fonts and base metadata
  globals.css               Tokens, visual system and responsive rules
  about/                    Company positioning and complementary disciplines
  capabilities/             Four engineering capability pillars
  solutions/                Explicitly labelled application examples
  industries/               Potential areas of value
  contact/                  Project discovery page
  privacy/                  Enquiry handling notice
  api/contact/route.ts      Validated enquiry endpoint
  not-found.tsx             Branded 404
  sitemap.ts, robots.ts     Discovery metadata
  opengraph-image.tsx       Social sharing image
components/
  layout/                   Header, mobile navigation and footer
  sections/                 Photo-led editorial and feature sections
  ContactForm.tsx            Form interaction, feedback and focus
  ui.tsx                    Buttons, headings and closing CTA
data/content.ts             Capabilities, solutions, industries and process content
lib/
  enquiry.ts                Shared form definitions and validation
  mail.ts                   Server email delivery adapter
  rate-limit.ts             Bounded local request guard
  site.ts                   Canonical origin and page metadata helper
public/brand/               Original user-supplied logo
tests/                      Validation, API and browser regression coverage
```

## Design and interaction notes

The homepage uses a dark editorial system organised around `.home-hero`, `.people-section`, `.capability-list` and `.process-section`. A single static hero photograph establishes the physical engineering context, while supporting photographs show people working with CAD, electronics, prototypes and industrial equipment. There are no autoplay carousels, looping media or animated technical scenes.

The palette begins with ink and deep navy, then uses warm off-white, steel grey and the logo blues as controlled accents. Large type, thin rules, asymmetric image crops and generous spacing provide hierarchy. Capability content is presented as a disciplined editorial list rather than a repeated card grid, and the process remains a static numbered sequence that is easy to scan.

Photography is illustrative stock imagery licensed from Pexels. The people shown are not represented as Tenacom staff, and the scenes do not imply Tenacom client work, facilities or endorsements. Keep this distinction clear when replacing or adding images, and update `public/images/README.md` with the source and photographer.

Brand colours, width, spacing and type tokens live at the top of `app/globals.css`. Breakpoints at 1100, 800 and 480 pixels reorganise the layouts without changing the reading order. Reduced-motion users receive the same visible content with CSS animation disabled on the principal photographs and sections. The logo uses the original square raster with a presentation window around its unused whitespace; its artwork and proportions are unchanged.

## Maintenance

Change shared capability, solution, industry and process copy in `data/content.ts`. Keep one-off page copy beside the page that owns it. Add enquiry fields to `lib/enquiry.ts`; the same definitions drive the UI, validation and outgoing plain-text email.

To add a page, create `app/<route>/page.tsx`, export `pageMetadata(...)`, add navigation only where useful and include the route in `app/sitemap.ts`. Keep the page a server component and isolate interactive state in a focused child component.

No real contact address, domain or delivery credentials were supplied. Before public launch, set the verified production origin and inbox, verify the sending domain, run a real delivery test, and confirm the published enquiry handling notice matches the chosen hosting/mail arrangements. The site can be deployed to a Next.js-compatible host or run with `npm run build` followed by `npm start`; it is not a static export because enquiry delivery needs a server.

## Verification

The unit/API suite covers required fields, input types, enum tampering, length bounds, consent, rate expiry, origin/content-type rejection, malformed and oversized payloads, honeypot rejection, unconfigured delivery, provider success and provider/network failure.

The browser suite covers all public routes, metadata, assets, horizontal overflow, homepage section structure, photography loading, copy and page-height limits, responsive screenshots, navigation, mobile menu escape/focus, form errors, retained data on failure, success/loading feedback, reduced motion and the 404/discovery endpoints. Review the actual rendering after changing layouts; passing a build alone is not a visual quality check.
