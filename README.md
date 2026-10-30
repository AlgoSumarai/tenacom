# Tenacom website

Tenacom is a South African intelligent systems and product engineering company. This website explains how mechanical engineering, embedded and connected systems, software and automation can work together to improve physical operations.

The site includes a homepage, manufacturing hub and service enquiries, capabilities, example solutions, potential industries, about, project enquiry, privacy and branded 404 pages. Application examples are explicitly conceptual; no clients, deployments, performance figures or credentials have been invented.

## Stack

- Next.js 16 App Router, React 19 and strict TypeScript. Pages remain server components; client components own only navigation and form behaviour.
- Plain CSS with central brand tokens and responsive editorial layouts. The interface uses restrained state transitions without an animation library.
- Manrope and IBM Plex Mono via `next/font`; font files are served locally after the build.
- Licensed, documentary-style engineering photography and Lucide interface icons. Image sources and representation notes are documented in `public/images/README.md`. The supplied logo is preserved in `public/brand/tenacom.png` and delivered through `next/image`.
- Dedicated browser/search icons use the existing Tenacom mark: `app/favicon.ico` (16–256 px), `app/icon.png` (96 px) and `app/apple-icon.png` (180 px). Next.js links these files directly without the image optimiser. The mark is cropped from `public/brand/tenacomtrans.png` at `(272, 241, 1038, 860)`, centred with proportional padding; the original logo assets are preserved.
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

| Variable                   | Purpose                                                                                                                                                                                                                                |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SITE_URL`                 | Canonical origin. Defaults to `https://www.tenacom.co.za`; the bare Tenacom domain normalises to `www` to match hosting. Production builds reject localhost and non-HTTPS origins. Use `http://localhost:3000` for local form testing. |
| `GOOGLE_SITE_VERIFICATION` | Optional Google Search Console HTML verification token (the `content` value only). Rebuild after setting.                                                                                                                              |
| `BING_SITE_VERIFICATION`   | Optional Bing Webmaster Tools HTML verification token (the `msvalidate.01` content value only). Rebuild after setting.                                                                                                                 |
| `RESEND_API_KEY`           | Server-only Resend sending credential.                                                                                                                                                                                                 |
| `CONTACT_FROM_EMAIL`       | Sender on a domain verified with the email provider.                                                                                                                                                                                   |
| `CONTACT_TO_EMAIL`         | Tenacom’s real project enquiry inbox.                                                                                                                                                                                                  |
| `CONTACT_PUBLIC_EMAIL`     | Optional public address displayed on the contact page.                                                                                                                                                                                 |
| `TRUST_PROXY`              | Set to `true` only if your hosting proxy overwrites `x-forwarded-for`.                                                                                                                                                                 |

Configure the three delivery variables together. Without them, valid submissions return HTTP 503 and clearly say that the message was **not sent**. No fake success is shown and entered data is retained. Contact and metadata values are included during static generation, so rebuild after changing public-facing environment values.

## Search engine optimisation

The public canonical origin is **https://www.tenacom.co.za**, matching the live permanent redirect from `tenacom.co.za`. Page canonical links, the XML sitemap, robots discovery, Open Graph/Twitter URLs and JSON-LD all share this origin. It is the default even without environment configuration, so a missing `SITE_URL` cannot publish localhost links. Keep the existing hosting redirect from the bare domain to `www` and HTTPS enabled.

Each page has a distinct search title and description. Manufacturing services have dedicated `seoTitle` and `seoDescription` fields in `data/manufacturing.ts`. The homepage includes `Organization` and `WebSite` JSON-LD, and each manufacturing service includes `Service` and `BreadcrumbList` JSON-LD consistent with its visible content. No reviews, prices, street addresses or credentials are invented. Vercel preview builds (`VERCEL_ENV=preview`) emit `noindex, nofollow` and disallow crawling; production remains indexable.

The favicon is a crawlable, square brand mark at `/favicon.ico` with a dedicated 96 px PNG alternative at `/icon.png`. After deploying an icon change, request a homepage recrawl in Search Console. Google must recrawl and process the icon before it can update Search results; appearance is not immediate or guaranteed. See [Google’s favicon guidance](https://developers.google.com/search/docs/appearance/favicon-in-search).

After deploying these changes:

1. Set production `SITE_URL=https://www.tenacom.co.za` or leave it unset to use the same default. Remove any old localhost value before rebuilding.
2. Add `tenacom.co.za` in [Google Search Console](https://search.google.com/search-console). A Domain property covers both domain variants and protocols and requires the DNS TXT record Google supplies at your DNS provider. Alternatively, add the `https://www.tenacom.co.za/` URL-prefix property and set its HTML verification content value as `GOOGLE_SITE_VERIFICATION`, rebuild and then verify. These tokens and DNS records must come from the account that owns the property.
3. Add the site in [Bing Webmaster Tools](https://www.bing.com/webmasters/). Import a verified Search Console property or set the supplied HTML token as `BING_SITE_VERIFICATION`, rebuild and verify.
4. Submit `https://www.tenacom.co.za/sitemap.xml` in both tools. In Search Console, inspect the homepage and the three manufacturing service URLs, test their live versions and request indexing. Check that Google sees the public `www` canonical and can fetch the pages.
5. Validate the deployed homepage and service pages using [Google’s Rich Results Test](https://search.google.com/test/rich-results) and the [Schema Markup Validator](https://validator.schema.org/). Monitor indexing, search queries and Core Web Vitals in Search Console after deployment.

Verification and sitemap submission require access to the relevant webmaster account or DNS provider; adding metadata does not verify ownership or submit anything automatically. Google controls crawling, indexing and search appearance. See the [Google SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) and [canonical URL guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

`lib/mail.ts` is the email-provider boundary. It sends a plain-text message to the configured inbox, uses the visitor’s validated email only for `reply_to`, checks the provider receipt, and applies a timeout. Replace this module if another provider is preferred. See the [Resend send-email API](https://resend.com/docs/api-reference/emails/send-email).

The form offers a full project brief and a quick enquiry. Both require name, email, a meaningful problem description and permission to respond. Optional context includes company, phone, equipment, desired outcome, industry, environment, existing systems, scale, stage, timeline, budget and additional information.

The general contact API enforces shared validation, allowed select values, field lengths, a 24 KB streamed body limit, same-origin browser requests, a honeypot and a bounded instance-local rate guard. Untrusted proxy headers are ignored by default, using a shared limit instead. For production, configure a trustworthy proxy and an edge/WAF or shared-store limit; the in-memory guard is not a distributed spam prevention service. The general contact endpoint does not store enquiry bodies or log personal enquiry content. Manufacturing uses the private persistence adapter described below.

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
  manufacturing/            Manufacturing hub
    [slug]/page.tsx          Statically generated service pages
  privacy/                  Enquiry handling notice
  api/contact/route.ts      Validated enquiry endpoint
  api/manufacturing-enquiries/route.ts  Multipart project and upload endpoint
  not-found.tsx             Branded 404
  sitemap.ts, robots.ts     Discovery metadata
  opengraph-image.tsx       Social sharing image
components/
  layout/                   Header, mobile navigation and footer
  sections/                 Photo-led editorial and feature sections
  ContactForm.tsx            Form interaction, feedback and focus
  ManufacturingEnquiryForm.tsx Service-aware form and optional uploads
  ManufacturingServices.tsx  Shared photo-led service list
  ui.tsx                    Buttons, headings and closing CTA
data/content.ts             Capabilities, solutions, industries and process content
data/manufacturing.ts       Manufacturing service catalogue, options and applications
lib/
  enquiry.ts                Shared form definitions and validation
  mail.ts                   Server email delivery adapter
  rate-limit.ts             Bounded local request guard
  manufacturing-enquiry.ts  Shared field definitions and file/input validation
  manufacturing-storage.ts Private atomic enquiry and file persistence adapter
  site.ts                   Canonical origin and page metadata helper
  structured-data.ts        Company, website, service and breadcrumb JSON-LD
public/brand/               Original user-supplied logo
tests/                      Validation, API and browser regression coverage
```

## Manufacturing and project enquiries

The manufacturing hierarchy is `/manufacturing`, `/manufacturing/3d-printing`, `/manufacturing/laser-cutting` and `/manufacturing/sheet-metal-design`. There is no new `/services` route. Manufacturing is linked in desktop/mobile navigation and the footer. The sitemap and individual canonical metadata include all service pages. Unknown service slugs return 404.

`data/manufacturing.ts` owns the reusable service catalogue: slug, name, introduction, image/alt text, service options, applications and capability boundaries. `app/manufacturing/[slug]/page.tsx` generates each page with offerings, applications, process, enquiry and related services. To add a service, add a catalogue entry with a unique slug and appropriate options; routes, related links and sitemap entries follow automatically. Adapt `manufacturingFields()` only if the service needs extra fields. Set `designOnly` for design services so the workflow and copy do not imply physical production. Existing illustrative photographs are reused under the licences in `public/images/README.md`.

`ManufacturingEnquiryForm` sets the service from its page; customers select only the service option or design project type. Name, email, option, a meaningful description and permission to respond are required. Quantity, dimensions, material, thickness, completion date and files are optional so an enquiry can start with an idea. Shared client/server validation checks field lengths, email, dates and allowed options. Inline errors focus the first invalid control. Loading and success lock the form, failures retain input and files, and a successful enquiry can be followed by a new one.

`POST /api/manufacturing-enquiries` accepts multipart form data. Accepted extensions: STL, STEP, STP, DXF, DWG, SVG, PDF, PNG, JPG and JPEG (case-insensitive). Limits are four files, 5 MB each, 12 MB combined, plus 64 KB for multipart overhead and text. The server bounds the incoming stream before parsing. Zero-byte files, unsupported extensions and over-limit uploads are rejected. File extensions are an intake filter, not malware detection: uploads are private and are never rendered, executed or served by the website. Treat files as untrusted when reviewing them and use appropriate scanning in the internal workflow.

### Configure private storage before accepting manufacturing enquiries

Set `MANUFACTURING_ENQUIRY_DIR` to an **absolute path on a persistent private volume outside `public/`**, for example `C:/TenacomData/manufacturing-enquiries` or `/var/lib/tenacom/manufacturing-enquiries`. Give only the application and authorised staff access (configure Windows ACLs or host permissions), and back up the volume. The app intentionally returns 503 without this configuration; it never claims a missing enquiry was received. Temporary serverless filesystems are unsuitable. On those hosts, replace `lib/manufacturing-storage.ts` with a private object-store/database adapter. Ensure the reverse proxy accepts at least 13 MB request bodies, and apply edge rate limits alongside the existing bounded, instance-local guard.

Each accepted enquiry has a UUID directory containing `enquiry.json` and numbered original-format attachments. The JSON records version, timestamp, canonical service name/slug, selected option, validated project/contact details, consent and file references with original filenames and sizes. Numbered filenames prevent submitted names from becoming paths. A staging directory is atomically renamed after all files and metadata are written; interrupted work cannot appear as a completed enquiry. A stable browser-generated UUID and content digest make identical retries return the existing reference; changed content under an already-recorded UUID returns 409. A process killed during writing may leave a `.pending-*` directory; operators can remove stale staging directories after confirming no request is using them.

Manufacturing enquiries are **recorded privately, not emailed automatically**. Staff must monitor the configured directory and review `enquiry.json` and its referenced files; connect this adapter to an internal dashboard, CRM, quotation system or email notification as needed. The existing `/api/contact` email flow is unchanged. A success response means the complete manufacturing record and attachments were saved, not that pricing, materials or production were approved. Configure retention and deletion for both record directories and backups to match the published privacy notice and operating policy. No public file-download endpoint is provided.

The API also checks browser origin, honeypot and request rate, returning 422 for field/file errors, 413 for oversized bodies, 429 for throttling and 502 for storage failure. It does not log enquiry contents. Test coverage includes all three service configurations, optional technical details, tampered options, upload limits, private persistence, simultaneous retries and failures; browser tests cover mobile/desktop navigation, canonical routes, file removal and retained input.

## Design and interaction notes

The homepage uses a dark editorial system organised around `.home-hero`, `.people-section`, `.capability-list` and `.process-section`. A single static hero photograph establishes the physical engineering context, while supporting photographs show people working with CAD, electronics, prototypes and industrial equipment. There are no autoplay carousels, looping media or animated technical scenes.

The palette begins with ink and deep navy, then uses warm off-white, steel grey and the logo blues as controlled accents. Large type, thin rules, asymmetric image crops and generous spacing provide hierarchy. Capability content is presented as a disciplined editorial list rather than a repeated card grid, and the process remains a static numbered sequence that is easy to scan.

Photography is illustrative stock imagery licensed from Pexels. The people shown are not represented as Tenacom staff, and the scenes do not imply Tenacom client work, facilities or endorsements. Keep this distinction clear when replacing or adding images, and update `public/images/README.md` with the source and photographer.

Brand colours, width, spacing and type tokens live at the top of `app/globals.css`. Breakpoints at 1100, 800 and 480 pixels reorganise the layouts without changing the reading order. Reduced-motion users receive the same visible content with CSS animation disabled on the principal photographs and sections. The logo uses the original square raster with a presentation window around its unused whitespace; its artwork and proportions are unchanged.

## Maintenance

Change shared capability, solution, industry and process copy in `data/content.ts`. Keep one-off page copy beside the page that owns it. Add enquiry fields to `lib/enquiry.ts`; the same definitions drive the UI, validation and outgoing plain-text email.

To add a page, create `app/<route>/page.tsx`, export `pageMetadata(...)`, add navigation only where useful and include the route in `app/sitemap.ts`. Keep the page a server component and isolate interactive state in a focused child component.

The production domain is configured as `https://www.tenacom.co.za`. Before accepting enquiries, set the real inbox and delivery credentials, verify the sending domain, run a real delivery test, and confirm the published enquiry handling notice matches the chosen hosting/mail arrangements. The site can be deployed to a Next.js-compatible host or run with `npm run build` followed by `npm start`; it is not a static export because enquiry delivery needs a server.

## Verification

The unit/API suite covers required fields, input types, enum tampering, length bounds, consent, rate expiry, origin/content-type rejection, malformed and oversized payloads, honeypot rejection, unconfigured delivery, provider success and provider/network failure.

The browser suite covers all public routes, metadata, assets, horizontal overflow, homepage section structure, photography loading, copy and page-height limits, responsive screenshots, navigation, mobile menu escape/focus, form errors, retained data on failure, success/loading feedback, reduced motion and the 404/discovery endpoints. Review the actual rendering after changing layouts; passing a build alone is not a visual quality check.

SEO regression coverage verifies the production default, rejects unsafe canonical configuration, checks canonical/sitemap/social URL agreement across all eleven public pages, parses company and service JSON-LD, and confirms missing services return 404 with `noindex`. Run `npx playwright test tests/seo.spec.ts --project=desktop` for the focused browser checks.
