import { test, expect } from '@playwright/test';

const origin = 'https://www.tenacom.co.za';
const paths = [
  '/',
  '/manufacturing',
  '/manufacturing/3d-printing',
  '/manufacturing/laser-cutting',
  '/manufacturing/sheet-metal-design',
  '/capabilities',
  '/solutions',
  '/industries',
  '/about',
  '/contact',
  '/privacy',
];

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'SEO output is independent of viewport.');
});

test('brand favicons are directly crawlable image files', async ({ page, request }) => {
  await page.goto('/');
  const png = page.locator('head link[rel="icon"][type="image/png"]');
  await expect(png).toHaveAttribute('sizes', '96x96');
  const pngUrl = new URL((await png.getAttribute('href'))!, page.url());
  expect(pngUrl.pathname).toBe('/icon.png');
  const response = await request.get(`${pngUrl.pathname}${pngUrl.search}`);
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('image/png');
  const bytes = await response.body();
  expect(bytes.readUInt32BE(16)).toBe(96);
  expect(bytes.readUInt32BE(20)).toBe(96);

  const ico = await request.get('/favicon.ico');
  expect(ico.status()).toBe(200);
  const icoBytes = await ico.body();
  expect(icoBytes.readUInt16LE(2)).toBe(1);
  expect(icoBytes.readUInt16LE(4)).toBeGreaterThan(1);
  const apple = page.locator('head link[rel="apple-touch-icon"]');
  await expect(apple).toHaveAttribute('sizes', '180x180');
  const appleUrl = new URL((await apple.getAttribute('href'))!, page.url());
  expect(appleUrl.pathname).toBe('/apple-icon.png');
  expect((await request.get(`${appleUrl.pathname}${appleUrl.search}`)).status()).toBe(200);
});

test('crawlable pages, sitemap and social metadata use the same public canonical URLs', async ({
  page,
  request,
}) => {
  test.setTimeout(90000);
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain(`Sitemap: ${origin}/sitemap.xml`);
  expect(await robots.text()).toContain('Disallow: /api/');
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  const urls = [...(await sitemap.text()).matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  expect(urls.sort()).toEqual(paths.map((path) => new URL(path, origin).href).sort());

  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const path of paths) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    expect(response?.headers()['x-robots-tag'] || '').not.toContain('noindex');
    const canonical = page.locator('head link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    expect(new URL((await canonical.getAttribute('href'))!).href).toBe(new URL(path, origin).href);
    const title = await page.title();
    const description = (await page
      .locator('head meta[name="description"]')
      .getAttribute('content'))!;
    expect(title).toContain('Tenacom');
    expect(titles.has(title)).toBe(false);
    expect(descriptions.has(description)).toBe(false);
    expect(description.length).toBeGreaterThan(50);
    titles.add(title);
    descriptions.add(description);
    for (const [property, content] of [
      ['og:title', title],
      ['og:description', description],
    ]) {
      await expect(page.locator(`head meta[property="${property}"]`)).toHaveAttribute(
        'content',
        content,
      );
    }
    const ogUrl = await page.locator('head meta[property="og:url"]').getAttribute('content');
    expect(new URL(ogUrl!).href).toBe(new URL(path, origin).href);
    for (const selector of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
      const imageUrl = new URL((await page.locator(`head ${selector}`).getAttribute('content'))!);
      expect(imageUrl.origin).toBe(origin);
      expect(imageUrl.pathname).toBe('/opengraph-image');
    }
    await expect(page.locator('head meta[name="robots"]')).toHaveAttribute(
      'content',
      'index, follow',
    );
  }
  const image = await request.get('/opengraph-image');
  expect(image.status()).toBe(200);
  expect(image.headers()['content-type']).toContain('image/png');
});

test('structured data describes the company and the actual manufacturing service', async ({
  page,
}) => {
  await page.goto('/');
  const home = JSON.parse(
    (await page.locator('script[type="application/ld+json"]').textContent())!,
  );
  const organization = home['@graph'].find(
    (item: Record<string, unknown>) => item['@type'] === 'Organization',
  );
  const website = home['@graph'].find(
    (item: Record<string, unknown>) => item['@type'] === 'WebSite',
  );
  expect(organization.name).toBe('Tenacom');
  expect(organization.url).toBe(`${origin}/`);
  expect(website.publisher['@id']).toBe(organization['@id']);

  for (const path of paths.filter((path) => path.startsWith('/manufacturing/'))) {
    await page.goto(path);
    const data = JSON.parse(
      (await page.locator('script[type="application/ld+json"]').textContent())!,
    );
    const service = data['@graph'].find(
      (item: Record<string, unknown>) => item['@type'] === 'Service',
    );
    const breadcrumbs = data['@graph'].find(
      (item: Record<string, unknown>) => item['@type'] === 'BreadcrumbList',
    );
    expect(service.url).toBe(`${origin}${path}`);
    expect(service.name).toBe(await page.locator('h1').textContent());
    expect(service.provider['@id']).toBe(organization['@id']);
    expect(service.description).toBe(await page.locator('.service-hero .lead').textContent());
    expect(breadcrumbs.itemListElement.map((item: { item: string }) => item.item)).toEqual([
      `${origin}/`,
      `${origin}/manufacturing`,
      `${origin}${path}`,
    ]);
  }
  const response = await page.goto('/manufacturing/missing-service');
  expect(response?.status()).toBe(404);
  await expect(page.locator('meta[name="robots"][content="noindex"]')).toHaveCount(1);
});
