import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Logo from './Logo.jsx'

// Site-wide navigation bar: the six portfolio views plus authentication
// controls. Links to protected views only appear when they are usable.
const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/education', label: 'Education' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
]

const linkClass = ({ isActive }) => (isActive ? 'active' : '')

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, isAuthenticated, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()
  const close = () => setMenuOpen(false)

  async function handleSignOut() {
    close()
    await signOut()
    navigate('/', { state: { flash: 'You have been signed out.' } })
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand" onClick={close}>
          <Logo size={36} />
          <span className="brand-text">Michael Johnson</span>
        </NavLink>

        <button
          className="menu-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass} onClick={close}>
              {link.label}
            </NavLink>
          ))}

          <span className="nav-divider" aria-hidden="true" />

          {isAuthenticated ? (
            <>
              <NavLink to="/messages" className={linkClass} onClick={close}>
                Messages
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" className={linkClass} onClick={close}>
                  Admin
                </NavLink>
              )}
              <span className="nav-user" title={user?.email}>
                {user?.name?.split(' ')[0]}
                <span className={`badge ${isAdmin ? 'badge-admin' : 'badge-user'}`}>{user?.role}</span>
              </span>
              <button type="button" className="btn-secondary btn-small" onClick={handleSignOut}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/signin" className={linkClass} onClick={close}>
                Sign in
              </NavLink>
              <NavLink to="/signup" className="btn-primary btn-small nav-cta" onClick={close}>
                Sign up
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
