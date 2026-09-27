import test from 'node:test';
import assert from 'node:assert/strict';
import { POST } from '../app/api/contact/route';
const input = {
  name: 'Test Engineer',
  email: 'engineer@example.com',
  problem: 'We need to monitor pump temperatures.',
  consent: 'yes',
};
let index = 0;
function request(body: unknown, extra: Record<string, string> = {}) {
  return new Request('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'http://localhost:3000',
      'x-forwarded-for': `test-${index++}`,
      ...extra,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}
test('contact route validates, bounds input and handles delivery truthfully', async () => {
  const names = [
    'SITE_URL',
    'TRUST_PROXY',
    'RESEND_API_KEY',
    'CONTACT_FROM_EMAIL',
    'CONTACT_TO_EMAIL',
  ];
  const previous = Object.fromEntries(names.map((name) => [name, process.env[name]]));
  const originalFetch = global.fetch;
  process.env.SITE_URL = 'http://localhost:3000';
  process.env.TRUST_PROXY = 'true';
  delete process.env.RESEND_API_KEY;
  delete process.env.CONTACT_FROM_EMAIL;
  delete process.env.CONTACT_TO_EMAIL;
  try {
    assert.equal((await POST(request(input, { Origin: 'https://untrusted.example' }))).status, 403);
    assert.equal((await POST(request(input, { 'Content-Type': 'text/plain' }))).status, 415);
    assert.equal((await POST(request('{bad-json'))).status, 400);
    assert.equal((await POST(request({ problem: 'x'.repeat(25000) }))).status, 413);
    assert.equal((await POST(request({ ...input, website: 'spam' }))).status, 400);
    assert.equal((await POST(request({ ...input, email: 'invalid' }))).status, 422);
    const unavailable = await POST(request(input));
    assert.equal(unavailable.status, 503);
    assert.match((await unavailable.json()).message, /has not been sent/);
    process.env.RESEND_API_KEY = 'test-only-key';
    process.env.CONTACT_FROM_EMAIL = 'website@example.com';
    process.env.CONTACT_TO_EMAIL = 'inbox@example.com';
    let captured: Record<string, unknown> | undefined;
    global.fetch = async (_url, options) => {
      captured = JSON.parse(String(options?.body));
      return Response.json({ id: 'test-receipt' });
    };
    assert.equal((await POST(request(input))).status, 200);
    assert.equal(captured?.reply_to, input.email);
    assert.deepEqual(captured?.to, ['inbox@example.com']);
    assert.match(String(captured?.text), /pump temperatures/);
    global.fetch = async () => Response.json({ error: 'Rejected' }, { status: 500 });
    assert.equal((await POST(request(input))).status, 502);
    global.fetch = async () => {
      throw new Error('Connection failure');
    };
    assert.equal((await POST(request(input))).status, 502);
  } finally {
    global.fetch = originalFetch;
    for (const name of names) {
      if (previous[name] === undefined) delete process.env[name];
      else process.env[name] = previous[name];
    }
  }
});
