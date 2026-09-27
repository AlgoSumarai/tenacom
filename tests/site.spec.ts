import { test, expect } from '@playwright/test';
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
    expect(
      await page
        .locator('img')
        .evaluateAll((images) =>
          images.every(
            (image) =>
              image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0,
          ),
        ),
    ).toBe(true);
    expect(await page.locator('body').innerText()).not.toMatch(/lorem ipsum|Â©|Â®/i);
  }
  expect(failures).toEqual([]);
});
test('pump commands and system keyboard tabs change the visible state', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Stop motor' }).click();
  await expect(page.getByText('Stopped', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Start motor' }).click();
  await expect(page.getByText('Running', { exact: true })).toBeVisible();
  const sense = page.getByRole('tab', { name: /Sense/ });
  await sense.click();
  await sense.press('ArrowRight');
  await expect(page.getByRole('tab', { name: /Connect/ })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel')).toContainText('Move information reliably.');
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
test('reduced motion keeps all content visible and technical animation stopped', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  expect(await page.locator('.rotor').evaluate((el) => getComputedStyle(el).animationName)).toBe(
    'none',
  );
  expect(
    await page
      .locator('.reveal')
      .evaluateAll((els) => els.every((el) => getComputedStyle(el).opacity === '1')),
  ).toBe(true);
});
test('branded 404 and discovery endpoints respond correctly', async ({ page, request }) => {
  expect((await page.goto('/missing-system'))?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Signal lost.' })).toBeVisible();
  await page.getByRole('link', { name: 'Return Home' }).click();
  await expect(page).toHaveURL('/');
  for (const path of ['/robots.txt', '/sitemap.xml', '/opengraph-image'])
    expect((await request.get(path)).status()).toBe(200);
});
