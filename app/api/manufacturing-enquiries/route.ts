import { createHash } from 'node:crypto';
import { validateManufacturing, validateFiles, MAX_TOTAL_BYTES } from '@/lib/manufacturing-enquiry';
import { enquiryDirectory, recordManufacturingEnquiry } from '@/lib/manufacturing-storage';
import { allowEnquiry } from '@/lib/rate-limit';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  const allowed = new URL(process.env.SITE_URL || request.url).origin;
  if (origin && origin !== allowed)
    return Response.json({ message: 'Please submit from the Tenacom website.' }, { status: 403 });
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.startsWith('multipart/form-data;'))
    return Response.json({ message: 'Expected an enquiry with form data.' }, { status: 415 });
  const ip =
    process.env.TRUST_PROXY === 'true'
      ? request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
      : 'shared';
  if (!allowEnquiry(createHash('sha256').update(`manufacturing:${ip}`).digest('hex')))
    return Response.json(
      { message: 'Too many attempts. Please try again in 10 minutes.' },
      { status: 429, headers: { 'Retry-After': '600' } },
    );
  let form: FormData;
  try {
    // Bound the stream before multipart parsing, including requests without Content-Length.
    const reader = request.body?.getReader();
    if (!reader) throw new Error('EMPTY_BODY');
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_TOTAL_BYTES + 64000) {
        await reader.cancel();
        return Response.json(
          { message: 'Your files are too large. Use up to 12 MB in total.' },
          { status: 413 },
        );
      }
      chunks.push(value);
    }
    form = await new Response(Buffer.concat(chunks), {
      headers: { 'Content-Type': contentType },
    }).formData();
  } catch {
    return Response.json(
      { message: 'The enquiry could not be read. Please try again.' },
      { status: 400 },
    );
  }
  if (form.get('website'))
    return Response.json({ message: 'Your enquiry could not be submitted.' }, { status: 400 });
  const id = form.get('requestId');
  if (
    typeof id !== 'string' ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
  )
    return Response.json({ message: 'Please refresh the page and try again.' }, { status: 400 });
  const { data, errors } = validateManufacturing(Object.fromEntries(form));
  const entries = form.getAll('files');
  const files = entries.filter(
    (value): value is File => typeof value !== 'string' && Boolean(value.name),
  );
  const fileError = validateFiles(files);
  if (entries.some((value) => typeof value === 'string'))
    errors.files = 'Choose files using the upload control.';
  else if (fileError) errors.files = fileError;
  if (Object.keys(errors).length)
    return Response.json(
      { message: 'Please check the highlighted fields.', errors },
      { status: 422 },
    );
  try {
    enquiryDirectory();
  } catch {
    return Response.json(
      {
        message:
          'Online enquiries are temporarily unavailable. Your enquiry has not been received. Please keep your details and try again later.',
      },
      { status: 503 },
    );
  }
  try {
    const reference = await recordManufacturingEnquiry(id, data, files);
    return Response.json({
      message:
        'Thank you. Your project enquiry and any files have been received by Tenacom for review.',
      reference,
    });
  } catch (error) {
    if ((error as Error).message === 'IDEMPOTENCY_CONFLICT')
      return Response.json(
        {
          message:
            'An earlier version of this enquiry was already received. Please start a new enquiry for changed details.',
        },
        { status: 409 },
      );
    return Response.json(
      {
        message: 'We could not record your enquiry. Your details are still here; please try again.',
      },
      { status: 502 },
    );
  }
}
