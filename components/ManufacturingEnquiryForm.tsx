'use client';
import Link from 'next/link';
import { useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, Upload } from 'lucide-react';
import { Field } from './ContactForm';
import type { ManufacturingService } from '@/data/manufacturing';
import {
  acceptedExtensions,
  manufacturingFields,
  validateFiles,
  validateManufacturing,
} from '@/lib/manufacturing-enquiry';
import type { FieldErrors } from '@/lib/enquiry';

export default function ManufacturingEnquiryForm({ service }: { service: ManufacturingService }) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [files, setFiles] = useState<File[]>([]);
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<{
    success: boolean;
    message: string;
    reference?: string;
    conflict?: boolean;
  } | null>(null);
  const lock = useRef(false);
  const requestId = useRef('');
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  function showErrors(next: FieldErrors) {
    setErrors(next);
    requestAnimationFrame(() => document.getElementById(Object.keys(next)[0])?.focus());
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current || status?.success) return;
    const body = new FormData(event.currentTarget);
    body.set('service', service.slug);
    const checked = validateManufacturing(Object.fromEntries(body));
    const fileError = validateFiles(files);
    if (fileError) checked.errors.files = fileError;
    if (Object.keys(checked.errors).length) {
      showErrors(checked.errors);
      return;
    }
    requestId.current ||= crypto.randomUUID();
    body.set('requestId', requestId.current);
    body.delete('files');
    files.forEach((file) => body.append('files', file));
    lock.current = true;
    setPending(true);
    setErrors({});
    setStatus(null);
    try {
      const response = await fetch('/api/manufacturing-enquiries', {
        method: 'POST',
        body,
        signal: AbortSignal.timeout(60000),
      });
      const result = await response.json();
      if (result.errors) showErrors(result.errors);
      setStatus({
        success: response.ok,
        message: result.message,
        reference: result.reference,
        conflict: response.status === 409,
      });
      if (!result.errors) requestAnimationFrame(() => statusRef.current?.focus());
    } catch {
      setStatus({
        success: false,
        message:
          'The connection was interrupted. Your details and files are still here. Retry to check that this enquiry was received.',
      });
      requestAnimationFrame(() => statusRef.current?.focus());
    } finally {
      lock.current = false;
      setPending(false);
    }
  }
  return (
    <form
      ref={formRef}
      className="contact-form manufacturing-form"
      onSubmit={submit}
      method="post"
      action="/api/manufacturing-enquiries"
      encType="multipart/form-data"
      noValidate
    >
      <noscript>
        <p className="form-status">Please enable JavaScript to send your enquiry and files.</p>
      </noscript>
      <p className="eyebrow">Enquiry / {service.name}</p>
      <p className="form-caption">
        An idea or a rough sketch is enough to start. Technical details and files are optional.
      </p>
      <fieldset disabled={pending || status?.success}>
        <legend>Tell us about your project</legend>
        <div className="form-grid">
          {manufacturingFields(service.slug).map((field) => (
            <Field key={field.name} field={field} error={errors[field.name]} />
          ))}
        </div>
        <div className="form-field upload-field">
          <label htmlFor="files">
            <Upload size={18} aria-hidden="true" /> Drawings, models or reference photos{' '}
            <span>(optional)</span>
          </label>
          <p id="file-help">
            STL, STEP, STP, DXF, DWG, SVG, PDF, PNG, JPG, JPEG. Up to 4 files, 5 MB each and 12 MB
            combined.
          </p>
          <input
            id="files"
            type="file"
            multiple
            accept={acceptedExtensions.map((extension) => `.${extension}`).join(',')}
            aria-invalid={Boolean(errors.files)}
            aria-describedby={`file-help${errors.files ? ' files-error' : ''}`}
            onChange={(event) => {
              const selected = Array.from(event.target.files || []);
              setFiles(selected);
              setErrors((current) => {
                const next = { ...current };
                const error = validateFiles(selected);
                if (error) next.files = error;
                else delete next.files;
                return next;
              });
            }}
          />
          {files.length > 0 && (
            <ul className="upload-list">
              {files.map((file, index) => (
                <li key={`${file.name}-${index}`}>
                  <span>
                    {file.name} <small>({(file.size / 1024 / 1024).toFixed(2)} MB)</small>
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove ${file.name}`}
                    onClick={() => {
                      const next = files.filter((_, i) => i !== index);
                      setFiles(next);
                      setErrors((current) => {
                        const updated = { ...current };
                        const error = validateFiles(next);
                        if (error) updated.files = error;
                        else delete updated.files;
                        return updated;
                      });
                      const input = document.getElementById('files') as HTMLInputElement;
                      input.value = '';
                    }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          {errors.files && (
            <p id="files-error" className="field-error">
              {errors.files}
            </p>
          )}
        </div>
        <div className="honeypot" aria-hidden="true">
          <label htmlFor="website">Leave this field empty</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
        <label className="consent" htmlFor="consent">
          <input
            id="consent"
            name="consent"
            value="yes"
            type="checkbox"
            required
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? 'consent-error' : undefined}
          />
          <span>
            I agree that Tenacom may use these details and files to assess and respond to my
            enquiry. <Link href="/privacy">Privacy notice</Link>.
          </span>
        </label>
        {errors.consent && (
          <p id="consent-error" className="field-error">
            {errors.consent}
          </p>
        )}
        <button className="button" type="submit" disabled={pending || status?.success}>
          {pending ? 'Sending your project enquiry…' : 'Send project enquiry'}
          <ArrowUpRight size={17} />
        </button>
      </fieldset>
      {status && (
        <div
          ref={statusRef}
          tabIndex={-1}
          role={status.success ? 'status' : 'alert'}
          className={`form-status ${status.success ? 'success' : 'error'}`}
        >
          <p>{status.message}</p>
          {status.reference && <p className="enquiry-reference">Reference: {status.reference}</p>}
        </div>
      )}
      {status?.success && (
        <button
          className="text-link"
          type="button"
          onClick={() => {
            formRef.current?.reset();
            setFiles([]);
            setStatus(null);
            requestId.current = '';
          }}
        >
          Start another enquiry
        </button>
      )}
      {status?.conflict && (
        <button
          className="text-link"
          type="button"
          onClick={() => {
            requestId.current = '';
            setStatus(null);
          }}
        >
          Keep these details for a new enquiry
        </button>
      )}
    </form>
  );
}
