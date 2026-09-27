import { test, expect } from '@playwright/test';

const homepageSections = [
  '.home-hero',
  '.people-section',
  '.capability-list',
  '.process-section',
] as const;

test('static photo-led homepage remains usable across intermediate viewports', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'The matrix is independent of device emulation.');
  test.setTimeout(60000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 960 });
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    for (const selector of homepageSections) await expect(page.locator(selector)).toBeVisible();
    expect(
      await page
        .locator('.home-hero img')
        .first()
        .evaluate(
          (image) => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0,
        ),
    ).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`home-${width}.png`), fullPage: true });
  }

  for (const [selector, filename] of [
    ['.people-section', 'people.png'],
    ['.capability-list', 'capabilities.png'],
    ['.process-section', 'process.png'],
  ] as const) {
    const section = page.locator(selector);
    await section.scrollIntoViewIfNeeded();
    await section.screenshot({ path: testInfo.outputPath(filename) });
  }
});
