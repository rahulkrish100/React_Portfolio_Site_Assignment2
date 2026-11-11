import { Link } from 'react-router-dom'
import ProjectIcon from '../components/ProjectIcon.jsx'
import { Alert, EmptyState, Loading } from '../components/Status.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { formatDate } from '../lib/validators.js'
import useApiList from '../lib/useApiList.js'

// Projects view: public, read-only list loaded from GET /api/projects (MongoDB).
// Administrators get a shortcut to the dashboard where projects are managed.
const ICONS = ['orbit', 'prism', 'ledger']

function Projects() {
  const { isAdmin } = useAuth()
  const { items: projects, loading, error, reload } = useApiList('/api/projects')

  return (
    <section className="projects">
      <div className="page-heading">
        <h1>Projects</h1>
        {isAdmin && (
          <Link to="/admin?tab=projects" className="btn-secondary btn-small">
            Manage projects
          </Link>
        )}
      </div>

      {loading && <Loading label="Loading projects…" />}
      {!loading && error && (
        <Alert type="error">
          Could not load projects: {error}{' '}
          <button type="button" className="link-button" onClick={reload}>
            Try again
          </button>
        </Alert>
      )}
      {!loading && !error && projects.length === 0 && <EmptyState>No projects have been added yet.</EmptyState>}

      {!loading && !error && projects.length > 0 && (
        <div className="project-grid">
          {projects.map((project, index) => (
            <article className="project-card" key={project._id}>
              <ProjectIcon name={ICONS[index % ICONS.length]} />
              <h2>{project.title}</h2>
              <p className="record-meta">Completed {formatDate(project.completion, { year: 'numeric', month: 'long' })}</p>
              <p>{project.description}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default Projects
