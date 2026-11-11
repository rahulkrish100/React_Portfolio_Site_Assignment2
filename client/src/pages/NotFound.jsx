import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="status-page">
      <h1>Page not found</h1>
      <p>The page you were looking for does not exist.</p>
      <Link to="/" className="btn-primary">
        Back to home
      </Link>
    </section>
  )
}

export default NotFound
