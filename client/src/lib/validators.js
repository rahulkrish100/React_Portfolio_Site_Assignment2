// Client-side validation that mirrors the server's express-validator rules,
// so users get instant feedback before a request is sent. The server still
// validates everything; these checks are for usability, not security.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE = /^[+()\d\s.-]{7,20}$/
const DATE = /^\d{4}-\d{2}-\d{2}$/

/**
 * Validates `values` against a list of field definitions:
 *   { name, label, type, required, minLength, maxLength, match, validate }
 * Returns an object of { [fieldName]: message } for failing fields.
 */
export function validateFields(fields, values) {
  const errors = {}
  for (const field of fields) {
    const raw = values[field.name]
    const value = typeof raw === 'string' && field.type !== 'password' ? raw.trim() : raw ?? ''
    const label = field.label

    if (field.required && !value) {
      errors[field.name] = `${label} is required`
      continue
    }
    if (!value) continue

    if (field.type === 'email' && !EMAIL.test(value)) errors[field.name] = 'Enter a valid email address'
    else if (field.type === 'tel' && !PHONE.test(value)) errors[field.name] = 'Enter a valid phone number (digits, spaces, + - ( ) only)'
    else if (field.type === 'date' && (!DATE.test(value) || Number.isNaN(Date.parse(value)))) errors[field.name] = 'Enter a valid date'
    else if (field.minLength && value.length < field.minLength) errors[field.name] = `${label} must be at least ${field.minLength} characters`
    else if (field.maxLength && value.length > field.maxLength) errors[field.name] = `${label} must be ${field.maxLength} characters or fewer`
    else if (field.match && value !== values[field.match]) errors[field.name] = field.matchMessage || `${label} does not match`
    else if (field.validate) {
      const message = field.validate(value, values)
      if (message) errors[field.name] = message
    }
  }
  return errors
}

/** Trims string values before they are sent to the API (passwords untouched). */
export function cleanValues(fields, values) {
  const out = {}
  for (const field of fields) {
    if (field.excludeFromPayload) continue
    const v = values[field.name]
    out[field.name] = typeof v === 'string' && field.type !== 'password' ? v.trim() : v
  }
  return out
}

/** ISO date from the API -> "YYYY-MM-DD" for <input type="date"> */
export const toDateInput = (value) => (value ? String(value).slice(0, 10) : '')

/** ISO date -> "Apr 30, 2025". UTC avoids the date shifting by a day in Toronto. */
export const formatDate = (value, options = { year: 'numeric', month: 'short', day: 'numeric' }) =>
  value ? new Date(value).toLocaleDateString('en-CA', { ...options, timeZone: 'UTC' }) : ''
