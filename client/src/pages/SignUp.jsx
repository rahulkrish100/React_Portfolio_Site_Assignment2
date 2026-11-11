import { Link, useNavigate } from 'react-router-dom'
import RecordForm from '../components/RecordForm.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const FIELDS = [
  { name: 'name', label: 'Full name', required: true, maxLength: 80, autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    required: true,
    minLength: 8,
    autoComplete: 'new-password',
    hint: 'At least 8 characters.',
  },
  {
    name: 'confirmPassword',
    label: 'Confirm password',
    type: 'password',
    required: true,
    match: 'password',
    matchMessage: 'Passwords do not match',
    autoComplete: 'new-password',
    excludeFromPayload: true,
  },
]

function SignUp() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(values) {
    const user = await signUp(values)
    navigate('/', {
      replace: true,
      state: { flash: `Welcome, ${user.name}! Your account was created and you are signed in (${user.role}).` },
    })
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Create an account</h1>
        <p className="muted">
          New accounts are regular users and can view projects, qualifications and messages.
        </p>
        <RecordForm
          idPrefix="signup"
          fields={FIELDS}
          onSubmit={handleSubmit}
          submitLabel="Sign up"
          submittingLabel="Creating account…"
        />
        <p className="auth-switch">
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      </div>
    </section>
  )
}

export default SignUp
