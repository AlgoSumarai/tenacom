import { test, expect } from '@playwright/test';

test('manufacturing layout works at narrow and tablet widths', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'Viewport matrix uses desktop emulation.');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 820, 1024]) {
    await page.setViewportSize({ width, height: 960 });
    await page.goto('/manufacturing/sheet-metal-design');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.locator('#enquiry').scrollIntoViewIfNeeded();
    await expect(page.locator('#name')).toBeVisible();
    await page
      .locator('.manufacturing-form')
      .screenshot({ path: testInfo.outputPath(`form-${width}.png`) });
  }
});

test('manufacturing pages are discoverable, responsive and service-specific', async ({
  page,
  isMobile,
}, testInfo) => {
  test.setTimeout(90000);
  await page.goto('/');
  if (isMobile) await page.getByRole('button', { name: 'Open menu' }).click();
  await page
    .getByRole('navigation', {
      name: isMobile ? 'Mobile navigation' : 'Main navigation',
      exact: true,
    })
    .getByRole('link', { name: 'Manufacturing', exact: true })
    .click();
  await expect(page).toHaveURL('/manufacturing', { timeout: 20000 });
  for (const slug of ['', '/3d-printing', '/laser-cutting', '/sheet-metal-design']) {
    const response = await page.goto(`/manufacturing${slug}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page).toHaveTitle(/Tenacom/);
    expect(await page.locator('link[rel=canonical]').getAttribute('href')).toBe(
      `https://www.tenacom.co.za/manufacturing${slug}`,
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await expect(page.locator('.manufacturing-hero-image img')).toBeVisible();
    if (slug) {
      const workflow = await page.locator('.manufacturing-workflow .process-list').boundingBox();
      expect(workflow!.width).toBeGreaterThan(isMobile ? 300 : 450);
      await page.getByRole('link', { name: 'Enquire about this service' }).click();
      await expect(page.locator('#enquiry')).toBeInViewport();
      await expect(page.locator('#option option')).toHaveCount(
        slug === '/sheet-metal-design' ? 9 : 4,
      );
      await expect(page.locator('#files')).not.toHaveAttribute('required');
    }
    for (const image of await page.locator('main img').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth))
        .toBeGreaterThan(0);
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({
      path: testInfo.outputPath(`manufacturing${slug.replace('/', '-') || '-hub'}.png`),
      fullPage: true,
    });
  }
  expect((await page.goto('/manufacturing/unknown-service'))?.status()).toBe(404);
});

test('manufacturing enquiry validates, keeps files on failure and prevents duplicate submission', async ({
  page,
}) => {
  await page.goto('/manufacturing/laser-cutting');
  await page.getByRole('button', { name: 'Send project enquiry' }).click();
  await expect(page.locator('#name')).toBeFocused();
  await expect(page.locator('#name-error')).toBeVisible();
  await page.getByLabel('Full name').fill('Example Customer');
  await page.getByLabel('Email', { exact: false }).fill('customer@example.com');
  await page.getByLabel('Service option').selectOption('Design + Cutting');
  await page.getByLabel('Project description').fill('I need a panel made from my sketch.');
  await page.locator('#consent').check();
  await page.locator('#files').setInputFiles({
    name: 'sketch.exe',
    mimeType: 'application/octet-stream',
    buffer: Buffer.from('test'),
  });
  await expect(page.locator('#files-error')).toBeVisible();
  await page.getByRole('button', { name: 'Remove sketch.exe' }).click();
  await page.locator('#files').setInputFiles({
    name: 'sketch.svg',
    mimeType: 'image/svg+xml',
    buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>'),
  });
  let calls = 0;
  let release: () => void = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route('**/api/manufacturing-enquiries', async (route) => {
    calls++;
    const body = route.request().postDataBuffer()!.toString();
    expect(body).toContain('laser-cutting');
    expect(body).toContain('Design + Cutting');
    expect(body).toContain('sketch.svg');
    if (calls === 1)
      await route.fulfill({
        status: 502,
        json: { message: 'Unable to record your enquiry. Please try again.' },
      });
    else {
      await gate;
      await route.fulfill({
        status: 200,
        json: { message: 'Your enquiry has been received.', reference: 'test-reference' },
      });
    }
  });
  await page.getByRole('button', { name: 'Send project enquiry' }).click();
  await expect(page.locator('.manufacturing-form').getByRole('alert')).toContainText(
    'Please try again',
  );
  await expect(page.locator('#name')).toHaveValue('Example Customer');
  await expect(page.locator('.upload-list')).toContainText('sketch.svg');
  await page.getByRole('button', { name: 'Send project enquiry' }).click();
  await expect(page.getByRole('button', { name: 'Sending your project enquiry' })).toBeDisabled();
  release();
  await expect(page.getByRole('status')).toContainText('received');
  expect(calls).toBe(2);
  await expect(page.getByRole('button', { name: 'Send project enquiry' })).toBeDisabled();
  await page.getByRole('button', { name: 'Start another enquiry' }).click();
  await expect(page.locator('#name')).toHaveValue('');
});
