import { useNavigate } from 'react-router-dom'
import RecordForm from '../components/RecordForm.jsx'
import { contactFields } from '../config/resources.js'
import { api } from '../lib/api.js'

// Contact view: contact details plus a validated form (first name, last name,
// phone, email, message). Submissions are POSTed to /api/contacts and saved in
// MongoDB; on success the visitor is returned to Home with a confirmation.
function Contact() {
  const navigate = useNavigate()

  async function handleSubmit(values) {
    const saved = await api.post('/api/contacts', values, { auth: false })
    navigate('/', {
      state: { flash: `Thanks, ${saved.firstName} — your message was received and saved.` },
    })
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

        <RecordForm
          idPrefix="contact"
          className="contact-form"
          fields={contactFields}
          onSubmit={handleSubmit}
          submitLabel="Send message"
          submittingLabel="Sending…"
        />
      </div>
    </section>
  )
}

export default Contact
