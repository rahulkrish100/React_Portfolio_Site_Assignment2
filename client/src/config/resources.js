import { formatDate, toDateInput } from '../lib/validators.js'

// Field definitions and display helpers for each API resource. The same
// definitions drive the forms (RecordForm) and the admin lists (ResourceManager).

const titledRecordFields = [
  { name: 'title', label: 'Title', required: true, maxLength: 150 },
  { name: 'completion', label: 'Completion date', type: 'date', required: true },
  { name: 'description', label: 'Description', type: 'textarea', required: true, minLength: 10, maxLength: 1000 },
]

const titledRecordToForm = (r) => ({
  title: r.title ?? '',
  completion: toDateInput(r.completion),
  description: r.description ?? '',
})

export const contactFields = [
  { name: 'firstName', label: 'First name', required: true, maxLength: 60, autoComplete: 'given-name' },
  { name: 'lastName', label: 'Last name', required: true, maxLength: 60, autoComplete: 'family-name' },
  { name: 'phone', label: 'Contact number', type: 'tel', required: true, autoComplete: 'tel' },
  { name: 'email', label: 'Email address', type: 'email', required: true, autoComplete: 'email' },
  { name: 'message', label: 'Message', type: 'textarea', required: true, minLength: 10, maxLength: 2000 },
]

export const RESOURCES = {
  projects: {
    key: 'projects',
    label: 'Projects',
    singular: 'Project',
    endpoint: '/api/projects',
    fields: titledRecordFields,
    toForm: titledRecordToForm,
    heading: (r) => r.title,
    meta: (r) => `Completed ${formatDate(r.completion)}`,
    body: (r) => r.description,
  },
  qualifications: {
    key: 'qualifications',
    label: 'Qualifications',
    singular: 'Qualification',
    endpoint: '/api/qualifications',
    fields: titledRecordFields,
    toForm: titledRecordToForm,
    heading: (r) => r.title,
    meta: (r) => `Completed ${formatDate(r.completion)}`,
    body: (r) => r.description,
  },
  contacts: {
    key: 'contacts',
    label: 'Contact messages',
    singular: 'Contact message',
    endpoint: '/api/contacts',
    fields: contactFields,
    toForm: (r) => ({
      firstName: r.firstName ?? '',
      lastName: r.lastName ?? '',
      phone: r.phone ?? '',
      email: r.email ?? '',
      message: r.message ?? '',
    }),
    heading: (r) => `${r.firstName} ${r.lastName}`,
    meta: (r) => `${r.email} · ${r.phone} · received ${formatDate(r.createdAt)}`,
    body: (r) => r.message,
  },
}
