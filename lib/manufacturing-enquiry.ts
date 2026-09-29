import { findManufacturingService } from '../data/manufacturing';
import { contactFields, type FieldDefinition, type FieldErrors } from './enquiry';

export const acceptedExtensions = [
  'stl',
  'step',
  'stp',
  'dxf',
  'dwg',
  'svg',
  'pdf',
  'png',
  'jpg',
  'jpeg',
];
export const MAX_FILES = 4;
export const MAX_FILE_BYTES = 5 * 1024 * 1024;
export const MAX_TOTAL_BYTES = 12 * 1024 * 1024;
export type ManufacturingField = Omit<FieldDefinition, 'type'> & {
  type?: FieldDefinition['type'] | 'date';
};
export function manufacturingFields(slug: string): ManufacturingField[] {
  const service = findManufacturingService(slug);
  return [
    ...contactFields.map((field) =>
      field.name === 'name' ? { ...field, label: 'Full name' } : field,
    ),
    {
      name: 'option',
      label: service?.designOnly ? 'Project type' : 'Service option',
      required: true,
      options: service?.options.map((option) => option.name),
      full: true,
    },
    {
      name: 'description',
      label: 'Project description',
      type: 'textarea',
      required: true,
      full: true,
      maxLength: 5000,
    },
    ...(slug === 'laser-cutting'
      ? [
          { name: 'material', label: 'Material (if known)', maxLength: 120 },
          { name: 'thickness', label: 'Material thickness (if known)', maxLength: 120 },
        ]
      : []),
    { name: 'quantity', label: 'Quantity (an estimate is fine)', maxLength: 100 },
    { name: 'dimensions', label: 'Approximate dimensions, including units', maxLength: 200 },
    { name: 'date', label: 'Desired completion date', type: 'date' },
    { name: 'notes', label: 'Additional notes', type: 'textarea', full: true, maxLength: 3000 },
  ];
}
export function validateManufacturing(input: Record<string, unknown>) {
  const data: Record<string, string> = {};
  const errors: FieldErrors = {};
  const slug = typeof input.service === 'string' ? input.service : '';
  const service = findManufacturingService(slug);
  if (!service) errors.service = 'Choose a valid manufacturing service.';
  data.service = slug;
  for (const field of manufacturingFields(slug)) {
    const raw = input[field.name];
    const value = typeof raw === 'string' ? raw.trim() : '';
    data[field.name] = value;
    if (raw !== undefined && typeof raw !== 'string') errors[field.name] = 'Enter a text value.';
    else if (field.required && !value)
      errors[field.name] = `Please enter ${field.label.toLowerCase()}.`;
    else if (value.length > (field.maxLength ?? 200))
      errors[field.name] = `Use ${field.maxLength ?? 200} characters or fewer.`;
    else if (field.options && value && !field.options.includes(value))
      errors[field.name] = 'Choose an option from the list.';
    else if (field.type === 'email' && value && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value))
      errors[field.name] = 'Enter a valid email address.';
    else if (
      field.type === 'date' &&
      value &&
      (!/^\d{4}-\d{2}-\d{2}$/.test(value) ||
        !Number.isFinite(Date.parse(value)) ||
        new Date(value).toISOString().slice(0, 10) !== value)
    )
      errors[field.name] = 'Enter a valid date.';
  }
  if (data.description && data.description.length < 10)
    errors.description = 'Please add a little more detail (at least 10 characters).';
  if (input.consent !== 'yes') errors.consent = 'Please agree so we can respond to your enquiry.';
  data.consent = input.consent === 'yes' ? 'yes' : '';
  return { data, errors };
}
export function validateFiles(files: { name: string; size: number }[]): string | undefined {
  if (files.length > MAX_FILES) return `Choose up to ${MAX_FILES} files.`;
  if (
    files.some(
      (file) => !acceptedExtensions.includes(file.name.split('.').pop()?.toLowerCase() ?? ''),
    )
  )
    return 'Choose a supported CAD, drawing or image file.';
  if (files.some((file) => file.size === 0 || file.size > MAX_FILE_BYTES))
    return 'Each file must contain data and be 5 MB or smaller.';
  if (files.reduce((total, file) => total + file.size, 0) > MAX_TOTAL_BYTES)
    return 'Keep the combined file size at 12 MB or less.';
}
