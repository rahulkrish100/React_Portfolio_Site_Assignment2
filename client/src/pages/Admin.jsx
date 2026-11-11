import { useSearchParams } from 'react-router-dom'
import ResourceManager from '../components/ResourceManager.jsx'
import { RESOURCES } from '../config/resources.js'
import { useAuth } from '../context/AuthContext.jsx'

const TABS = [RESOURCES.projects, RESOURCES.qualifications, RESOURCES.contacts]

// Administrator dashboard (route is wrapped in <ProtectedRoute requireAdmin>).
// Full create / read / update / delete for projects, qualifications and contacts.
function Admin() {
  const { user } = useAuth()
  const [params, setParams] = useSearchParams()
  const active = TABS.find((t) => t.key === params.get('tab')) || TABS[0]

  return (
    <section className="admin">
      <h1>Admin dashboard</h1>
      <p className="muted">
        Signed in as <strong>{user?.email}</strong> <span className="badge badge-admin">admin</span> — you can
        create, edit and delete records.
      </p>

      <div className="tabs" role="tablist" aria-label="Record types">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={tab.key === active.key}
            className={tab.key === active.key ? 'tab active' : 'tab'}
            onClick={() => setParams({ tab: tab.key })}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* key forces a fresh list + form state when switching tabs */}
      <ResourceManager key={active.key} resource={active} canEdit />
    </section>
  )
}

export default Admin
