import { Link } from 'react-router-dom'
import ResourceManager from '../components/ResourceManager.jsx'
import { Alert } from '../components/Status.jsx'
import { RESOURCES } from '../config/resources.js'
import { useAuth } from '../context/AuthContext.jsx'

// Contact submissions. Any signed-in user can read them (route is wrapped in
// <ProtectedRoute>); only administrators get edit/delete controls.
function Messages() {
  const { isAdmin, user } = useAuth()

  return (
    <section className="messages">
      <h1>Contact messages</h1>
      {isAdmin ? (
        <Alert type="info">
          You are an administrator. Manage messages here or in the <Link to="/admin?tab=contacts">admin dashboard</Link>.
        </Alert>
      ) : (
        <Alert type="info">
          Read-only view: you are signed in as {user?.email} with the <strong>user</strong> role.
        </Alert>
      )}
      <ResourceManager resource={RESOURCES.contacts} canEdit={isAdmin} />
    </section>
  )
}

export default Messages
