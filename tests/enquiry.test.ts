import test from 'node:test';
import assert from 'node:assert/strict';
import { validateEnquiry } from '../lib/enquiry';
import { allowEnquiry } from '../lib/rate-limit';
const valid = {
  name: 'Test Engineer',
  email: 'engineer@example.com',
  problem: 'We need to monitor a pump at a remote site.',
  consent: 'yes',
};
test('quick enquiries accept only necessary context and trim contact data', () => {
  const { data, errors } = validateEnquiry({ ...valid, name: ' Test Engineer ' });
  assert.deepEqual(errors, {});
  assert.equal(data.name, 'Test Engineer');
});
test('required fields and consent cannot be bypassed', () => {
  const { errors } = validateEnquiry({});
  assert.deepEqual(Object.keys(errors), ['name', 'email', 'problem', 'consent']);
});
test('rejects invalid email, enum values, oversized and non-string input', () => {
  const { errors } = validateEnquiry({
    ...valid,
    email: 'invalid',
    stage: 'fabricated',
    equipment: 'x'.repeat(2001),
    phone: { value: '123' },
  });
  for (const key of ['email', 'stage', 'equipment', 'phone']) assert.ok(errors[key]);
});
test('rejects underspecified problem', () => {
  assert.ok(validateEnquiry({ ...valid, problem: 'pump' }).errors.problem);
});
test('rate guard expires and allows no more than five attempts per window', () => {
  for (let i = 0; i < 5; i++) assert.equal(allowEnquiry('test-key', 1000), true);
  assert.equal(allowEnquiry('test-key', 1001), false);
  assert.equal(allowEnquiry('test-key', 601001), true);
});
