export type FieldDefinition = {
  name: string;
  label: string;
  type?: 'email' | 'tel' | 'number' | 'textarea' | 'date';
  required?: boolean;
  full?: boolean;
  options?: readonly string[];
  maxLength?: number;
};
export const contactFields: readonly FieldDefinition[] = [
  { name: 'name', label: 'Name', required: true, maxLength: 100 },
  { name: 'company', label: 'Company', maxLength: 160 },
  { name: 'email', label: 'Email', type: 'email', required: true, maxLength: 254 },
  { name: 'phone', label: 'Phone', type: 'tel', maxLength: 40 },
];
export const projectFields: readonly FieldDefinition[] = [
  {
    name: 'problem',
    label: 'What problem are you trying to solve?',
    type: 'textarea',
    required: true,
    full: true,
    maxLength: 5000,
  },
  {
    name: 'equipment',
    label: 'What equipment, product or process is involved?',
    type: 'textarea',
    full: true,
    maxLength: 2000,
  },
  {
    name: 'outcome',
    label: 'What would you like to monitor, control or automate?',
    type: 'textarea',
    full: true,
    maxLength: 2000,
  },
  {
    name: 'industry',
    label: 'Industry',
    options: [
      'Manufacturing',
      'Mining',
      'Agriculture',
      'Energy',
      'Logistics / cold storage',
      'Water / infrastructure',
      'Commercial property',
      'Engineering / technology',
      'Other',
    ],
  },
  {
    name: 'environment',
    label: 'Where will the system operate?',
    options: [
      'Indoor',
      'Outdoor',
      'Industrial',
      'Remote',
      'Mobile',
      'Mixed environments',
      'Other / not yet known',
    ],
  },
  {
    name: 'existingEquipment',
    label: 'Does physical equipment already exist?',
    options: ['Yes', 'No', 'Partly', 'Not sure yet'],
  },
  {
    name: 'existingSoftware',
    label: 'Does software already exist?',
    options: ['Yes', 'No', 'Partly', 'Not sure yet'],
  },
  { name: 'quantity', label: 'Approximate machines, devices or sites', maxLength: 160 },
  {
    name: 'stage',
    label: 'Project stage',
    options: ['Idea', 'Research', 'Prototype', 'Existing system', 'Ready to deploy'],
  },
  {
    name: 'timeline',
    label: 'Expected timeline',
    options: [
      'Exploring options',
      'Within 3 months',
      '3–6 months',
      '6–12 months',
      'More than 12 months',
    ],
  },
  {
    name: 'budget',
    label: 'Approximate budget (ZAR)',
    options: [
      'Not yet defined',
      'Under R50,000',
      'R50,000–R150,000',
      'R150,000–R500,000',
      'R500,000+',
    ],
  },
  {
    name: 'additional',
    label: 'Anything else we should understand?',
    type: 'textarea',
    full: true,
    maxLength: 3000,
  },
];
export const enquiryFields = [...contactFields, ...projectFields];
export type Enquiry = Record<string, string>;
export type FieldErrors = Record<string, string>;
export function validateEnquiry(input: unknown): { data: Enquiry; errors: FieldErrors } {
  const data: Enquiry = {};
  const errors: FieldErrors = {};
  const source =
    input && typeof input === 'object' && !Array.isArray(input)
      ? (input as Record<string, unknown>)
      : {};
  for (const field of enquiryFields) {
    const raw = source[field.name];
    const value = typeof raw === 'string' ? raw.trim() : '';
    data[field.name] = value;
    if (raw !== undefined && typeof raw !== 'string') errors[field.name] = 'Enter a text value.';
    else if (field.required && !value)
      errors[field.name] =
        `Please enter ${field.name === 'problem' ? 'a short description of your problem' : `your ${field.label.toLowerCase()}`}.`;
    else if (value.length > (field.maxLength ?? 200))
      errors[field.name] = `Please use ${field.maxLength ?? 200} characters or fewer.`;
    else if (field.type === 'email' && value && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value))
      errors[field.name] = 'Enter a valid email address.';
    else if (field.options && value && !field.options.includes(value))
      errors[field.name] = 'Choose an option from the list.';
  }
  if (data.problem && data.problem.length < 10)
    errors.problem = 'Please give us a little more detail (at least 10 characters).';
  if (source.consent !== 'yes') errors.consent = 'Please agree so we can respond to your enquiry.';
  return { data, errors };
}
