import { test, expect } from '@playwright/test';

const homepageSections = [
  '.home-hero',
  '.people-section',
  '.capability-list',
  '.process-section',
] as const;

test('every public page has metadata, working assets and no horizontal overflow', async ({
  page,
}) => {
  test.setTimeout(60000);
  const failures: string[] = [];
  page.on('pageerror', (error) => failures.push(error.message));
  for (const path of [
    '/',
    '/capabilities',
    '/solutions',
    '/industries',
    '/about',
    '/contact',
    '/privacy',
  ]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page).toHaveTitle(/Tenacom/);
    const canonical = await page.locator('link[rel=canonical]').getAttribute('href');
    expect(new URL(canonical!).href).toBe(new URL(path, 'http://localhost:3000').href);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const images = page.locator('img:visible');
    for (const image of await images.all()) await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        images.evaluateAll((items) =>
          items.every(
            (image) =>
              image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0,
          ),
        ),
      )
      .toBe(true);
    expect(await page.locator('body').innerText()).not.toMatch(/lorem ipsum|Â©|Â®/i);
  }
  expect(failures).toEqual([]);
});

test('homepage is concise, photo-led and complete', async ({ page, isMobile }) => {
  await page.goto('/');

  for (const selector of homepageSections) await expect(page.locator(selector)).toBeVisible();

  const heroPhoto = page.locator('.home-hero img').first();
  await expect(heroPhoto).toBeVisible();
  await expect
    .poll(() =>
      heroPhoto.evaluate(
        (image) => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0,
      ),
    )
    .toBe(true);

  const peoplePhotos = page.locator('.people-section img');
  expect(await peoplePhotos.count()).toBeGreaterThan(0);
  // Off-screen photographs are lazy loaded; visibility alone does not request their bytes.
  for (const photo of await peoplePhotos.all()) await photo.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      peoplePhotos.evaluateAll((images) =>
        images.every(
          (image) => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0,
        ),
      ),
    )
    .toBe(true);

  const pageMeasure = await page.locator('main').evaluate((main) => ({
    height: main.scrollHeight,
    viewportHeight: innerHeight,
    words: (main.textContent?.trim().match(/\S+/g) ?? []).length,
  }));
  expect(pageMeasure.words).toBeGreaterThan(150);
  expect(pageMeasure.words).toBeLessThan(850);
  expect(pageMeasure.height).toBeGreaterThan(pageMeasure.viewportHeight * 3);
  expect(pageMeasure.height).toBeLessThan(pageMeasure.viewportHeight * (isMobile ? 20 : 12));
});

test('navigation, escape and focus work at the current breakpoint', async ({ page, isMobile }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page
      .getByRole('navigation', { name: 'Mobile navigation' })
      .getByRole('link', { name: 'Capabilities' })
      .click();
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();
  } else {
    await page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'Capabilities' })
      .click();
  }
  await expect(page).toHaveURL(/\/capabilities/);
});
test('form validates and only resets after a successful delivery response', async ({ page }) => {
  await page.goto('/contact');
  await page.getByRole('button', { name: 'Quick enquiry', exact: true }).click();
  await expect(page.getByLabel('Project stage')).toBeHidden();
  await page.getByRole('button', { name: 'Start the Conversation' }).click();
  await expect(page.locator('#name')).toBeFocused();
  await expect(page.locator('#email-error')).toContainText('Please enter your email');
  await page.getByLabel('Name(required)', { exact: true }).fill('Test Engineer');
  await page.getByLabel('Email(required)', { exact: true }).fill('test@example.com');
  await page
    .getByLabel('What problem are you trying to solve?')
    .fill('We need a pump monitoring prototype.');
  await page.getByRole('checkbox').check();
  // Stub delivery at the browser boundary: no real emails are sent by this test.
  await page.route('**/api/contact', (route) =>
    route.fulfill({ status: 503, json: { message: 'Your message has not been sent.' } }),
  );
  await page.getByRole('button', { name: 'Start the Conversation' }).click();
  await expect(page.locator('.form-status')).toContainText('not been sent');
  await expect(page.locator('#name')).toHaveValue('Test Engineer');
  await page.unroute('**/api/contact');
  await page.route('**/api/contact', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    await route.fulfill({
      status: 200,
      json: { message: 'Thank you. Your enquiry has been sent to Tenacom.' },
    });
  });
  await page.getByRole('button', { name: 'Start the Conversation' }).click();
  await expect(page.getByRole('button', { name: 'Sending your enquiry…' })).toBeDisabled();
  await expect(page.locator('.form-status')).toContainText('has been sent');
  await expect(page.locator('#name')).toHaveValue('');
});

test('reduced motion keeps editorial photos and sections visible and static', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  for (const selector of [...homepageSections, '.home-hero img', '.people-section img']) {
    const elements = page.locator(selector);
    expect(await elements.count()).toBeGreaterThan(0);
    await expect(elements.first()).toBeVisible();
    expect(
      await elements.evaluateAll((nodes) =>
        nodes.every((node) =>
          getComputedStyle(node)
            .animationName.split(',')
            .every((name) => name.trim() === 'none'),
        ),
      ),
    ).toBe(true);
  }
});

test('branded 404 and discovery endpoints respond correctly', async ({ page, request }) => {
  expect((await page.goto('/missing-system'))?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Signal lost.' })).toBeVisible();
  await page.getByRole('link', { name: 'Return Home' }).click();
  await expect(page).toHaveURL('/');
  for (const path of ['/robots.txt', '/sitemap.xml', '/opengraph-image'])
    expect((await request.get(path)).status()).toBe(200);
});
