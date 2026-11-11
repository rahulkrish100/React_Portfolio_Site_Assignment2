import { Link } from 'react-router-dom'
import { Alert, EmptyState, Loading } from '../components/Status.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { formatDate } from '../lib/validators.js'
import useApiList from '../lib/useApiList.js'

// Education view: qualifications loaded from GET /api/qualifications (MongoDB),
// shown newest first as a timeline. Public and read-only.
function Education() {
  const { isAdmin } = useAuth()
  const { items, loading, error, reload } = useApiList('/api/qualifications')
  const qualifications = [...items].sort((a, b) => new Date(b.completion) - new Date(a.completion))

  return (
    <section className="education">
      <div className="page-heading">
        <h1>Education</h1>
        {isAdmin && (
          <Link to="/admin?tab=qualifications" className="btn-secondary btn-small">
            Manage qualifications
          </Link>
        )}
      </div>

      {loading && <Loading label="Loading qualifications…" />}
      {!loading && error && (
        <Alert type="error">
          Could not load qualifications: {error}{' '}
          <button type="button" className="link-button" onClick={reload}>
            Try again
          </button>
        </Alert>
      )}
      {!loading && !error && qualifications.length === 0 && (
        <EmptyState>No qualifications have been added yet.</EmptyState>
      )}

      {!loading && !error && qualifications.length > 0 && (
        <ol className="timeline">
          {qualifications.map((item) => (
            <li key={item._id}>
              <span className="timeline-year">{formatDate(item.completion, { year: 'numeric', month: 'short' })}</span>
              <div>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

export default Education
