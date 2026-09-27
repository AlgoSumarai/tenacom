import { createHash } from 'node:crypto';
import { validateEnquiry } from '@/lib/enquiry';
import { deliverEnquiry, deliveryConfigured } from '@/lib/mail';
import { allowEnquiry } from '@/lib/rate-limit';
export const runtime = 'nodejs';
const MAX_BODY_BYTES = 24000;
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  const allowedOrigin = process.env.SITE_URL
    ? new URL(process.env.SITE_URL).origin
    : new URL(request.url).origin;
  if (origin && origin !== allowedOrigin)
    return Response.json({ message: 'Please submit from the Tenacom website.' }, { status: 403 });
  if (!request.headers.get('content-type')?.includes('application/json'))
    return Response.json({ message: 'Expected a JSON enquiry.' }, { status: 415 });
  // Only trust a forwarded IP when the deployment proxy overwrites that header.
  const ip =
    process.env.TRUST_PROXY === 'true'
      ? request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
      : 'shared';
  const key = createHash('sha256').update(ip).digest('hex');
  if (!allowEnquiry(key))
    return Response.json(
      { message: 'Too many attempts. Please try again in 10 minutes.' },
      { status: 429, headers: { 'Retry-After': '600' } },
    );
  let payload: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) throw new Error('Empty body');
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        return Response.json(
          { message: 'Your enquiry is too long. Please shorten it.' },
          { status: 413 },
        );
      }
      chunks.push(value);
    }
    payload = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return Response.json(
      { message: 'The enquiry could not be read. Please try again.' },
      { status: 400 },
    );
  }
  if (payload && typeof payload === 'object' && 'website' in payload && payload.website)
    return Response.json({ message: 'Your enquiry could not be submitted.' }, { status: 400 });
  const { data, errors } = validateEnquiry(payload);
  if (Object.keys(errors).length)
    return Response.json(
      { message: 'Please check the highlighted fields.', errors },
      { status: 422 },
    );
  if (!deliveryConfigured())
    return Response.json(
      {
        message:
          'Online enquiries are temporarily unavailable. Your message has not been sent. Please keep a copy and try again later.',
      },
      { status: 503 },
    );
  try {
    await deliverEnquiry(data);
    return Response.json({
      message:
        'Thank you. Your enquiry has been sent to Tenacom. We’ll get back to you using the contact details you provided.',
    });
  } catch {
    return Response.json(
      {
        message:
          'We couldn’t send your enquiry. Your details are still here; please try again shortly.',
      },
      { status: 502 },
    );
  }
}
