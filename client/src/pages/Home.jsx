import { Link } from 'react-router-dom'
import Logo from '../components/Logo.jsx'

// Home view: welcome message, mission statement, and a call-to-action
// button that routes visitors to the About page.
function Home() {
  return (
    <section className="hero">
      <div className="hero-logo">
        <Logo size={80} />
      </div>
      <h1>Welcome — I'm Michael Johnson</h1>
      <p className="tagline">Full-Stack Developer &amp; Problem Solver</p>
      <p className="mission">
        My mission is to build software that's clear, reliable, and genuinely
        useful: breaking complex problems into simple, testable pieces, and
        crafting tools that hold up under real-world use.
      </p>
      <Link to="/about" className="btn-primary">
        Learn more about me
      </Link>
    </section>
  )
}

export default Home
