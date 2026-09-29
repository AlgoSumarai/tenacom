'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { contactFields, projectFields, validateEnquiry } from '@/lib/enquiry';
import type { FieldDefinition, FieldErrors } from '@/lib/enquiry';
export function Field({ field, error }: { field: FieldDefinition; error?: string }) {
  const props = {
    id: field.name,
    name: field.name,
    required: field.required,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? `${field.name}-error` : undefined,
  };
  return (
    <div className={`form-field ${field.full ? 'full' : ''}`}>
      <label htmlFor={field.name}>
        {field.label}
        {field.required ? <span>(required)</span> : <span>(optional)</span>}
      </label>
      {field.options ? (
        <select {...props} defaultValue="">
          <option value="">Select an option</option>
          {field.options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      ) : field.type === 'textarea' ? (
        <textarea {...props} maxLength={field.maxLength} />
      ) : (
        <input
          {...props}
          type={field.type || 'text'}
          maxLength={field.maxLength}
          autoComplete={
            (
              { name: 'name', company: 'organization', email: 'email', phone: 'tel' } as Record<
                string,
                string
              >
            )[field.name] || 'off'
          }
        />
      )}{' '}
      {error && (
        <p className="field-error" id={`${field.name}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
export default function ContactForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [brief, setBrief] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  function showErrors(next: FieldErrors) {
    setErrors(next);
    const first = Object.keys(next)[0];
    requestAnimationFrame(() => document.getElementById(first)?.focus());
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setStatus(null);
    const input = Object.fromEntries(new FormData(event.currentTarget));
    const checked = validateEnquiry(input);
    if (Object.keys(checked.errors).length) {
      showErrors(checked.errors);
      return;
    }
    setErrors({});
    setPending(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
        signal: AbortSignal.timeout(20000),
      });
      const result = (await response.json()) as { message: string; errors?: FieldErrors };
      if (result.errors) showErrors(result.errors);
      setStatus({ success: response.ok, message: result.message });
      if (response.ok) form.current?.reset();
    } catch {
      setStatus({
        success: false,
        message: 'The connection was interrupted. Your details are still here; please try again.',
      });
    } finally {
      setPending(false);
      requestAnimationFrame(() => statusRef.current?.focus());
    }
  }
  return (
    <form
      ref={form}
      className="contact-form"
      onSubmit={submit}
      method="post"
      action="/api/contact"
      noValidate
    >
      <noscript>
        <p className="form-status">Please enable JavaScript to use the enquiry form.</p>
      </noscript>
      <div className="form-mode">
        <button type="button" aria-pressed={brief} onClick={() => setBrief(true)}>
          Project brief
        </button>
        <button type="button" aria-pressed={!brief} onClick={() => setBrief(false)}>
          Quick enquiry
        </button>
      </div>
      <fieldset disabled={pending}>
        <legend>01 / A little about you</legend>
        <div className="form-grid">
          {contactFields.map((field) => (
            <Field key={field.name} field={field} error={errors[field.name]} />
          ))}
        </div>
      </fieldset>
      <fieldset disabled={pending}>
        <legend>02 / Start with the problem</legend>
        <div className="form-grid">
          {projectFields.map((field, i) => (
            <div
              className={field.full ? 'form-field-wrapper full' : 'form-field-wrapper'}
              key={field.name}
              hidden={!brief && i > 0}
            >
              <Field field={field} error={errors[field.name]} />
            </div>
          ))}
        </div>
      </fieldset>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <label className="consent" htmlFor="consent">
        <input
          id="consent"
          type="checkbox"
          name="consent"
          value="yes"
          required
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? 'consent-error' : undefined}
        />
        <span>
          I agree that Tenacom may use these details to respond to my enquiry.{' '}
          <Link href="/privacy">Read the privacy notice.</Link>
        </span>
      </label>
      {errors.consent && (
        <p className="field-error" id="consent-error">
          {errors.consent}
        </p>
      )}
      <button className="button" type="submit" disabled={pending}>
        {pending ? 'Sending your enquiry…' : 'Start the Conversation'}
        <ArrowUpRight size={17} />
      </button>
      <p className="form-caption">
        Please don’t include confidential designs, passwords or sensitive personal information.
      </p>
      {status && (
        <div
          ref={statusRef}
          tabIndex={-1}
          role={status.success ? 'status' : 'alert'}
          className={`form-status ${status.success ? 'success' : 'error'}`}
        >
          {status.message}
        </div>
      )}
    </form>
  );
}
