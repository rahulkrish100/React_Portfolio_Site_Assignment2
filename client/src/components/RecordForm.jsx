import { useState } from 'react'
import { ApiError } from '../lib/api.js'
import { cleanValues, validateFields } from '../lib/validators.js'
import { Alert } from './Status.jsx'

// Generic controlled form driven by a list of field definitions. Used for
// sign-in, sign-up, contact, project and qualification forms.
//
// Handles: per-field client validation, server validation errors mapped back
// to fields, a submitting state, and success / error messages.
//
// onSubmit(cleanedValues) should return a Promise; throw (e.g. ApiError) to fail.

const emptyValues = (fields) => Object.fromEntries(fields.map((f) => [f.name, '']))

function RecordForm({
  fields,
  initialValues,
  onSubmit,
  submitLabel = 'Save',
  submittingLabel = 'Saving…',
  successMessage = '',
  resetOnSuccess = false,
  onCancel,
  className = 'record-form',
  idPrefix = 'form',
}) {
  const [values, setValues] = useState(() => ({ ...emptyValues(fields), ...initialValues }))
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null) // { type: 'success' | 'error', message }
  const [submitting, setSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
    // Clear a field's error as soon as the user edits it
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  function handleBlur(event) {
    const field = fields.find((f) => f.name === event.target.name)
    if (!field || !values[field.name]) return
    const fieldErrors = validateFields([field], values)
    if (fieldErrors[field.name]) setErrors((prev) => ({ ...prev, ...fieldErrors }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus(null)

    const clientErrors = validateFields(fields, values)
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors)
      setStatus({ type: 'error', message: 'Please fix the highlighted fields.' })
      return
    }

    setSubmitting(true)
    try {
      await onSubmit(cleanValues(fields, values))
      setErrors({})
      if (resetOnSuccess) setValues({ ...emptyValues(fields), ...initialValues })
      if (successMessage) setStatus({ type: 'success', message: successMessage })
    } catch (err) {
      if (err instanceof ApiError && err.details?.length) {
        setErrors(Object.fromEntries(err.details.map((d) => [d.field, d.message])))
      }
      setStatus({ type: 'error', message: err.message || 'Something went wrong. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className={className} onSubmit={handleSubmit} noValidate>
      {fields.map((field) => {
        const id = `${idPrefix}-${field.name}`
        const errorId = `${id}-error`
        const common = {
          id,
          name: field.name,
          value: values[field.name] ?? '',
          onChange: handleChange,
          onBlur: handleBlur,
          required: field.required,
          autoComplete: field.autoComplete,
          placeholder: field.placeholder,
          disabled: submitting,
          'aria-invalid': Boolean(errors[field.name]),
          'aria-describedby': errors[field.name] ? errorId : undefined,
        }
        return (
          <div className="form-field" key={field.name}>
            <label htmlFor={id}>
              {field.label}
              {field.required && <span className="required-mark" aria-hidden="true"> *</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea rows={field.rows || 5} {...common} />
            ) : (
              <input type={field.type || 'text'} {...common} />
            )}
            {field.hint && !errors[field.name] && <small className="field-hint">{field.hint}</small>}
            {errors[field.name] && (
              <small id={errorId} className="field-error">
                {errors[field.name]}
              </small>
            )}
          </div>
        )
      })}

      {status && <Alert type={status.type}>{status.message}</Alert>}

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? submittingLabel : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default RecordForm
