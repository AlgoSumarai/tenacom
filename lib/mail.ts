import type { Enquiry } from './enquiry';
import { enquiryFields } from './enquiry';
export function deliveryConfigured() {
  return Boolean(
    process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL && process.env.CONTACT_TO_EMAIL,
  );
}
export async function deliverEnquiry(data: Enquiry) {
  if (!deliveryConfigured()) throw new Error('DELIVERY_NOT_CONFIGURED');
  const text = enquiryFields
    .filter((field) => data[field.name])
    .map((field) => `${field.label}\n${data[field.name]}`)
    .join('\n\n');
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL,
      to: [process.env.CONTACT_TO_EMAIL],
      reply_to: data.email,
      subject: 'New Tenacom project enquiry',
      text,
    }),
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error('DELIVERY_FAILED');
  const receipt: unknown = await response.json();
  if (
    !receipt ||
    typeof receipt !== 'object' ||
    !('id' in receipt) ||
    typeof receipt.id !== 'string'
  )
    throw new Error('INVALID_DELIVERY_RECEIPT');
}
