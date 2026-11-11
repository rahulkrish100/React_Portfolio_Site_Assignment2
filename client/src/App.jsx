import { useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer.jsx'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { Alert } from './components/Status.jsx'
import About from './pages/About.jsx'
import Admin from './pages/Admin.jsx'
import Contact from './pages/Contact.jsx'
import Education from './pages/Education.jsx'
import Home from './pages/Home.jsx'
import Messages from './pages/Messages.jsx'
import NotFound from './pages/NotFound.jsx'
import Projects from './pages/Projects.jsx'
import Services from './pages/Services.jsx'
import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp.jsx'

// Page shell (nav + routed content + footer) and route table.
//   Public:            /, /about, /projects, /education, /services, /contact, /signin, /signup
//   Signed-in users:   /messages   (read-only for regular users)
//   Administrators:    /admin      (create / update / delete)
function App() {
  const location = useLocation()

  // One-time confirmation messages passed through navigation state,
  // e.g. navigate('/', { state: { flash: 'Signed in' } })
  const [dismissedKey, setDismissedKey] = useState(null)
  const flash = dismissedKey === location.key ? null : location.state?.flash

  return (
    <div className="site-wrapper">
      <Navbar />
      <main className="page-content">
        {flash && (
          <Alert type="success" onDismiss={() => setDismissedKey(location.key)}>
            {flash}
          </Alert>
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/education" element={<Education />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
