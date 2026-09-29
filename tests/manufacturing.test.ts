import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  validateManufacturing,
  validateFiles,
  MAX_FILE_BYTES,
  MAX_TOTAL_BYTES,
} from '../lib/manufacturing-enquiry';
import { manufacturingServices } from '../data/manufacturing';
import { POST } from '../app/api/manufacturing-enquiries/route';

const input = {
  service: '3d-printing',
  name: 'Test Customer',
  email: 'test@example.com',
  option: 'Design only',
  description: 'I have a sketch for a replacement cover.',
  consent: 'yes',
};
test('every service accepts a non-technical enquiry and rejects mismatched options', () => {
  for (const service of manufacturingServices) {
    assert.deepEqual(
      validateManufacturing({ ...input, service: service.slug, option: service.options[0].name })
        .errors,
      {},
    );
  }
  assert.ok(validateManufacturing({ ...input, option: 'Cutting only' }).errors.option);
  assert.ok(validateManufacturing({ ...input, service: '../bad' }).errors.service);
  assert.ok(validateManufacturing({ ...input, email: 'not-email' }).errors.email);
  assert.ok(validateManufacturing({ ...input, name: 42 }).errors.name);
  assert.ok(validateManufacturing({ ...input, consent: '' }).errors.consent);
  assert.ok(validateManufacturing({ ...input, description: 'short' }).errors.description);
  assert.ok(validateManufacturing({ ...input, notes: 'x'.repeat(3001) }).errors.notes);
  assert.ok(validateManufacturing({ ...input, date: '2026-02-31' }).errors.date);
});
test('file checks support references and CAD with count, extension and byte limits', () => {
  assert.equal(validateFiles([]), undefined);
  assert.equal(
    validateFiles([
      { name: 'PART.STEP', size: 15 },
      { name: 'sketch.jpg', size: 15 },
    ]),
    undefined,
  );
  assert.ok(validateFiles([{ name: 'part.exe', size: 10 }]));
  assert.ok(validateFiles([{ name: 'part.pdf', size: 0 }]));
  assert.ok(validateFiles([{ name: 'part.stl', size: MAX_FILE_BYTES + 1 }]));
  assert.ok(validateFiles(Array.from({ length: 5 }, () => ({ name: 'part.stl', size: 10 }))));
  assert.ok(
    validateFiles(Array.from({ length: 3 }, () => ({ name: 'part.stl', size: MAX_FILE_BYTES }))),
  );
});
test('multipart API persists files atomically, deduplicates retries and fails truthfully', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'tenacom-manufacturing-'));
  const env = {
    SITE_URL: process.env.SITE_URL,
    TRUST_PROXY: process.env.TRUST_PROXY,
    MANUFACTURING_ENQUIRY_DIR: process.env.MANUFACTURING_ENQUIRY_DIR,
  };
  process.env.SITE_URL = 'http://localhost:3000';
  process.env.TRUST_PROXY = 'true';
  let sequence = 0;
  function request(
    changes: Record<string, string> = {},
    files: File[] = [],
    headers: Record<string, string> = {},
  ) {
    const form = new FormData();
    Object.entries({ ...input, requestId: randomUUID(), ...changes }).forEach(([key, value]) =>
      form.set(key, value),
    );
    files.forEach((file) => form.append('files', file));
    return new Request('http://localhost:3000/api/manufacturing-enquiries', {
      method: 'POST',
      body: form,
      headers: {
        Origin: 'http://localhost:3000',
        'x-forwarded-for': `manufacturing-test-${sequence++}`,
        ...headers,
      },
    });
  }
  try {
    assert.equal((await POST(request({}, [], { Origin: 'https://other.example' }))).status, 403);
    assert.equal((await POST(request({}, [], { 'Content-Type': 'application/json' }))).status, 415);
    assert.equal((await POST(request({ website: 'spam' }))).status, 400);
    assert.equal((await POST(request({ requestId: '../../bad' }))).status, 400);
    assert.equal((await POST(request({ option: 'Cutting only' }))).status, 422);
    assert.equal((await POST(request({}, [new File(['bad'], 'bad.exe')]))).status, 422);
    // Serialize the synthetic client body first: Node's lazy FormData producer can enqueue
    // after cancellation, unlike the incoming HTTP request stream handled in production.
    const oversized = request({}, [
      new File([new Uint8Array(MAX_TOTAL_BYTES + 65000)], 'large.stl'),
    ]);
    assert.equal(
      (
        await POST(
          new Request(oversized.url, {
            method: 'POST',
            headers: oversized.headers,
            body: await oversized.arrayBuffer(),
          }),
        )
      ).status,
      413,
    );
    delete process.env.MANUFACTURING_ENQUIRY_DIR;
    assert.equal((await POST(request())).status, 503);
    process.env.MANUFACTURING_ENQUIRY_DIR = root;
    const requestId = randomUUID();
    const file = new File(['solid example\nendsolid example'], 'part.stl');
    const responses = await Promise.all([
      POST(request({ requestId }, [file])),
      POST(request({ requestId }, [file])),
    ]);
    assert.deepEqual(
      responses.map((response) => response.status),
      [200, 200],
    );
    assert.deepEqual(await readdir(root), [requestId]);
    const record = JSON.parse(await readFile(path.join(root, requestId, 'enquiry.json'), 'utf8'));
    assert.equal(record.serviceName, '3D Printing');
    assert.equal(record.data.option, 'Design only');
    assert.equal(record.files[0].reference, `${requestId}/1.stl`);
    assert.equal(
      await readFile(path.join(root, record.files[0].reference), 'utf8'),
      await file.text(),
    );
    assert.equal(
      (await POST(request({ requestId, description: 'A different project description' }, [file])))
        .status,
      409,
    );
    process.env.MANUFACTURING_ENQUIRY_DIR = path.join(
      root,
      requestId,
      'enquiry.json',
      'cannot-create',
    );
    assert.equal((await POST(request())).status, 502);
  } finally {
    for (const [key, value] of Object.entries(env)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    await rm(root, { recursive: true, force: true });
  }
});
