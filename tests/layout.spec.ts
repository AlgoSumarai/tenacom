import { test, expect } from '@playwright/test';
test('intermediate viewport layouts and engineering media remain usable', async ({
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
    await page.screenshot({ path: testInfo.outputPath(`home-${width}.png`), fullPage: true });
  }
  await page.locator('.mechanical-grid').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Integrate', exact: true }).click();
  await expect(page.locator('.mechanical-stages')).toContainText('one working prototype');
  await page
    .locator('.mechanical-grid')
    .screenshot({ path: testInfo.outputPath('mechanical.png') });
  await page
    .locator('.capability-grid')
    .screenshot({ path: testInfo.outputPath('capabilities.png') });
});
