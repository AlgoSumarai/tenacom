import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveSiteUrl } from '../lib/site';
import { POST as contact } from '../app/api/contact/route';
import { POST as manufacturing } from '../app/api/manufacturing-enquiries/route';

test('production metadata defaults to the live HTTPS host and normalises domain aliases', () => {
  for (const value of [
    undefined,
    '',
    '   ',
    'https://tenacom.co.za',
    'https://www.tenacom.co.za/',
  ]) {
    assert.equal(resolveSiteUrl(value, true).href, 'https://www.tenacom.co.za/');
  }
});

test('a copied development origin cannot leak into production SEO', () => {
  for (const value of [
    'http://localhost:3000',
    'https://localhost',
    'https://127.0.0.1',
    'https://[::1]',
    'http://example.com',
  ]) {
    assert.throws(() => resolveSiteUrl(value, true), /public HTTPS origin/);
  }
  assert.equal(resolveSiteUrl('http://localhost:3000', false).origin, 'http://localhost:3000');
});

test('canonical configuration rejects paths, credentials and non-web protocols', () => {
  for (const value of [
    'https://www.tenacom.co.za/manufacturing',
    'https://www.tenacom.co.za?tracking=1',
    'https://www.tenacom.co.za#home',
    'https://user:password@example.com',
    'ftp://example.com',
  ]) {
    assert.throws(() => resolveSiteUrl(value, true), /HTTP\(S\) origin/);
  }
});

test('enquiry origins agree with SEO when the configured domain redirects to www', async () => {
  const previous = process.env.SITE_URL;
  process.env.SITE_URL = 'https://tenacom.co.za';
  try {
    for (const [path, handler] of [
      ['/api/contact', contact],
      ['/api/manufacturing-enquiries', manufacturing],
    ] as const) {
      const request = (origin: string) =>
        new Request(`https://www.tenacom.co.za${path}`, {
          method: 'POST',
          headers: { Origin: origin },
        });
      // A missing content type stops before validation, rate limiting or delivery.
      assert.equal((await handler(request('https://www.tenacom.co.za'))).status, 415);
      assert.equal((await handler(request('https://untrusted.example'))).status, 403);
    }
  } finally {
    if (previous === undefined) delete process.env.SITE_URL;
    else process.env.SITE_URL = previous;
  }
});
