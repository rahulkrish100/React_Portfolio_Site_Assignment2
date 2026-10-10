import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Contact view: displays contact information and a form that captures
// first name, last name, phone number, email, and message. On submit the
// values are POSTed to the Express API (/api/contacts), saved in MongoDB,
// and the visitor is returned to the Home page.
const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  message: '',
}

function Contact() {
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const navigate = useNavigate()

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSending(true)
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.details?.[0]?.message || data.error || 'Could not send message')
      }
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="contact">
      <h1>Contact</h1>
      <div className="contact-grid">
        <div className="contact-info">
          <h2>Get in touch</h2>
          <p>Email: michael.johnson@example.com</p>
          <p>Phone: +44 20 7946 0142</p>
          <p>Location: London, UK</p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <label htmlFor="firstName">First name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            required
          />

          <label htmlFor="lastName">Last name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            required
          />

          <label htmlFor="phone">Contact number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          />

          {error && <p role="alert" className="form-error">{error}</p>}

          <button type="submit" className="btn-primary" disabled={sending}>
            {sending ? 'Sending…' : 'Send message'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default Contact
