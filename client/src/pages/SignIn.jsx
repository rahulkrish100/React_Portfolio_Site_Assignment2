import { Link, useLocation, useNavigate } from 'react-router-dom'
import RecordForm from '../components/RecordForm.jsx'
import { Alert } from '../components/Status.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const FIELDS = [
  { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
  { name: 'password', label: 'Password', type: 'password', required: true, autoComplete: 'current-password' },
]

function SignIn() {
  const { signIn, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  // Where ProtectedRoute sent the user from, if anywhere
  const from = location.state?.from

  async function handleSubmit(values) {
    const signedIn = await signIn(values)
    const destination = from || (signedIn.role === 'admin' ? '/admin' : '/')
    navigate(destination, {
      replace: true,
      state: { flash: `Signed in as ${signedIn.name} (${signedIn.role}).` },
    })
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Sign in</h1>
        {from && <Alert type="info">Please sign in to continue.</Alert>}
        {isAuthenticated && (
          <Alert type="info">
            You are already signed in as {user?.email}. Signing in again will switch accounts.
          </Alert>
        )}
        <RecordForm
          idPrefix="signin"
          className="record-form"
          fields={FIELDS}
          onSubmit={handleSubmit}
          submitLabel="Sign in"
          submittingLabel="Signing in…"
        />
        <p className="auth-switch">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </section>
  )
}

export default SignIn
